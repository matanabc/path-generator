import IllegalSpline from '../errors/illegal-spline';
import PathConfig from '../path/path-config';
import Waypoint from '../waypoints/waypoint';
import * as error from '../errors/error';
import Coord from '../coord/coord';
import Arc from './arc';
import Line from './line';

export default class Spline extends Line {
	protected _pathConfig: PathConfig;
	protected _startPoint: Waypoint;
	protected _endPoint: Waypoint;
	protected _arc: Arc;

	constructor(startPoint: Waypoint, endPoint: Waypoint, pathConfig: PathConfig) {
		const arc = new Arc(startPoint, endPoint, pathConfig);
		super(
			Math.abs(arc.arc_length),
			Math.abs(pathConfig.acc),
			Math.abs(Math.min(startPoint.v, pathConfig.vMax)),
			Math.abs(Math.min(endPoint.v, pathConfig.vMax)),
			Math.abs(Math.min(startPoint.vMax, pathConfig.vMax))
		);
		this._arc = arc;
		this._pathConfig = pathConfig;
		this._startPoint = startPoint;
		this._endPoint = endPoint;
	}

	private setVellAndAcc(): void {
		this._acc = Math.abs(this.pathConfig.acc);
		this._V0 = Math.min(Math.abs(this.startPoint.v), Math.abs(this.pathConfig.vMax));
		this._vEnd = Math.min(Math.abs(this.endPoint.v), Math.abs(this.pathConfig.vMax));
		this._vMax = Math.min(Math.abs(this.startPoint.vMax), this.getVMax(this.pathConfig.vMax));
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
}
