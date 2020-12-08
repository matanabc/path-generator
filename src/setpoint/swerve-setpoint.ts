import Setpoint from './setpoint';

export default class SwerveSetpoint extends Setpoint {
	protected _angle: number;

	constructor(
		position: number = 0,
		velocity: number = 0,
		acceleration: number = 0,
		angle: number = 0
	) {
		super(position, velocity, acceleration);
		this._angle = angle;
	}

	get angle(): number {
		return this._angle;
	}

	set angle(angle: number) {
		this._angle = angle;
	}
}
