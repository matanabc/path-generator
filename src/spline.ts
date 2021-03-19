import IllegalSpline from './errors/illegal-spline';
import PathConfig from './path/path-config';
import Waypoint from './waypoints/waypoint';
import * as error from './errors/error';
import Coord from './coord/coord';
import Arc from './arc';

export default class Spline {
	protected _pathConfig: PathConfig;
	protected _startPoint: Waypoint;
	protected _endPoint: Waypoint;
	protected _vEnd: number = 0;
	protected _vMax: number = 0;
	protected _acc: number = 0;
	protected _V0: number = 0;
	protected _arc: Arc;

	constructor(startPoint: Waypoint, endPoint: Waypoint, pathConfig: PathConfig) {
		this._arc = new Arc(startPoint, endPoint, pathConfig);
		this._pathConfig = pathConfig;
		this._startPoint = startPoint;
		this._endPoint = endPoint;
		this.setVellAndAcc();
	}

	private setVellAndAcc(): void {
		this._acc = Math.abs(this.pathConfig.acc);
		this._V0 = Math.min(Math.abs(this.startPoint.v), Math.abs(this.pathConfig.vMax));
		this._vEnd = Math.min(Math.abs(this.endPoint.v), Math.abs(this.pathConfig.vMax));
		this._vMax = Math.min(Math.abs(this.startPoint.vMax), this.getVMax());
	}

	private getVMax(): number {
		return Math.min(
			Math.sqrt(
				(2 * this.distance * this.acc * this.acc +
					this.V0 * this.V0 * this.acc +
					this.vEnd * this.vEnd * this.acc) /
					(this.acc + this.acc)
			),
			Math.abs(this.pathConfig.vMax)
		);
	}

	getPositionCoords(pos_relative: number): Coord {
		return this._arc.getPositionCoords(pos_relative);
	}

	getError(): IllegalSpline | undefined {
		if (this.startPoint.vMax === 0) return error.vMaxEqualTo0();
		if (this.distance > 20) return error.splineIsToLong();
		if (this.vMax < this.vEnd) return error.vMaxSmallerThenVEnd(this.V0, this.vEnd, this.vMax, this.getVMax());
	}

	get pathConfig(): PathConfig {
		return this._pathConfig;
	}

	get startPoint(): Waypoint {
		return this._startPoint;
	}

	get endPoint(): Waypoint {
		return this._endPoint;
	}

	get distance(): number {
		return this._arc.arc_length;
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
