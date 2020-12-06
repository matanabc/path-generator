import IllegalSpline from './errors/illegal-spline';
import PathConfig from './path_config/path-config';
import Waypoint from './waypoints/waypoint';
import { boundRadians, d2r } from './util';
import * as error from './errors/error';
import Coord from './coord';

export default class Spline {
	private c: number = 0;
	private d: number = 0;
	private e: number = 0;

	private sampleCount: number = 100000;
	private knot_distance: number = 0;
	private angle_offset: number = 0;
	private x_offset: number = 0;
	private y_offset: number = 0;

	public pathConfig: PathConfig;
	public startPoint: Waypoint;
	private endPoint: Waypoint;

	arc_length: number = 0;
	vEnd: number = 0;
	vMax: number = 0;
	acc: number = 0;
	V0: number = 0;

	constructor(startPoint: Waypoint, endPoint: Waypoint, pathConfig: PathConfig) {
		this.pathConfig = pathConfig;
		this.startPoint = startPoint;
		this.endPoint = endPoint;

		this.fit_hermite_cubic(startPoint, endPoint);
		this.calculateDistance();
		this.setVellAndAcc(startPoint, endPoint, pathConfig);
	}

	private fit_hermite_cubic(startPoint: Waypoint, endPoint: Waypoint): void {
		this.knot_distance = Math.sqrt(
			(endPoint.x - startPoint.x) * (endPoint.x - startPoint.x) +
				(endPoint.y - startPoint.y) * (endPoint.y - startPoint.y)
		);
		this.angle_offset = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
		const a0_delta = Math.tan(boundRadians(d2r(startPoint.angle) - this.angle_offset));
		const a1_delta = Math.tan(boundRadians(d2r(endPoint.angle) - this.angle_offset));
		this.c = (a0_delta + a1_delta) / (this.knot_distance * this.knot_distance);
		this.d = -(2 * a0_delta + a1_delta) / this.knot_distance;
		this.e = a0_delta;
		this.x_offset = startPoint.x;
		this.y_offset = startPoint.y;
	}

	private calculateDistance(): void {
		var t = 0,
			dydt = 0,
			integrand = 0,
			deriv0 = this.deriv(t),
			last_integrand = Math.sqrt(1 + deriv0 * deriv0) / this.sampleCount;
		for (let i = 0; i <= this.sampleCount; i = i + 1) {
			t = i / this.sampleCount;
			dydt = this.deriv(t);
			integrand = Math.sqrt(1 + dydt * dydt) / this.sampleCount;
			this.arc_length += (integrand + last_integrand) / 2;
			last_integrand = integrand;
		}
		this.arc_length = this.knot_distance * this.arc_length;
	}

	private setVellAndAcc(startPoint: Waypoint, endPoint: Waypoint, pathConfig: PathConfig): void {
		this.acc = Math.abs(pathConfig.acc);
		this.V0 = Math.min(Math.abs(startPoint.v), Math.abs(pathConfig.vMax));
		this.vEnd = Math.min(Math.abs(endPoint.v), Math.abs(pathConfig.vMax));
		this.vMax = Math.min(Math.abs(startPoint.vMax), this.getVMax());
	}

	private getVMax(): number {
		return Math.min(
			Math.sqrt(
				(2 * this.arc_length * this.acc * this.acc +
					this.V0 * this.V0 * this.acc +
					this.vEnd * this.vEnd * this.acc) /
					(this.acc + this.acc)
			),
			Math.abs(this.pathConfig.vMax)
		);
	}

	private deriv(percentage: number): number {
		const x = percentage * this.knot_distance;
		return (3 * this.c * x + 2 * this.d) * x + this.e;
	}

	getPositionCoords(pos_relative: number): Coord {
		const percentage = pos_relative / this.arc_length;
		const x = percentage * this.knot_distance;
		const y = (this.c * x + this.d) * (x * x) + this.e * x;
		const cos_theta = Math.cos(this.angle_offset);
		const sin_theta = Math.sin(this.angle_offset);
		return new Coord(
			x * cos_theta - y * sin_theta + this.x_offset,
			x * sin_theta + y * cos_theta + this.y_offset,
			boundRadians(Math.atan(this.deriv(percentage)) + this.angle_offset)
		);
	}

	getError(): IllegalSpline | undefined {
		if (this.startPoint.vMax === 0) return error.vMaxEqualTo0();
		if (this.arc_length > 20) return error.splineIsToLong();
		if (this.vMax < this.vEnd)
			return error.vMaxSmallerThenVEnd(this.V0, this.vEnd, this.vMax, this.getVMax());
	}
}
