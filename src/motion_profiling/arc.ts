import { Coord, Waypoint } from '../common/types';
import { boundRadians, degreesToRadians } from '../common/utils';

export default class Arc {
	protected sampleCount: number = 100000;
	protected knot_distance: number = 0;
	protected angle_offset: number = 0;
	protected _arc_length: number = 0;
	protected x_offset: number = 0;
	protected y_offset: number = 0;
	protected c: number = 0;
	protected d: number = 0;
	protected e: number = 0;

	public constructor(startPoint: Waypoint, endPoint: Waypoint) {
		this.fit_hermite_cubic(startPoint, endPoint);
		this.calculateDistance();
	}

	private fit_hermite_cubic(startPoint: Waypoint, endPoint: Waypoint): void {
		this.knot_distance = Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2));
		this.angle_offset = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
		const a0_delta = Math.tan(boundRadians(degreesToRadians(startPoint.heading) - this.angle_offset));
		const a1_delta = Math.tan(boundRadians(degreesToRadians(endPoint.heading) - this.angle_offset));
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
		this._arc_length = this.knot_distance * this._arc_length;
	}

	private deriv(percentage: number): number {
		const x = percentage * this.knot_distance;
		return (3 * this.c * x + 2 * this.d) * x + this.e;
	}

	public getPositionCoords(pos_relative: number): Coord {
		const percentage = pos_relative / this._arc_length;
		const x = percentage * this.knot_distance;
		const y = (this.c * x + this.d) * (x * x) + this.e * x;
		const cos_theta = Math.cos(this.angle_offset);
		const sin_theta = Math.sin(this.angle_offset);
		return {
			x: x * cos_theta - y * sin_theta + this.x_offset,
			y: x * sin_theta + y * cos_theta + this.y_offset,
			z: Math.atan(this.deriv(percentage)) + this.angle_offset,
		};
	}

	public get arc_length(): number {
		return Number.isNaN(this._arc_length) ? 0 : this._arc_length;
	}
}
