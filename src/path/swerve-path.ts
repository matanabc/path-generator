import TurnInPlaceGenerator from '../generator/turn-in-place-generator';
import SwervePathGenerator from '../generator/swerve-path-generator';
import SwerveSetpoint from '../setpoint/swerve-setpoint';
import SwerveModifier from '../modifier/swerve-modifier';
import SwerveCoord from '../coord/swerve-coord';
import Waypoint from '../waypoints/waypoint';
import PathConfig from './path-config';
import Path from './path';

export default class SwervePath extends Path {
	protected modifier: SwerveModifier = {} as SwerveModifier;

	constructor(waypoints: Waypoint[], pathConfig: PathConfig) {
		super(waypoints, pathConfig);
	}

	protected generate(): void {
		if (TurnInPlaceGenerator.isTurnInPlace(this.waypoints))
			this._generator = new TurnInPlaceGenerator(this.waypoints, this.pathConfig);
		else this._generator = new SwervePathGenerator(this.waypoints, this.pathConfig);
		this.modifier = new SwerveModifier(
			this.sourceSetpoints,
			<SwerveCoord[]>this.coords,
			this.pathConfig
		);
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
