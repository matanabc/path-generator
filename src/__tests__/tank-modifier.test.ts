import { Path, Waypoint, PathConfig, Modifier } from '../index';

const pathConfig = new PathConfig(0.8, 2, 3);

test('Straight path with modifier', () => {
	const waypoints = [new Waypoint(0, 0, 0, 0, 2), new Waypoint(2, 0, 0, 0, 0)];
	const path = new Path(waypoints, pathConfig, Modifier.tank);

	expect(path.isIllegal()).toBe(false);
	expect(path.getModifierSetpoints()).toBeDefined();
	expect(path.getModifierSetpoints().left.length).toBe(path.getModifierSetpoints().right.length);
	expect(path.getModifierSetpoints().left.length).toBe(path.getSourceSetpoints().length);
});

test('Turn path with modifier', () => {
	const waypoints = [new Waypoint(0, 0, 0, 0, 2), new Waypoint(1.5, 1.5, 90, 0, 0)];
	const path = new Path(waypoints, pathConfig, Modifier.tank);
	const setpoints = path.getSourceSetpoints();

	expect(path.isIllegal()).toBe(false);
	expect(path.getModifierSetpoints()).toBeDefined();
	expect(path.getModifierSetpoints().left.length).toBe(path.getModifierSetpoints().right.length);
	expect(path.getModifierSetpoints().left.length).toBe(path.getSourceSetpoints().length);

	for (let i = 0; i < setpoints.length; i++) {
		expect(path.getModifierSetpoints().right[i].position).toBeLessThanOrEqual(
			path.getModifierSetpoints().left[i].position
		);
	}
});

test('Turn in place path right with modifier', () => {
	const waypoints = [new Waypoint(0, 0, 0, 0, 2.5), new Waypoint(0, 0, 90, 0, 0)];
	const path = new Path(waypoints, pathConfig, Modifier.tank);
	const setpoints = path.getSourceSetpoints();

	expect(path.isIllegal()).toBe(false);
	expect(path.getModifierSetpoints()).toBeDefined();
	expect(path.getModifierSetpoints().left.length).toBe(path.getModifierSetpoints().right.length);
	expect(path.getModifierSetpoints().left.length).toBe(path.getSourceSetpoints().length);

	for (let i = 0; i < setpoints.length; i++) {
		expect(path.getModifierSetpoints().left[i].position).toBeLessThanOrEqual(
			-path.getModifierSetpoints().right[i].position
		);
	}
});

test('Turn in place path left with modifier', () => {
	const waypoints = [new Waypoint(0, 0, 0, 0, 2.5), new Waypoint(0, 0, 90, 0, 0)];
	const path = new Path(waypoints, pathConfig, Modifier.tank);
	const setpoints = path.getSourceSetpoints();

	expect(path.isIllegal()).toBe(false);
	expect(path.getModifierSetpoints()).toBeDefined();
	expect(path.getModifierSetpoints().left.length).toBe(path.getModifierSetpoints().right.length);
	expect(path.getModifierSetpoints().left.length).toBe(path.getSourceSetpoints().length);

	for (let i = 0; i < setpoints.length; i++) {
		expect(path.getModifierSetpoints().right[i].position).toBeLessThanOrEqual(
			-path.getModifierSetpoints().left[i].position
		);
	}
});
