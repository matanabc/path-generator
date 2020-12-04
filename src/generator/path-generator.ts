import PathConfig from '../path_config/path-config';
import IllegalPath from '../errors/illegal-path';
import Waypoint from '../waypoints/waypoint';
import Setpoint from '../setpoint';
import Segment from '../segment';
import Spline from '../spline';

export default class PathGenerator {
	protected pathConfig: PathConfig;
	protected waypoints: Waypoint[];

	protected setpoints: Setpoint[] = [];
	protected segments: Segment[] = [];
	protected splines: Spline[] = [];
	protected error?: IllegalPath;
	protected time: number = 0;

	constructor(waypoints: Waypoint[], pathConfig: PathConfig) {
		this.pathConfig = pathConfig;
		this.waypoints = waypoints;
		this.generate();
	}

	protected generate(): void {
		var lastPosition = 0;
		for (let i = 0; i < this.waypoints.length - 1; i++) {
			const spline = this.generateSpline(this.waypoints[i], this.waypoints[i + 1]);
			if (this.error !== undefined) break;
			const segments = this.generateSegments(spline);
			const setpoints = this.generateSetpoints(spline, segments, lastPosition);
			lastPosition += spline.arc_length;
			this.setpoints.push(...setpoints);
			this.segments.push(...segments);
			this.splines.push(spline);
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

	protected generateSegments(spline: Spline): Segment[] {
		const speeding2vMax = new Segment(spline.V0, spline.vMax, spline.acc);
		const slowing2vEnd = new Segment(spline.vMax, spline.vEnd, spline.acc);
		const speedingAndSlowingDistance = speeding2vMax.distance + slowing2vEnd.distance;
		const segments = [];
		segments.push(speeding2vMax);
		segments.push(new Segment(spline.vMax, spline.arc_length - speedingAndSlowingDistance));
		segments.push(slowing2vEnd);
		return segments;
	}

	protected generateSetpoints(
		spline: Spline,
		segments: Segment[],
		startPosition: number
	): Setpoint[] {
		var lastPos = 0;
		const setpoints = [];
		const robotLoopTime = this.pathConfig.robotLoopTime;

		for (let i = 0; i < segments.length; i++) {
			if (segments[i].distance === 0) continue;
			for (; this.time < segments[i].totalTime; this.time += robotLoopTime) {
				const setpoint = segments[i].getSetpoint(this.time, lastPos);
				const coords = spline.getPositionCoords(setpoint.position);
				setpoint.setCoords(coords, startPosition);
				setpoints.push(setpoint);
			}
			lastPos += segments[i].distance;
			this.time = this.time - segments[i].totalTime;
		}
		return setpoints;
	}

	getSourceSetpoint(): Setpoint[] {
		return this.setpoints;
	}

	getError(): IllegalPath | undefined {
		return this.error;
	}
}
