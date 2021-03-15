import { pathConfigValueEqualTo0 } from '../errors/error';
import IllegalPath from '../errors/illegal-path';
import PathConfig from '../path/path-config';
import Waypoint from '../waypoints/waypoint';
import Setpoint from '../setpoint/setpoint';
import Segment from '../segment';
import Spline from '../spline';
import Coord from '../coord/coord';

export default class PathGenerator {
	protected pathConfig: PathConfig;
	protected waypoints: Waypoint[];

	protected setpoints: Setpoint[] = [];
	protected segments: Segment[] = [];
	protected splines: Spline[] = [];
	protected coords: Coord[] = [];
	protected error?: IllegalPath;
	protected time: number = 0;

	constructor(waypoints: Waypoint[], pathConfig: PathConfig) {
		this.pathConfig = pathConfig;
		this.waypoints = waypoints;
		this.checkPathConfig();
		if (this.error === undefined) this.generate();
	}

	protected checkPathConfig(): void {
		if (this.pathConfig.acc === 0) this.error = pathConfigValueEqualTo0('acc');
		else if (this.pathConfig.vMax === 0) this.error = pathConfigValueEqualTo0('vMax');
		else if (this.pathConfig.robotLoopTime === 0) this.error = pathConfigValueEqualTo0('robot loop time');
	}

	protected generate(): void {
		var lastPosition = 0;
		for (let i = 0; i < this.waypoints.length - 1; i++) {
			const spline = this.generateSpline(this.waypoints[i], this.waypoints[i + 1]);
			if (this.error !== undefined) break;
			const segments = this.generateSegments(spline);
			const setpoints = this.generateSetpoints(spline, segments, lastPosition);
			const coords = this.generateCoords(spline, setpoints, lastPosition);
			lastPosition += spline.distance;
			this.setpoints.push(...setpoints);
			this.segments.push(...segments);
			this.coords.push(...coords);
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
		segments.push(new Segment(spline.vMax, spline.distance - speedingAndSlowingDistance));
		segments.push(slowing2vEnd);
		return segments;
	}

	protected generateSetpoints(spline: Spline, segments: Segment[], startPosition: number): Setpoint[] {
		var lastPos = startPosition;
		const setpoints = [];
		const robotLoopTime = this.pathConfig.robotLoopTime;

		for (let i = 0; i < segments.length; i++) {
			if (segments[i].distance === 0) continue;
			for (; this.time < segments[i].totalTime; this.time += robotLoopTime) {
				const setpoint = segments[i].getSetpoint(this.time, lastPos);
				setpoints.push(setpoint);
			}
			lastPos += segments[i].distance;
			this.time = this.time - segments[i].totalTime;
		}
		return setpoints;
	}

	protected generateCoords(spline: Spline, setpoints: Setpoint[], startPosition: number): Coord[] {
		const coords = [];
		for (let i = 0; i < setpoints.length; i++)
			coords.push(spline.getPositionCoords(setpoints[i].position - startPosition));
		return coords;
	}

	getSetpoint(): Setpoint[] {
		return this.setpoints;
	}

	getCoords(): Coord[] {
		return this.coords;
	}

	getError(): IllegalPath | undefined {
		return this.error;
	}
}
