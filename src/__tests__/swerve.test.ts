import { PathConfig, Swerve } from '../index';
import { r2d } from '../util';

const pathConfig = new PathConfig(0.8, 2, 3);

test('Straight path', () => {
	const waypoints = [
		new Swerve.Waypoint(0, 0, 0, 90, 0, 1),
		new Swerve.Waypoint(1, 1, 90, 180, 0, 1),
		new Swerve.Waypoint(1, 2, 90, 180, 0, 1),
	];
	const path = new Swerve.Path(waypoints, pathConfig);
	expect(path.isIllegal()).toBe(false);
	for (let i = 0; i < path.sourceSetpoints.length; i++) {
		console.log(
			path.frontRightSetpoints[i].angle,
			path.frontLeftSetpoints[i].angle,
			r2d(path.coords[i].angle)
		);
	}
});
