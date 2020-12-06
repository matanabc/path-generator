import IllegalSpline from './errors/illegal-spline';
import PathConfig from './path_config/path-config';
import Waypoint from './waypoints/waypoint';
import { boundRadians, d2r } from './util';
import * as error from './errors/error';
import Coord from './coord';

export default class Spline {
	protected sampleCount: number = 100000;
	protected knot_distance: number = 0;
	protected angle_offset: number = 0;
	protected _pathConfig: PathConfig;
	protected _arc_length: number = 0;
	protected _startPoint: Waypoint;
	protected x_offset: number = 0;
	protected y_offset: number = 0;
	protected _endPoint: Waypoint;
	protected _vEnd: number = 0;
	protected _vMax: number = 0;
	protected _acc: number = 0;
	protected _V0: number = 0;
	protected c: number = 0;
	protected d: number = 0;
	protected e: number = 0;

	constructor(startPoint: Waypoint, endPoint: Waypoint, pathConfig: PathConfig) {
		this._pathConfig = pathConfig;
		this._startPoint = startPoint;
		this._endPoint = endPoint;

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
			this._arc_length += (integrand + last_integrand) / 2;
			last_integrand = integrand;
		}
		this._arc_length = this.knot_distance * this.arc_length;
	}

	private setVellAndAcc(startPoint: Waypoint, endPoint: Waypoint, pathConfig: PathConfig): void {
		this._acc = Math.abs(pathConfig.acc);
		this._V0 = Math.min(Math.abs(startPoint.v), Math.abs(pathConfig.vMax));
		this._vEnd = Math.min(Math.abs(endPoint.v), Math.abs(pathConfig.vMax));
		this._vMax = Math.min(Math.abs(startPoint.vMax), this.getVMax());
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

	get startPoint(): Waypoint {
		return this._startPoint;
	}

	get endPoint(): Waypoint {
		return this._endPoint;
	}

	get pathConfig(): PathConfig {
		return this._pathConfig;
	}

	get arc_length(): number {
		return this._arc_length;
	}

	get vMax(): number {
		return this._vMax;
	}

	get vEnd(): number {
		return this._vEnd;
	}

	get V0(): number {
		return this._V0;
	}

	get acc(): number {
		return this._acc;
	}
}
