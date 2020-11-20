import { angle2Distance } from './util';
import PathConfig from './path-config';
import Waypoint from './waypoint';
import Setpoint from './setpoint';
import Segment from './segment';
import Spline from './spline';

export default class Generator {
	private time: number = 0;
	private waypoints: Waypoint[];
	private splines: Spline[] = [];
	private segments: Segment[] = [];
	private setpoints: Setpoint[] = [];
	private isIegal: any | undefined;
	private isTurnInPlace: boolean = false;

	constructor(waypoints: Waypoint[], pathConfig: PathConfig) {
		var lastPosition = 0;
		this.waypoints = this.getFixWaypoints(waypoints, pathConfig.width);
		for (let i = 0; i < waypoints.length - 1; i++) {
			const spline = new Spline(this.waypoints[i], this.waypoints[i + 1], pathConfig);
			this.isIegal = spline.isIllegal();
			if (this.isIllegal() !== undefined) break;
			const segments = this.generateSegments(spline);
			this.generateSetpoints(spline, segments, lastPosition, pathConfig.robotLoopTime);
			lastPosition += spline.arc_length;
			this.segments.push(...segments);
			this.splines.push(spline);
		}
	}

	private getFixWaypoints(waypoints: Waypoint[], width: number): Waypoint[] {
		if (
			waypoints.length === 2 &&
			waypoints[0].x === waypoints[1].x &&
			waypoints[0].y === waypoints[1].y
		) {
			const turnAngle = waypoints[1].angle - waypoints[0].angle;
			const x = waypoints[0].x + angle2Distance(turnAngle, width);
			const y = waypoints[0].y;
			const v0 = waypoints[0].v;
			const vEnd = waypoints[1].v;
			const vMax = waypoints[0].vMax;
			const startWaypoint = new Waypoint(waypoints[0].x, y, 0, v0, vMax);
			const endWaypoint = new Waypoint(x, y, 0, vEnd, 0);
			this.isTurnInPlace = true;
			return [startWaypoint, endWaypoint];
		}
		return waypoints;
	}

	private generateSegments(spline: Spline): Segment[] {
		const speeding2vMax = new Segment(spline.V0, spline.vMax, spline.acc);
		const slowing2vEnd = new Segment(spline.vMax, spline.vEnd, spline.acc);
		const speedingAndSlowingDistance = speeding2vMax.distance + slowing2vEnd.distance;
		const segments = [];
		segments.push(speeding2vMax);
		segments.push(new Segment(spline.vMax, spline.arc_length - speedingAndSlowingDistance));
		segments.push(slowing2vEnd);
		return segments;
	}

	private generateSetpoints(
		spline: Spline,
		segments: Segment[],
		startPosition: number,
		robotLoopTime: number
	): void {
		var lastPos = 0;
		for (let i = 0; i < segments.length; i++) {
			if (segments[i].distance === 0) continue;
			for (; this.time < segments[i].totalTime; this.time += robotLoopTime) {
				const setpoint = segments[i].getSetpoint(this.time, lastPos);
				const coords = spline.getPositionCoords(setpoint.position);
				setpoint.setCoords(coords, startPosition);
				if (this.isTurnInPlace) {
					setpoint.x = this.waypoints[0].x;
					setpoint.y = this.waypoints[0].y;
				}
				this.setpoints.push(setpoint);
			}
			lastPos += segments[i].distance;
			this.time = this.time - segments[i].totalTime;
		}
	}

	isIllegal(): undefined | any {
		return this.isIegal;
	}

	getSourceSetpoint(): Setpoint[] {
		return this.setpoints;
	}
}
