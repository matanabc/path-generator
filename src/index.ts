import PathConfig from './path/path-config';
import Waypoint from './waypoints/waypoint';
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
	Path: SwervePath,
	PathConfig,
	Waypoint,
};

export { PathConfig, Waypoint, Path, Util, Tank, Swerve };
