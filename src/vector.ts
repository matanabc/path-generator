import { Util } from '.';

export default class Vector {
	protected _x: number;
	protected _y: number;
	protected _rotation: number;

	constructor(x: number = 0, y: number = 0, rotation: number = 0) {
		this._x = x;
		this._y = y;
		this._rotation = rotation;
	}

	fieldOriented(angle: number): void {
		const angleRad = Util.d2r(angle);
		const temp = this._x * Math.cos(angleRad) + this._y * Math.sin(angleRad);
		this._y = -this._x * Math.sin(angleRad) + this._y * Math.cos(angleRad);
		this._x = temp;
	}

	get x(): number {
		return this._x;
	}

	get y(): number {
		return this._y;
	}

	get rotation(): number {
		return this._rotation;
	}
}
