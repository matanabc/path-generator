export default class Setpoint {
	public position: number;
	public velocity: number;
	public acceleration: number;

	constructor(position: number = 0, velocity: number = 0, acceleration: number = 0) {
		this.position = position;
		this.velocity = velocity;
		this.acceleration = acceleration;
	}

	changeDirection(): void {
		this.acceleration *= -1;
		this.position *= -1;
		this.velocity *= -1;
	}
}
