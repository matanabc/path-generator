import { pathConfigValueEqualTo0 } from '../errors/error';
import IllegalPath from '../errors/illegal-path';
import Segment from '../motionProfiling/segment';
import Setpoint from '../setpoint/setpoint';
import Line from '../motionProfiling/line';
import { PathConfig, Waypoint } from '..';
import Coord from '../coord/coord';

export default abstract class Trajectory {
	protected _setpoints: Setpoint[] = [];
	protected _segments: Segment[] = [];
	protected _coords: Coord[] = [];
	protected _error?: IllegalPath;

	protected pathConfig: PathConfig;
	protected waypoints: Waypoint[];
	protected time: number = 0;

	constructor(waypoints: Waypoint[], pathConfig: PathConfig) {
		this.pathConfig = pathConfig;
		this.waypoints = waypoints;
		this.checkPathConfig();
		this.generate();
	}

	abstract generate(): void;

	protected checkPathConfig(): void {
		if (this.pathConfig.acc === 0) this._error = pathConfigValueEqualTo0('acc');
		else if (this.pathConfig.vMax === 0) this._error = pathConfigValueEqualTo0('vMax');
		else if (this.pathConfig.robotLoopTime === 0) this._error = pathConfigValueEqualTo0('robot loop time');
	}

	protected generateSegments(object: Line): Segment[] {
		const speeding2vMax = new Segment(object.V0, object.vMax, object.acc);
		const slowing2vEnd = new Segment(object.vMax, object.vEnd, object.acc);
		const speedingAndSlowingDistance = speeding2vMax.distance + slowing2vEnd.distance;
		const segments = [];
		segments.push(speeding2vMax);
		segments.push(new Segment(object.vMax, object.distance - speedingAndSlowingDistance));
		segments.push(slowing2vEnd);
		return segments;
	}

	protected generateSetpoints(segments: Segment[], startPosition: number): Setpoint[] {
		let lastPos = startPosition;
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

	get totalTime(): number {
		return this.time;
	}

	get setpoints(): Setpoint[] {
		return this._setpoints;
	}

	get coords(): Coord[] {
		return this._coords;
	}

	get error(): IllegalPath | undefined {
		return this._error;
	}
}
