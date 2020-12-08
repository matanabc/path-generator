import PathConfig from './path/path-config';
import Waypoint from './waypoints/waypoint';
import TankPath from './path/tank-path';
import * as Util from './util';
import Path from './path/path';

const Tank = {
	Path: TankPath,
	PathConfig,
	Waypoint,
};

export { PathConfig, Waypoint, Path, Util, Tank };
