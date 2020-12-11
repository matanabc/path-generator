import TurnInPlaceGenerator from '../generator/turn-in-place-generator';
import SwervePathGenerator from '../generator/swerve-path-generator';
import SwerveWaypoint from '../waypoints/swerve-waypoint';
import SwerveSetpoint from '../setpoint/swerve-setpoint';
import SwerveModifier from '../modifier/swerve-modifier';
import SwerveCoord from '../coord/swerve-coord';
import PathConfig from './path-config';
import Path from './path';

export default class SwervePath extends Path {
	protected modifier: SwerveModifier = new SwerveModifier();

	constructor(waypoints: SwerveWaypoint[], pathConfig: PathConfig) {
		super(waypoints, pathConfig);
		this.modifier.modify(this.sourceSetpoints, <SwerveCoord[]>this.coords, this.pathConfig);
	}

	protected generate(): void {
		if (TurnInPlaceGenerator.isTurnInPlace(this.waypoints))
			this._generator = new TurnInPlaceGenerator(this.waypoints, this.pathConfig);
		else this._generator = new SwervePathGenerator(this.waypoints, this.pathConfig);
	}

	get frontRightSetpoints(): SwerveSetpoint[] {
		return this.modifier.frontRightSetpoints;
	}

	get frontLeftSetpoints(): SwerveSetpoint[] {
		return this.modifier.frontLeftSetpoints;
	}

	get backRightSetpoints(): SwerveSetpoint[] {
		return this.modifier.backRightSetpoints;
	}

	get backLeftSetpoints(): SwerveSetpoint[] {
		return this.modifier.backLeftSetpoints;
	}
}
