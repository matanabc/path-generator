import { Path, Waypoint, PathConfig, TankModifier } from '../index';

const pathConfig = new PathConfig(0.8, 2, 3);

test('Straight path', () => {
	const waypoints = [new Waypoint(0, 0, 0, 0, 2), new Waypoint(2, 0, 0, 0, 0)];
	const path = new Path(waypoints, pathConfig, new TankModifier());

	expect(path.isIllegal()).toBeUndefined();
	expect(path.getModifierSetpoints()).toBeDefined();
	expect(path.getModifierSetpoints().left.length).toBe(path.getModifierSetpoints().right.length);
	expect(path.getModifierSetpoints().left.length).toBe(path.getSourceSetpoints().length);
});

test('Turn path', () => {
	const waypoints = [new Waypoint(0, 0, 0, 0, 2), new Waypoint(1.5, 1.5, 90, 0, 0)];
	const path = new Path(waypoints, pathConfig, new TankModifier());
	const setpoints = path.getModifierSetpoints();

	expect(path.isIllegal()).toBeUndefined();
	expect(path.getModifierSetpoints()).toBeDefined();
	expect(path.getModifierSetpoints().left.length).toBe(path.getModifierSetpoints().right.length);
	expect(path.getModifierSetpoints().left.length).toBe(path.getSourceSetpoints().length);

	for (let i = 0; i < setpoints.length; i++) {
		expect(path.getModifierSetpoints().right.position).toBeLessThanOrEqual(
			path.getModifierSetpoints().left.position
		);
	}
});

test('Turn in place path', () => {
	const waypoints = [new Waypoint(0, 0, 0, 0, 2.5), new Waypoint(0, 0, 90, 0, 0)];
	const path = new Path(waypoints, pathConfig, new TankModifier());
	const setpoints = path.getModifierSetpoints();

	expect(path.isIllegal()).toBeUndefined();
	expect(path.getModifierSetpoints()).toBeDefined();
	expect(path.getModifierSetpoints().left.length).toBe(path.getModifierSetpoints().right.length);
	expect(path.getModifierSetpoints().left.length).toBe(path.getSourceSetpoints().length);

	for (let i = 0; i < setpoints.length; i++) {
		expect(path.getModifierSetpoints().right.position).toBe(
			-path.getModifierSetpoints().left.position
		);
	}
});

test('Illegal path', () => {
	const waypoints = [new Waypoint(0, 0, 0, 0, 0), new Waypoint(1, 0, 0, 0, 0)];
	const path = new Path(waypoints, pathConfig, new TankModifier());

	expect(path.isIllegal()).toBeDefined();
	expect(path.getModifierSetpoints()).toBeUndefined();
});
