import SwerveSetpoint from '../setpoint/swerve-setpoint';
import SwerveCoord from '../coord/swerve-coord';
import PathConfig from '../path/path-config';
import Setpoint from '../setpoint/setpoint';
import Coord from '../coord/coord';
import * as Util from '../util';

export default class SwerveModifier {
	protected _frontRightSetpoints: SwerveSetpoint[] = [];
	protected _frontLeftSetpoints: SwerveSetpoint[] = [];
	protected _backRightSetpoints: SwerveSetpoint[] = [];
	protected _backLeftSetpoints: SwerveSetpoint[] = [];
	protected _coords: Coord[] = [];
	protected angle = 0;

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

	get robotCoord(): Coord[] {
		return this._coords;
	}

	constructor(
		source: Setpoint[],
		coords: SwerveCoord[],
		pathConfig: PathConfig,
		startAngle: number
	) {
		this.modify(source, coords, pathConfig, startAngle);
	}

	protected modify(
		source: Setpoint[],
		coords: SwerveCoord[],
		pathConfig: PathConfig,
		startAngle: number
	): void {
		this.angle = 0;
		for (let i = 0; i < source.length; i++) {
			this._frontRightSetpoints.push(this.getSetpoint(source, coords, i, pathConfig.width, -1));
			// this._frontLeftSetpoints.push(this.getSetpoint(source[i], coords[i], pathConfig.width, 1));
			// this._backRightSetpoints.push(this.getSetpoint(source[i], coords[i], pathConfig.width, -1));
			// this._backLeftSetpoints.push(this.getSetpoint(source[i], coords[i], pathConfig.width, 1));
			this.setCoord(coords[i], startAngle);
		}
	}

	protected getSetpoint(
		source: Setpoint[],
		coords: SwerveCoord[],
		index: number,
		width: number,
		scale: number
	): SwerveSetpoint {
		const coord = coords[index];
		const object = {
			...source[index],
			angle: Util.r2d(Util.boundRadians(coord.angle)),
		};
		const setpoint = Object.assign(new SwerveSetpoint(), object);
		const ratio = coord.radios === 0 ? 0 : width / (2 * coord.radios);
		const distance =
			index === 0 ? setpoint.position : setpoint.position - source[index - 1].position;
		this.angle += Util.r2d((ratio * 2 * distance) / width);
		setpoint.angle += -this.angle;
		setpoint.acceleration *= 1 + ratio * scale;
		setpoint.position *= 1 + ratio * scale;
		setpoint.velocity *= 1 + ratio * scale;
		return setpoint;
	}

	protected setCoord(coord: SwerveCoord, startAngle: number): void {
		this._coords.push(new Coord(coord.x, coord.y, Util.d2r(startAngle + this.angle)));
	}
}
