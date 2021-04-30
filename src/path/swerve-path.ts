import SwerveTrajectory from '../trajectorys/swerve-trajectory';
import SwerveWaypoint from '../waypoints/swerve-waypoint';
import Setpoint from '../setpoint/setpoint';
import { PathConfig, Waypoint } from '..';
import Path from './path';

export default class SwervePath extends Path {
	constructor(waypoints: SwerveWaypoint[], pathConfig: PathConfig) {
		super(waypoints, pathConfig);
	}

	protected generate(): void {
		this._trajectory = new SwerveTrajectory(this.waypoints, this.pathConfig);
	}

	get xSetpoints(): Setpoint[] {
		return (<SwerveTrajectory>this._trajectory).xSetpoints;
	}

	get ySetpoints(): Setpoint[] {
		return (<SwerveTrajectory>this._trajectory).ySetpoints;
	}

	get zSetpoints(): Setpoint[] {
		return (<SwerveTrajectory>this._trajectory).zSetpoints;
	}

	get coords() {
		return this._trajectory.coords;
	}
}
