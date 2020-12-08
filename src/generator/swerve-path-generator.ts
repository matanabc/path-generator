import SwerveCoord from '../coord/swerve-coord';
import PathConfig from '../path/path-config';
import Waypoint from '../waypoints/waypoint';
import { PathGenerator } from './generate';
import Coord from '../coord/coord';
import Setpoint from '../setpoint';
import Spline from '../spline';
import { d2r } from '../util';

export default class SwervePathGenerator extends PathGenerator {
	constructor(waypoints: Waypoint[], pathConfig: PathConfig) {
		super(waypoints, pathConfig);
	}

	protected generateCoords(spline: Spline, setpoints: Setpoint[], startPosition: number): Coord[] {
		const coords = [];
		const radios = spline.distance / d2r(180);
		for (let i = 0; i < setpoints.length; i++) {
			const coord = spline.getPositionCoords(setpoints[i].position - startPosition);
			coords.push(new SwerveCoord(coord.x, coord.y, coord.angle, radios));
		}
		return coords;
	}
}
