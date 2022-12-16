export type Coord = {
	y: number;
	x: number;
	z: number;
};

export type Waypoint = {
	x: number;
	y: number;
	z?: number;
	heading: number;
	velocity: number;
	maxVelocity: number;
};

export type Setpoint = {
	position: number;
	velocity: number;
	acceleration: number;
};

export type Robot = {
	maxVelocity: number;
	acceleration: number;
	width: number;
	length: number;
	loopTime: number;
};
