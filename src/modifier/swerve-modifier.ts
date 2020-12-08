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

	constructor(sourceSetpoints: Setpoint[], coords: SwerveCoord[], pathConfig: PathConfig) {
		this.modify(sourceSetpoints, coords, pathConfig);
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

	protected modify(source: Setpoint[], coords: SwerveCoord[], pathConfig: PathConfig): void {
		for (let i = 0; i < source.length; i++) {
			const setpoint = {
				...source[i],
				angle: Util.r2d(Util.boundRadians(coords[i].angle)),
			};
			this._frontRightSetpoints.push(Object.assign(new SwerveSetpoint(), setpoint));
			this._frontLeftSetpoints.push(Object.assign(new SwerveSetpoint(), setpoint));
			this._backRightSetpoints.push(Object.assign(new SwerveSetpoint(), setpoint));
			this._backLeftSetpoints.push(Object.assign(new SwerveSetpoint(), setpoint));
		}
	}
}
