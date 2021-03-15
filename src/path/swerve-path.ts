import SwerveWaypoint from '../waypoints/swerve-waypoint';
import SwerveModifier from '../modifier/swerve-modifier';
import SwerveSetpoint from '../setpoint/swerve-setpoint';
import Setpoint from '../setpoint/setpoint';
import PathConfig from './path-config';
import Path from './path';

export default class SwervePath extends Path {
	protected _modifier: SwerveModifier = {} as SwerveModifier;

	constructor(waypoints: SwerveWaypoint[] = [], pathConfig: PathConfig) {
		super(waypoints, pathConfig);
		this._modifier = new SwerveModifier(this._generator.getCoords(), this.pathConfig);
	}

	get xSetpoints(): Setpoint[] {
		return this._modifier.xSetpoints;
	}

	get ySetpoints(): Setpoint[] {
		return this._modifier.ySetpoints;
	}

	get zSetpoints(): Setpoint[] {
		return this._modifier.zSetpoints;
	}

	get frontRightSetpoints(): Setpoint[] {
		return this._modifier.frontRightSetpoints;
	}

	get backRightSetpoints(): Setpoint[] {
		return this._modifier.backRightSetpoints;
	}

	get frontLeftSetpoints(): Setpoint[] {
		return this._modifier.frontLeftSetpoints;
	}

	get backLeftSetpoints(): SwerveSetpoint[] {
		return this._modifier.backLeftSetpoints;
	}

	get waypoints(): SwerveWaypoint[] {
		return <SwerveWaypoint[]>this._waypoints;
	}
}
