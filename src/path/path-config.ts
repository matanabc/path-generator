export default class PathConfig {
	protected _acc: number;
	protected _vMax: number;
	protected _width: number;
	protected _robotLoopTime: number;

	constructor(width: number = 0, vMax: number = 0, acc: number = 0, robotLoopTime: number = 0.02) {
		this._acc = acc;
		this._vMax = vMax;
		this._width = width;
		this._robotLoopTime = robotLoopTime;
	}

	get acc(): number {
		return this._acc;
	}

	get vMax(): number {
		return this._vMax;
	}

	get width(): number {
		return this._width;
	}

	get robotLoopTime(): number {
		return this._robotLoopTime;
	}
}
