export default class Waypoint {
	public angle: number;
	public vMax: number;
	public x: number;
	public y: number;
	public v: number;

	/**
	 * @param x				Waypoint X
	 * @param y				Waypoint Y
	 * @param angle 		Waypoint angle
	 * @param v 			Robot velocity
	 * @param vMax 			Max velocity to next waypoint
	 */
	constructor(x: number = 0, y: number = 0, angle: number = 0, v: number = 0, vMax: number = 0) {
		this.angle = angle;
		this.vMax = vMax;
		this.x = x;
		this.y = y;
		this.v = v;
	}

	getInfo(): string {
		return `(${this.x},${this.y})`;
	}
}
