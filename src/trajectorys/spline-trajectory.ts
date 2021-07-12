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
		let lastPosition = 0;
		for (let i = 0; i < this.waypoints.length - 1; i++) {
			const spline = this.generateSpline(this.waypoints[i], this.waypoints[i + 1], index || i);
			const segments = this.generateSegments(spline);
			const setpoints = this.generateSetpoints(segments, lastPosition);
			const coords = this.generateCoords(spline, setpoints, lastPosition);
			lastPosition += spline.distance;
			this._setpoints.push(...setpoints);
			this._segments.push(...segments);
			this._coords.push(...coords);
		}
	}

	protected generateSpline(startWaypoint: Waypoint, endWaypoint: Waypoint, index: number): Spline {
		try {
			const spline = new Spline(startWaypoint, endWaypoint, this.pathConfig);
			return spline;
		} catch (error) {
			if (error instanceof PathGeneratorError) error.addErrorPosition(index);
			throw error;
		}
	}

	generateCoords(spline: Spline, setpoints: Setpoint[], startPosition: number): Coord[] {
		return setpoints.map((setpoint) => spline.getPositionCoords(setpoint.position - startPosition));
	}
}
