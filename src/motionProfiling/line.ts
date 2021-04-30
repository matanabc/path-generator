import IllegalSpline from '../errors/illegal-spline';
import * as error from '../errors/error';
import { Waypoint } from '..';

export default class Line {
	protected _distance: number = 0;
	protected _vEnd: number = 0;
	protected _vMax: number = 0;
	protected _acc: number = 0;
	protected _V0: number = 0;

	constructor(distance: number = 0, acc: number = 0, V0: number = 0, vEnd: number = 0, vMax: number = 0) {
		this._distance = distance;
		this._vEnd = vEnd;
		this._vMax = this.getVMax(vMax);
		this._acc = acc;
		this._V0 = V0;
	}

	public getWaypoints(): Waypoint[] {
		return [new Waypoint(0, 0, 0, this.V0, this.vMax), new Waypoint(this.distance, 0, 0, this.vEnd, this.vMax)];
	}

	protected getVMax(vMax: number = 0): number {
		return Math.min(
			Math.sqrt(
				(2 * this.distance * this.acc * this.acc +
					this.V0 * this.V0 * this.acc +
					this.vEnd * this.vEnd * this.acc) /
					(this.acc + this.acc)
			),
			Math.abs(vMax)
		);
	}

	getError(): IllegalSpline | undefined {
		if (this.vMax === 0) return error.vMaxEqualTo0();
		if (this.vMax < this.vEnd) return error.vMaxSmallerThenVEnd(this.V0, this.vEnd, this.vMax, this.getVMax());
	}

	getInfo(): string {
		return `(Distance: ${this.distance}, Acc: ${this.acc}, v0: ${this.V0}, vMax: ${this.vMax}, vEnd: ${this.vEnd})`;
	}

	get distance(): number {
		return 0;
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
