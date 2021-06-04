import HolonomicWaypoint from './waypoints/holonomic-waypoint';
import HolonomicPath from './path/holonomic-path';
import Waypoint from './waypoints/waypoint';
import PathConfig from './path/path-config';
import TankPath from './path/tank-path';
import * as Util from './util';
import Path from './path/path';

const Tank = {
	Path: TankPath,
	PathConfig,
	Waypoint,
};

const Holonomic = {
	Waypoint: HolonomicWaypoint,
	Path: HolonomicPath,
	PathConfig,
};

const driveTypes = ['Tank', 'Holonomic'];

export { PathConfig, Waypoint, Path, Util, Tank, Holonomic, driveTypes };
