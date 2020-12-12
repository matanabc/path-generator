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
	protected _pathConfig: PathConfig;
	protected _coords: Coord[] = [];
	protected _startAngle: number;
	protected _angle: number;

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
		this._angle = 0;
		this._pathConfig = pathConfig;
		this._startAngle = startAngle;
		this.modify(source, coords);
	}

	protected modify(source: Setpoint[], coords: SwerveCoord[]): void {
		for (let i = 0; i < source.length; i++) {
			const ratio = this.getRatio(coords[i]);
			this.updateAngle(source, ratio, i);
			const rightSetpoint = this.getSetpoint(source[i], coords[i], -ratio);
			const leftSetpoint = this.getSetpoint(source[i], coords[i], ratio);
			this._frontRightSetpoints.push(rightSetpoint);
			this._backRightSetpoints.push(rightSetpoint);
			this._frontLeftSetpoints.push(leftSetpoint);
			this._backLeftSetpoints.push(leftSetpoint);
			this.setCoord(coords[i]);
		}
	}

	protected getRatio(coord: SwerveCoord): number {
		return coord.radios === 0 ? 0 : this._pathConfig.width / (2 * coord.radios);
	}

	protected updateAngle(source: Setpoint[], ratio: number, index: number): void {
		const position = source[index].position;
		const distance = index > 0 ? position - source[index - 1].position : position;
		this._angle += Util.r2d((ratio * 2 * distance) / this._pathConfig.width);
	}

	protected getSetpoint(source: Setpoint, coord: SwerveCoord, ratio: number): SwerveSetpoint {
		const setpoint = new SwerveSetpoint(
			source.position,
			source.velocity,
			source.acceleration,
			Util.r2d(Util.boundRadians(coord.angle))
		);
		setpoint.angle += -this._angle;
		setpoint.acceleration *= 1 + ratio;
		setpoint.position *= 1 + ratio;
		setpoint.velocity *= 1 + ratio;
		return setpoint;
	}

	protected setCoord(coord: SwerveCoord): void {
		this._coords.push(new Coord(coord.x, coord.y, Util.d2r(this._startAngle + this._angle)));
	}
}
