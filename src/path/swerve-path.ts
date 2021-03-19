import SwerveWaypoint from '../waypoints/swerve-waypoint';
import SwerveModifier from '../modifier/swerve-modifier';
import SwerveSetpoint from '../setpoint/swerve-setpoint';
import Setpoint from '../setpoint/setpoint';
import PathConfig from './path-config';
import Path from './path';
import PathGenerator from '../generator/path-generator';
import SwervePathGenerator from '../generator/swerve-path-generator';
import Coord from '../coord/coord';

export default class SwervePath extends Path {
	protected _modifier: SwerveModifier = {} as SwerveModifier;

	constructor(waypoints: SwerveWaypoint[] = [], pathConfig: PathConfig) {
		super(waypoints, pathConfig);
		if (this.isIllegal()) return;
		this._modifier = new SwerveModifier(
			(<SwervePathGenerator>this._generator).getTurnSetpoints(),
			this._generator.getCoords(),
			this.pathConfig,
			waypoints[0].robotAngle
		);
	}

	protected generatePath(): PathGenerator {
		return new SwervePathGenerator(this.waypoints, this.pathConfig);
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

	get coords(): Coord[] {
		return this._modifier.coords;
	}
}
