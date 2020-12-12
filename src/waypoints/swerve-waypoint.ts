import Waypoint from './waypoint';

export default class SwerveWaypoint extends Waypoint {
	protected _robotAngle: number;

	/**
	 * @param x				Waypoint X
	 * @param y				Waypoint Y
	 * @param angle 		Waypoint angle
	 * @param robotAngle	Robot angle
	 * @param v 			Robot velocity
	 * @param vMax 			Max velocity to next waypoint
	 */
	constructor(
		x: number = 0,
		y: number = 0,
		angle: number = 0,
		robotAngle: number = 0,
		v: number = 0,
		vMax: number = 0
	) {
		super(x, y, angle, v, vMax);
		this._robotAngle = robotAngle;
	}

	get robotAngle(): number {
		return this._robotAngle;
	}
}
