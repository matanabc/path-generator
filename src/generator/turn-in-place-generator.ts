import PathConfig from '../path/path-config';
import Waypoint from '../waypoints/waypoint';
import PathGenerator from './path-generator';
import * as Util from '../util';
import Spline from '../arc/spline';
import Setpoint from '../setpoint';
import Coord from '../arc/coord';

export default class TurnInPlaceGenerator extends PathGenerator {
	constructor(waypoints: Waypoint[], pathConfig: PathConfig) {
		const turnAngle = waypoints[1].angle - waypoints[0].angle;
		const x = waypoints[0].x + Util.angle2Distance(turnAngle, pathConfig.width);
		const y = waypoints[0].y;
		const v0 = waypoints[0].v;
		const vEnd = waypoints[1].v;
		const vMax = waypoints[0].vMax;
		const startWaypoint = new Waypoint(waypoints[0].x, y, 0, v0, vMax);
		const endWaypoint = new Waypoint(x, y, 0, vEnd, 0);

		super([startWaypoint, endWaypoint], pathConfig);
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
}
