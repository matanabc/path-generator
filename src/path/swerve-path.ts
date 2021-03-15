import SwerveWaypoint from '../waypoints/swerve-waypoint';
import SwerveModifier from '../modifier/swerve-modifier';
import Setpoint from '../setpoint/setpoint';
import PathConfig from './path-config';
import Path from './path';

export default class SwervePath extends Path {
	protected _modifier: SwerveModifier = {} as SwerveModifier;

	constructor(waypoints: SwerveWaypoint[] = [], pathConfig: PathConfig) {
		super(waypoints, pathConfig);
		this._modifier = new SwerveModifier(this.sourceSetpoints, this._generator.getCoords(), this.pathConfig);
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

	get waypoints(): SwerveWaypoint[] {
		return <SwerveWaypoint[]>this._waypoints;
	}
}
