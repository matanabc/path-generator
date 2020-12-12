export default class Waypoint {
	protected _angle: number;
	protected _vMax: number;
	protected _x: number;
	protected _y: number;
	protected _v: number;

	/**
	 * @param x				Waypoint X
	 * @param y				Waypoint Y
	 * @param angle 		Waypoint angle
	 * @param v 			Robot velocity
	 * @param vMax 			Max velocity to next waypoint
	 */
	constructor(x: number = 0, y: number = 0, angle: number = 0, v: number = 0, vMax: number = 0) {
		this._angle = angle;
		this._vMax = vMax;
		this._x = x;
		this._v = v;
		this._y = y;
	}

	get x(): number {
		return this._x;
	}

	get y(): number {
		return this._y;
	}

	get v(): number {
		return this._v;
	}

	get vMax(): number {
		return this._vMax;
	}

	get angle(): number {
		return this._angle;
	}

	getInfo(): string {
		return `(${this._x},${this._y})`;
	}
}
