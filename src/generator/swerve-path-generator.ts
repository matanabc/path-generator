import SwerveWaypoint from '../waypoints/swerve-waypoint';
import SwerveCoord from '../coord/swerve-coord';
import PathGenerator from './path-generator';
import PathConfig from '../path/path-config';
import Waypoint from '../waypoints/waypoint';
import Setpoint from '../setpoint/setpoint';
import Coord from '../coord/coord';
import Spline from '../spline';
import { d2r } from '../util';

export default class SwervePathGenerator extends PathGenerator {
	constructor(waypoints: Waypoint[], pathConfig: PathConfig) {
		super(waypoints, pathConfig);
	}

	protected generateCoords(spline: Spline, setpoints: Setpoint[], startPosition: number): Coord[] {
		const coords = [];
		const robotStartAngle = (<SwerveWaypoint>spline.startPoint).robotAngle;
		const robotEndAngle = (<SwerveWaypoint>spline.endPoint).robotAngle;
		const robotTurnAngle = robotEndAngle - robotStartAngle;
		const radios = robotTurnAngle !== 0 ? spline.distance / d2r(robotTurnAngle) : 0;
		for (let i = 0; i < setpoints.length; i++) {
			const coord = spline.getPositionCoords(setpoints[i].position - startPosition);
			coords.push(new SwerveCoord(coord.x, coord.y, coord.angle, radios));
		}
		return coords;
	}
}
