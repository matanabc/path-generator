import Coord from './coord';

export default class Setpoint {
	x: number = 0;
	y: number = 0;
	heading: number = 0;
	position: number = 0;
	velocity: number = 0;
	acceleration: number = 0;
	time: number = 0;

	constructor(
		xOrSetpoint: number | Setpoint = 0,
		y: number = 0,
		heading: number = 0,
		position: number = 0,
		velocity: number = 0,
		acceleration: number = 0,
		time: number = 0
	) {
		if (xOrSetpoint instanceof Setpoint) this.copyConstructor(xOrSetpoint);
		else {
			this.y = y;
			this.time = time;
			this.x = xOrSetpoint;
			this.heading = heading;
			this.position = position;
			this.velocity = velocity;
			this.acceleration = acceleration;
		}
	}

	private copyConstructor(setpoint: Setpoint): void {
		this.x = setpoint.x ? setpoint.x : this.x;
		this.y = setpoint.y ? setpoint.y : this.y;
		this.time = setpoint.time ? setpoint.time : this.time;
		this.heading = setpoint.heading ? setpoint.heading : this.heading;
		this.position = setpoint.position ? setpoint.position : this.position;
		this.velocity = setpoint.velocity ? setpoint.velocity : this.velocity;
		this.acceleration = setpoint.acceleration ? setpoint.acceleration : this.acceleration;
	}

	setCoords(coord: Coord, startPosition: number): void {
		this.x = coord.x;
		this.y = coord.y;
		this.heading = coord.angle;
		this.position += startPosition;
	}
}
