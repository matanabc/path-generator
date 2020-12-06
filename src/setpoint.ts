export default class Setpoint {
	position: number;
	velocity: number;
	acceleration: number;

	constructor(position: number = 0, velocity: number = 0, acceleration: number = 0) {
		this.position = position;
		this.velocity = velocity;
		this.acceleration = acceleration;
	}
}
