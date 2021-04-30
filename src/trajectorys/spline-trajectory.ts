import IllegalPath from '../errors/illegal-path';
import Spline from '../motionProfiling/spline';
import Setpoint from '../setpoint/setpoint';
import { PathConfig, Waypoint } from '..';
import Trajectory from './trajectory';
import Coord from '../coord/coord';

export default class SplineTrajectory extends Trajectory {
	constructor(waypoints: Waypoint[], pathConfig: PathConfig) {
		super(waypoints, pathConfig);
	}

	generate(): void {
		let lastPosition = 0;
		for (let i = 0; i < this.waypoints.length - 1; i++) {
			const spline = this.generateSpline(this.waypoints[i], this.waypoints[i + 1]);
			if (this.error !== undefined) break;
			const segments = this.generateSegments(spline);
			const setpoints = this.generateSetpoints(segments, lastPosition);
			const coords = this.generateCoords(spline, setpoints, lastPosition);
			lastPosition += spline.distance;
			this._setpoints.push(...setpoints);
			this._segments.push(...segments);
			this._coords.push(...coords);
		}
	}

	protected generateSpline(startWaypoint: Waypoint, endWaypoint: Waypoint): Spline {
		const spline = new Spline(startWaypoint, endWaypoint, this.pathConfig);
		const splineError = spline.getError();
		if (splineError !== undefined)
			this.error = new IllegalPath(
				`Spline ${startWaypoint.getInfo()} to ${endWaypoint.getInfo()} is illegal!`,
				splineError
			);
		return spline;
	}

	generateCoords(spline: Spline, setpoints: Setpoint[], startPosition: number): Coord[] {
		return setpoints.map((setpoint) => spline.getPositionCoords(setpoint.position - startPosition));
	}
}
