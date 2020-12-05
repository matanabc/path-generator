import Coord from './coord';

export default class Setpoint {
	position: number = 0;
	velocity: number = 0;
	acceleration: number = 0;

	constructor(
		positionOrSetpoint: number | Setpoint = 0,
		velocity: number = 0,
		acceleration: number = 0
	) {
		if (positionOrSetpoint instanceof Setpoint) this.copyConstructor(positionOrSetpoint);
		else {
			this.position = positionOrSetpoint;
			this.velocity = velocity;
			this.acceleration = acceleration;
		}
	}

	private copyConstructor(setpoint: Setpoint): void {
		this.position = setpoint.position ? setpoint.position : this.position;
		this.velocity = setpoint.velocity ? setpoint.velocity : this.velocity;
		this.acceleration = setpoint.acceleration ? setpoint.acceleration : this.acceleration;
	}
}
