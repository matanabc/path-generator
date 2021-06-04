import Setpoint from './setpoint';

export default class SwerveSetpoint extends Setpoint {
	public angle: number;

	constructor(
		position: number = 0,
		velocity: number = 0,
		acceleration: number = 0,
		angle: number = 0
	) {
		super(position, velocity, acceleration);
		this.angle = angle;
	}
}
