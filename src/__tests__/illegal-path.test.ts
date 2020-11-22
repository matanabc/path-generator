import { Path, Waypoint, PathConfig } from '../index';

const pathConfig = new PathConfig(0.8, 2, 3);

test('Vmax < Vend path', () => {
	const waypoints = [new Waypoint(0, 0, 0, 0, 0.5), new Waypoint(1, 0, 0, 1, 0)];
	const path = new Path(waypoints, pathConfig);

	expect(path.isIllegal()).toBe(true);
});

test('Vmax === 0 path', () => {
	const waypoints = [new Waypoint(0, 0, 0, 0, 0), new Waypoint(1, 0, 0, 0, 0)];
	const path = new Path(waypoints, pathConfig);

	expect(path.isIllegal()).toBe(true);
});
