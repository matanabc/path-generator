export default class Waypoint {
	x: number;
	y: number;
	v: number;
	vMax: number;
	angle: number;

	constructor(x: number = 0, y: number = 0, angle: number = 0, v: number = 0, vMax: number = 0) {
		this.x = x;
		this.angle = angle;
		this.vMax = vMax;
		this.y = y;
		this.v = v;
	}

	getInfo(): string {
		return `(${this.x},${this.y})`;
	}
}
