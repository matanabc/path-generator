import Waypoint from '../waypoints/waypoint';
import PathConfig from './path-config';
import Path from './path';

export default class SwervePath extends Path {
	constructor(waypoints: Waypoint[], pathConfig: PathConfig) {
		super(waypoints, pathConfig);
	}
}
