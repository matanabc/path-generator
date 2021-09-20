import { PathGeneratorError } from '../motionProfiling/errors';
import Setpoint from '../motionProfiling/setpoint';
import Spline from '../motionProfiling/spline';
import Coord from '../motionProfiling/coord';
import { PathConfig, Waypoint } from '..';
import Trajectory from './trajectory';

export default class SplineTrajectory extends Trajectory {
	constructor(waypoints: Waypoint[], pathConfig: PathConfig) {
		super(waypoints, pathConfig);
		this.generateTrajectory();
	}

	protected generate(index: number): void {
		const spline = new Spline(this.waypoints[index], this.waypoints[index + 1], this.pathConfig);
		const segments = this.generateSegments(spline);
		const setpoints = this.generateSetpoints(segments, this._distance);
		const coords = this.generateCoords(spline, setpoints, this._distance);
		this._distance += spline.distance;
		this._setpoints.push(...setpoints);
		this._segments.push(...segments);
		this._coords.push(...coords);
	}

	generateCoords(spline: Spline, setpoints: Setpoint[], startPosition: number): Coord[] {
		return setpoints.map((setpoint) => spline.getPositionCoords(setpoint.position - startPosition));
	}
}
