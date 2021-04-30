import IllegalPath from '../errors/illegal-path';
import Setpoint from '../setpoint/setpoint';
import Line from '../motionProfiling/line';
import { PathConfig, Waypoint } from '..';
import Trajectory from './trajectory';
import Coord from '../coord/coord';

export default class LineTrajectory extends Trajectory {
	constructor(waypoints: Waypoint[], pathConfig: PathConfig) {
		super(waypoints, pathConfig);
	}

	protected generate(): void {
		for (let i = 0; i < this.waypoints.length - 1; i++) {
			const line = this.generateLine(this.waypoints[i], this.waypoints[i + 1]);
			if (this.error !== undefined) break;
			const segments = this.generateSegments(line);
			const setpoints = this.generateSetpoints(segments, this._distance);
			const coords = this.generateCoords(setpoints);
			this._distance += line.distance;
			this._setpoints.push(...setpoints);
			this._segments.push(...segments);
			this._coords.push(...coords);
		}
	}

	protected generateLine(startWaypoint: Waypoint, endWaypoint: Waypoint): Line {
		const line = new Line(
			endWaypoint.x - startWaypoint.x,
			this.pathConfig.acc,
			startWaypoint.v,
			endWaypoint.v,
			startWaypoint.vMax
		);
		const lineError = line.getError();
		if (lineError !== undefined) this.error = new IllegalPath(`Line ${line.getInfo()} is illegal!`, lineError);
		return line;
	}

	generateCoords(setpoints: Setpoint[]): Coord[] {
		return setpoints.map(() => new Coord(0, 0, 0));
	}

	get distance(): number {
		return this._distance;
	}
}
