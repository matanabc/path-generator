export default class Waypoints {
	x: number = 0;
	y: number = 0;
	angle: number = 0;
	v: number = 0;
	vMax: number = 2;

	constructor(
		xOrWaypoint: number | Waypoints = 0,
		y: number = 0,
		angle: number = 0,
		v: number = 0,
		vMax: number = 2
	) {
		if (xOrWaypoint instanceof Waypoints) this.copyConstructor(xOrWaypoint);
		else {
			this.x = xOrWaypoint;
			this.angle = angle;
			this.vMax = vMax;
			this.y = y;
			this.v = v;
		}
	}

	private copyConstructor(waypoint: Waypoints): void {
		this.angle = waypoint.angle ? waypoint.angle : this.angle;
		this.vMax = waypoint.vMax ? waypoint.vMax : this.vMax;
		this.x = waypoint.x ? waypoint.x : this.x;
		this.y = waypoint.y ? waypoint.y : this.y;
		this.v = waypoint.v ? waypoint.v : this.v;
	}
}
