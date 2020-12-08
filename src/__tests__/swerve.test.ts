import { PathConfig, Waypoint } from '../index';
import SwervePath from '../path/swerve-path';

const pathConfig = new PathConfig(0.8, 2, 3);

test('Straight path', () => {
	const waypoints = [new Waypoint(0, 0, 0, 0, 1), new Waypoint(0.5, 0.5, 90, 0, 0)];
	const path = new SwervePath(waypoints, pathConfig);
});