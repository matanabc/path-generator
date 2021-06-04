export default class Coord {
	protected _x: number;
	protected _y: number;
	protected _angle: number;

	constructor(x: number, y: number, angle: number) {
		this._x = x;
		this._y = y;
		this._angle = angle;
	}

	get x(): number {
		return this._x;
	}

	get y(): number {
		return this._y;
	}

	get angle(): number {
		return this._angle;
	}

	set angle(angle: number) {
		this._angle = angle;
	}
}
