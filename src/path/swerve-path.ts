import SwervePathGenerator from '../generator/swerve-path-generator';
import SwerveWaypoint from '../waypoints/swerve-waypoint';
import SwerveSetpoint from '../setpoint/swerve-setpoint';
import SwerveModifier from '../modifier/swerve-modifier';
import PathGenerator from '../generator/path-generator';
import SwerveCoord from '../coord/swerve-coord';
import PathConfig from './path-config';
import Coord from '../coord/coord';
import Path from './path';

export default class SwervePath extends Path {
	protected modifier: SwerveModifier;

	constructor(waypoints: SwerveWaypoint[], pathConfig: PathConfig) {
		super(waypoints, pathConfig);
		this.modifier = new SwerveModifier(
			this.sourceSetpoints,
			<SwerveCoord[]>this._generator.getCoords(),
			this.pathConfig,
			(<SwerveWaypoint>this.waypoints[0]).robotAngle,
			this._turnInPlaceAngle
		);
	}

	protected generatePath(): PathGenerator {
		return new SwervePathGenerator(this.waypoints, this.pathConfig);
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

	get coords(): Coord[] {
		return this.modifier.robotCoord;
	}
}
