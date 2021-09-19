import { PathGeneratorError } from '../motionProfiling/errors';
import Setpoint from '../motionProfiling/setpoint';
import Spline from '../motionProfiling/spline';
import Coord from '../motionProfiling/coord';
import { PathConfig, Waypoint } from '..';
import Trajectory from './trajectory';

export default class SplineTrajectory extends Trajectory {
	constructor(waypoints: Waypoint[], pathConfig: PathConfig, index?: number) {
		super(waypoints, pathConfig, index);
	}

	protected generate(index?: number): void {
		for (let i = 0; i < this.waypoints.length - 1; i++) {
			const spline = this.generateSpline(this.waypoints[i], this.waypoints[i + 1], index || i);
			const segments = this.generateSegments(spline);
			const setpoints = this.generateSetpoints(segments, this._distance);
			const coords = this.generateCoords(spline, setpoints, this._distance);
			this._distance += spline.distance;
			this._setpoints.push(...setpoints);
			this._segments.push(...segments);
			this._coords.push(...coords);
		}
	}

	protected generateSpline(startWaypoint: Waypoint, endWaypoint: Waypoint, index: number): Spline {
		try {
			return new Spline(startWaypoint, endWaypoint, this.pathConfig);
		} catch (error) {
			if (error instanceof PathGeneratorError) error.addErrorPosition(index);
			throw error;
		}
	}

	generateCoords(spline: Spline, setpoints: Setpoint[], startPosition: number): Coord[] {
		return setpoints.map((setpoint) => spline.getPositionCoords(setpoint.position - startPosition));
	}
}
