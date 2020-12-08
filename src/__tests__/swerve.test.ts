import { PathConfig, Swerve } from '../index';

const pathConfig = new PathConfig(0.8, 2, 3);

test('Straight path', () => {
	const waypoints = [
		new Swerve.Waypoint(0, 0, 0, 0, 0, 1),
		new Swerve.Waypoint(0.5, 0.5, 90, 0, 0, 0),
	];
	const path = new Swerve.Path(waypoints, pathConfig);
});
