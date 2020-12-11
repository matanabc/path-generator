import SwerveSetpoint from '../setpoint/swerve-setpoint';
import SwerveCoord from '../coord/swerve-coord';
import PathConfig from '../path/path-config';
import Setpoint from '../setpoint/setpoint';
import * as Util from '../util';

export default class SwerveModifier {
	protected _frontRightSetpoints: SwerveSetpoint[] = [];
	protected _frontLeftSetpoints: SwerveSetpoint[] = [];
	protected _backRightSetpoints: SwerveSetpoint[] = [];
	protected _backLeftSetpoints: SwerveSetpoint[] = [];

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

	modify(source: Setpoint[], coords: SwerveCoord[], pathConfig: PathConfig): void {
		for (let i = 0; i < source.length; i++) {
			const setpoint = {
				...source[i],
				angle: Util.r2d(Util.boundRadians(coords[i].angle)),
			};
			this._frontRightSetpoints.push(this.getSetpoint(source[i], coords[i], pathConfig.width, -1));
			this._frontLeftSetpoints.push(this.getSetpoint(source[i], coords[i], pathConfig.width, 1));
			this._backRightSetpoints.push(this.getSetpoint(source[i], coords[i], pathConfig.width, -1));
			this._backLeftSetpoints.push(this.getSetpoint(source[i], coords[i], pathConfig.width, 1));
		}
	}

	protected getSetpoint(
		source: Setpoint,
		coord: SwerveCoord,
		width: number,
		scale: number
	): SwerveSetpoint {
		const object = {
			...source,
			angle: Util.r2d(Util.boundRadians(coord.angle)),
		};
		const setpoint = Object.assign(new SwerveSetpoint(), object);
		const ratio = coord.radios === 0 ? 0 : width / (2 * coord.radios);
		setpoint.angle += Util.r2d((ratio * 2 * setpoint.position) / width);
		setpoint.acceleration *= 1 + ratio * scale;
		setpoint.position *= 1 + ratio * scale;
		setpoint.velocity *= 1 + ratio * scale;
		return setpoint;
	}
}
