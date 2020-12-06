export default class Setpoint {
	protected _position: number;
	protected _velocity: number;
	protected _acceleration: number;

	constructor(position: number = 0, velocity: number = 0, acceleration: number = 0) {
		this._position = position;
		this._velocity = velocity;
		this._acceleration = acceleration;
	}

	get position(): number {
		return this._position;
	}

	set position(position: number) {
		this._position = position;
	}

	get velocity(): number {
		return this._velocity;
	}

	set velocity(velocity: number) {
		this._velocity = velocity;
	}

	get acceleration(): number {
		return this._acceleration;
	}

	set acceleration(acceleration: number) {
		this._acceleration = acceleration;
	}
}
