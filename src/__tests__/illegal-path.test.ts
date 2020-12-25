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

test('Path config vMax === 0', () => {
	const waypoints = [new Waypoint(0, 0, 0, 0, 1), new Waypoint(1, 0, 0, 0, 0)];
	const path = new Path(waypoints, new PathConfig(0, 0, 1, 0.02));

	expect(path.isIllegal()).toBe(true);
});

test('Path config acc === 0', () => {
	const waypoints = [new Waypoint(0, 0, 0, 0, 1), new Waypoint(1, 0, 0, 0, 0)];
	const path = new Path(waypoints, new PathConfig(0, 1, 0, 0.02));

	expect(path.isIllegal()).toBe(true);
});

test('Path config robotLoopTime === 0', () => {
	const waypoints = [new Waypoint(0, 0, 0, 0, 1), new Waypoint(1, 0, 0, 0, 0)];
	const path = new Path(waypoints, new PathConfig(0, 1, 1, 0));

	expect(path.isIllegal()).toBe(true);
});
