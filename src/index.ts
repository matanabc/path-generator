import SwerveWaypoint from './waypoints/swerve-waypoint';
import Waypoint from './waypoints/waypoint';
import PathConfig from './path/path-config';
import SwervePath from './path/swerve-path';
import TankPath from './path/tank-path';
import * as Util from './util';
import Path from './path/path';

const Tank = {
	Path: TankPath,
	PathConfig,
	Waypoint,
};

const Swerve = {
	Waypoint: SwerveWaypoint,
	Path: SwervePath,
	PathConfig,
};

export { PathConfig, Waypoint, Path, Util, Tank, Swerve };
