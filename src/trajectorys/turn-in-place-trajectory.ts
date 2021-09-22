import HolonomicWaypoint from '../waypoints/holonomic-waypoint';
import { PathConfig, Util, Waypoint } from '..';
import LineTrajectory from './line-trajectory';
import Coord from '../motionProfiling/coord';

export default class TurnInPlaceTrajectory extends LineTrajectory {
	protected _turnInPlaceAngle: number;

	constructor(waypoints: Waypoint[], pathConfig: PathConfig, vMax: number = waypoints[0].vMax) {
		let turnAngle = 0;
		if (waypoints[0] instanceof HolonomicWaypoint && waypoints[1] instanceof HolonomicWaypoint)
			turnAngle = (<HolonomicWaypoint>waypoints[1]).robotAngle - (<HolonomicWaypoint>waypoints[0]).robotAngle;
		else turnAngle = waypoints[1].angle - waypoints[0].angle;
		const x = Math.abs(waypoints[0].x + Util.angle2Distance(Math.abs(turnAngle), pathConfig.radios));
		const startWaypoint = new Waypoint(waypoints[0].x, waypoints[0].y, 0, 0, vMax);
		const endWaypoint = new Waypoint(x, waypoints[0].y, 0, 0, 0);
		super([startWaypoint, endWaypoint], pathConfig);
		if (turnAngle < 0) this.setpoints.forEach((setpoint) => setpoint.changeDirection());
		this._turnInPlaceAngle = turnAngle;
		this.updateCoord(waypoints[0]);
	}

	protected updateCoord(startWaypoint: Waypoint): void {
		this._coords = this._setpoints.map((setpoint) => {
			const angle = Util.d2r(
				startWaypoint.angle + Util.distance2Angle(setpoint.position, this.pathConfig.radios)
			);
			return new Coord(startWaypoint.x, startWaypoint.y, angle);
		});
	}

	get turnAngle(): number {
		return this._turnInPlaceAngle;
	}

	public static isTurnInPlace(waypoints: Waypoint[]): boolean {
		return waypoints.length === 2 && waypoints[0].x === waypoints[1].x && waypoints[0].y === waypoints[1].y;
	}
}
