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
	protected _distance: number = 0;
	public error?: IllegalPath;

	protected pathConfig: PathConfig;
	protected waypoints: Waypoint[];

	constructor(waypoints: Waypoint[], pathConfig: PathConfig) {
		this.pathConfig = pathConfig;
		this.waypoints = waypoints;
		this.checkPathConfig();
		this.generate();
	}

	protected abstract generate(): void;

	protected checkPathConfig(): void {
		if (this.pathConfig.acc === 0) this.error = pathConfigValueEqualTo0('acc');
		else if (this.pathConfig.vMax === 0) this.error = pathConfigValueEqualTo0('vMax');
		else if (this.pathConfig.robotLoopTime === 0) this.error = pathConfigValueEqualTo0('robot loop time');
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
		let time = 0;
		let lastPos = startPosition;
		const setpoints = [];
		const robotLoopTime = this.pathConfig.robotLoopTime;
		for (let i = 0; i < segments.length; i++) {
			if (segments[i].distance === 0) continue;
			for (; time < segments[i].totalTime; time += robotLoopTime) {
				const setpoint = segments[i].getSetpoint(time, lastPos);
				setpoints.push(setpoint);
			}
			lastPos += segments[i].distance;
			time = time - segments[i].totalTime;
		}
		return setpoints;
	}

	get totalTime(): number {
		return this.setpoints.length * this.pathConfig.robotLoopTime;
	}

	get setpoints(): Setpoint[] {
		return this._setpoints;
	}

	get coords(): Coord[] {
		return this._coords;
	}
}
