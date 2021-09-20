import HolonomicWaypoint from '../waypoints/holonomic-waypoint';
import { PathGeneratorError } from '../motionProfiling/errors';
import Setpoint from '../motionProfiling/setpoint';
import Segment from '../motionProfiling/segment';
import Coord from '../motionProfiling/coord';
import Line from '../motionProfiling/line';
import { PathConfig, Waypoint } from '..';
import Trajectory from './trajectory';

export default class LineTrajectory extends Trajectory {
	constructor(waypoints: Waypoint[], pathConfig: PathConfig) {
		super(waypoints, pathConfig);
		this.generateTrajectory();
	}

	protected generate(index: number): void {
		const line = this.generateLine(this.waypoints[index], this.waypoints[index + 1]);
		const segments = this.generateSegments(line, index);
		const setpoints = this.generateSetpoints(segments, this._distance);
		const coords = this.generateCoords(setpoints);
		this._distance += line.distance;
		this._setpoints.push(...setpoints);
		this._segments.push(...segments);
		this._coords.push(...coords);
	}

	protected generateSegments(object: Line, index: number = 0): Segment[] {
		if (this.waypoints[index].angle === 0) return super.generateSegments(object);
		if (this.waypoints[index].vMax !== (<HolonomicWaypoint>this.waypoints[index]).robotAngle && object.vEnd === 0) {
			object.vMax = (<HolonomicWaypoint>this.waypoints[index]).robotAngle;
			return super.generateSegments(object);
		}
		const dv = object.vEnd - object.V0;
		const dt = dv / this.pathConfig.acc;
		const distance = object.distance - (dt * dv) / 2;
		const time = this.waypoints[index].angle - dt;
		const v = distance / time;
		const segments = [];
		segments.push(new Segment(object.V0, v, object.acc));
		segments.push(new Segment(v, distance));
		segments.push(new Segment(v, object.vEnd, object.acc));
		return segments;
	}

	protected generateLine(startWaypoint: Waypoint, endWaypoint: Waypoint): Line {
		const distance = endWaypoint.x - startWaypoint.x;
		return new Line(distance, this.pathConfig.acc, startWaypoint.v, endWaypoint.v, startWaypoint.vMax);
	}

	protected generateCoords(setpoints: Setpoint[]): Coord[] {
		return setpoints.map(() => new Coord(0, 0, 0));
	}
}
