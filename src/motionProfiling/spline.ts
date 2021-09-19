import PathConfig from '../path/path-config';
import Waypoint from '../waypoints/waypoint';
import { SplineIsToLong } from './errors';
import Coord from './coord';
import Line from './line';
import Arc from './arc';

export default class Spline extends Line {
	protected _pathConfig: PathConfig;
	protected _startPoint: Waypoint;
	protected _endPoint: Waypoint;
	protected _arc: Arc;

	constructor(startPoint: Waypoint, endPoint: Waypoint, pathConfig: PathConfig) {
		const arc = new Arc(startPoint, endPoint);
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
		this._startPoint.vMax = Number(this.vMax.toFixed(3));
	}

	getPositionCoords(pos_relative: number): Coord {
		return this._arc.getPositionCoords(pos_relative);
	}

	checkForError(): void {
		super.checkForError();
		if (this.distance > 20) throw new SplineIsToLong();
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
