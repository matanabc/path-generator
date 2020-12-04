export default class Waypoint {
	x: number = 0;
	y: number = 0;
	angle: number = 0;
	v: number = 0;
	vMax: number = 2;

	constructor(
		xOrWaypoint: number | Waypoint = 0,
		y: number = 0,
		angle: number = 0,
		v: number = 0,
		vMax: number = 2
	) {
		if (xOrWaypoint instanceof Waypoint) this.copyConstructor(xOrWaypoint);
		else {
			this.x = xOrWaypoint;
			this.angle = angle;
			this.vMax = vMax;
			this.y = y;
			this.v = v;
		}
	}

	private copyConstructor(waypoint: Waypoint): void {
		this.angle = waypoint.angle ? waypoint.angle : this.angle;
		this.vMax = waypoint.vMax ? waypoint.vMax : this.vMax;
		this.x = waypoint.x ? waypoint.x : this.x;
		this.y = waypoint.y ? waypoint.y : this.y;
		this.v = waypoint.v ? waypoint.v : this.v;
	}

	getInfo(): string {
		return `(${this.x},${this.y})`;
	}
}
