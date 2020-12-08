import PathConfig from '../path/path-config';
import Waypoint from '../waypoints/waypoint';
import { PathGenerator } from './generate';

export default class SwervePathGenerator extends PathGenerator {
	constructor(waypoints: Waypoint[], pathConfig: PathConfig) {
		super(waypoints, pathConfig);
	}
}
