import IllegalPath from '../errors/illegal-path';
import Setpoint from '../setpoint/setpoint';
import Line from '../motionProfiling/line';
import { PathConfig, Waypoint } from '..';
import Trajectory from './trajectory';
import Coord from '../coord/coord';

export default class LineTrajectory extends Trajectory {
	protected _lines: Line[] = [];

	constructor(waypoints: Waypoint[], pathConfig: PathConfig) {
		super(waypoints, pathConfig);
	}

	generate(): void {
		let lastPosition = 0;
		for (let i = 0; i < this.waypoints.length - 1; i++) {
			const line = this.generateLine(this.waypoints[i], this.waypoints[i + 1]);
			if (this.error !== undefined) break;
			const segments = this.generateSegments(line);
			const setpoints = this.generateSetpoints(segments, lastPosition);
			const coords = this.generateCoords(setpoints);
			lastPosition += line.distance;
			this._setpoints.push(...setpoints);
			this._segments.push(...segments);
			this._coords.push(...coords);
			this._lines.push(line);
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
		if (lineError !== undefined) this._error = new IllegalPath(`Line ${line.getInfo()} is illegal!`, lineError);
		return line;
	}

	generateCoords(setpoints: Setpoint[]): Coord[] {
		return setpoints.map(() => new Coord(0, 0, 0));
	}
}
