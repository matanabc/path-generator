import TurnInPlaceGenerator from '../generator/turn-in-place-generator';
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
	protected _modifier: SwerveModifier = {} as SwerveModifier;
	protected _frontRightSetpoints: SwerveSetpoint[] = [];
	protected _frontLeftSetpoints: SwerveSetpoint[] = [];
	protected _backRightSetpoints: SwerveSetpoint[] = [];
	protected _backLeftSetpoints: SwerveSetpoint[] = [];

	constructor(waypoints: SwerveWaypoint[] = [], pathConfig: PathConfig) {
		super(waypoints, pathConfig);
		this.modify();
	}

	protected modify(): void {
		this._modifier = new SwerveModifier(
			this.sourceSetpoints,
			<SwerveCoord[]>this._generator.getCoords(),
			this.pathConfig,
			(<SwerveWaypoint>this.waypoints[0]).robotAngle,
			this._turnInPlaceAngle
		);
		this._frontRightSetpoints = this._modifier.frontRightSetpoints;
		this._frontLeftSetpoints = this._modifier.frontLeftSetpoints;
		this._backRightSetpoints = this._modifier.backRightSetpoints;
		this._backLeftSetpoints = this._modifier.backLeftSetpoints;
	}

	protected generatePath(): PathGenerator {
		return new SwervePathGenerator(this.waypoints, this.pathConfig);
	}

	get frontRightSetpoints(): SwerveSetpoint[] {
		return this._frontRightSetpoints;
	}

	get frontLeftSetpoints(): SwerveSetpoint[] {
		return this._frontLeftSetpoints;
	}

	get backRightSetpoints(): SwerveSetpoint[] {
		return this._backRightSetpoints;
	}

	get backLeftSetpoints(): SwerveSetpoint[] {
		return this._backLeftSetpoints;
	}

	get coords(): Coord[] {
		return this._modifier.robotCoord;
	}

	get waypoints(): SwerveWaypoint[] {
		return <SwerveWaypoint[]>this._waypoints;
	}

	changeDirection(): void {
		if (TurnInPlaceGenerator.isTurnInPlace(this.waypoints)) return;
		this._isReverse = !this._isReverse;
		if (!this._isReverse) {
			this._frontRightSetpoints = this._modifier.frontRightSetpoints;
			this._frontLeftSetpoints = this._modifier.frontLeftSetpoints;
			this._backRightSetpoints = this._modifier.backRightSetpoints;
			this._backLeftSetpoints = this._modifier.backLeftSetpoints;
		} else {
			this._frontRightSetpoints = this._modifier.frontLeftSetpoints;
			this._frontLeftSetpoints = this._modifier.frontRightSetpoints;
			this._backRightSetpoints = this._modifier.backLeftSetpoints;
			this._backLeftSetpoints = this._modifier.backRightSetpoints;
		}
		for (let i = 0; i < this.sourceSetpoints.length; i++) {
			this._frontRightSetpoints[i].changeDirection();
			this._frontLeftSetpoints[i].changeDirection();
			this._backRightSetpoints[i].changeDirection();
			this._backLeftSetpoints[i].changeDirection();
			this.sourceSetpoints[i].changeDirection();
		}
	}
}
