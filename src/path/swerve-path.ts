import TurnInPlaceGenerator from '../generator/turn-in-place-generator';
import SwervePathGenerator from '../generator/swerve-path-generator';
import SwerveWaypoint from '../waypoints/swerve-waypoint';
import SwerveSetpoint from '../setpoint/swerve-setpoint';
import SwerveModifier from '../modifier/swerve-modifier';
import SwerveCoord from '../coord/swerve-coord';
import PathConfig from './path-config';
import Coord from '../coord/coord';
import { d2r } from '../util';
import Path from './path';

export default class SwervePath extends Path {
	protected modifier: SwerveModifier = new SwerveModifier();
	protected _coords: Coord[] = [];

	constructor(waypoints: SwerveWaypoint[], pathConfig: PathConfig) {
		super(waypoints, pathConfig);
		this.modifier.modify(
			this.sourceSetpoints,
			<SwerveCoord[]>this._generator.getCoords(),
			this.pathConfig
		);
		this.updateCoordAngle();
	}

	protected generate(): void {
		if (TurnInPlaceGenerator.isTurnInPlace(this.waypoints))
			this._generator = new TurnInPlaceGenerator(this.waypoints, this.pathConfig);
		else this._generator = new SwervePathGenerator(this.waypoints, this.pathConfig);
	}

	protected updateCoordAngle(): void {
		const coords = <SwerveCoord[]>this._generator.getCoords();
		const startAngle = d2r((<SwerveWaypoint>this.waypoints[0]).robotAngle);
		const width = this.pathConfig.width;
		for (let i = 0; i < coords.length; i++) {
			const ratio = coords[i].radios === 0 ? 0 : width / (2 * coords[i].radios);
			coords[i].angle = startAngle + (ratio * 2 * this.sourceSetpoints[i].position) / width;
		}
		this._coords.push(...coords);
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
		return this._coords;
	}
}
