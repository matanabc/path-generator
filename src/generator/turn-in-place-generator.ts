import PathConfig from '../path/path-config';
import Waypoint from '../waypoints/waypoint';
import PathGenerator from './path-generator';
import * as Util from '../util';
import Spline from '../spline';
import Setpoint from '../setpoint/setpoint';
import Coord from '../coord/coord';

export default class TurnInPlaceGenerator extends PathGenerator {
	protected _turnInPlaceAngle: number;

	constructor(waypoints: Waypoint[], pathConfig: PathConfig) {
		const turnAngle = waypoints[1].angle - waypoints[0].angle;
		const x = waypoints[0].x + Util.angle2Distance(turnAngle, pathConfig.width);
		const startWaypoint = new Waypoint(waypoints[0].x, waypoints[0].y, 0, 0, waypoints[0].vMax);
		const endWaypoint = new Waypoint(x, waypoints[0].y, 0, 0, 0);

		super([startWaypoint, endWaypoint], pathConfig);
		this._turnInPlaceAngle = turnAngle;
	}

	protected generateCoords(spline: Spline, setpoints: Setpoint[], startPosition: number): Coord[] {
		const coords = [];
		for (let i = 0; i < setpoints.length; i++)
			coords.push(
				new Coord(
					spline.startPoint.x,
					spline.startPoint.y,
					Util.distance2Angle(setpoints[i].position, spline.pathConfig.width)
				)
			);
		return coords;
	}

	public static isTurnInPlace(waypoints: Waypoint[]): boolean {
		return (
			waypoints.length === 2 &&
			waypoints[0].x === waypoints[1].x &&
			waypoints[0].y === waypoints[1].y
		);
	}

	get turnAngle(): number {
		return this._turnInPlaceAngle;
	}
}
