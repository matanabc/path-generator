import { Waypoint, PathGenerator, TankModifier } from '../..';
import { robot } from '../utils';

test('tank - path', () => {
	const waypoints: Waypoint[] = [
		{ x: 0, y: 0, heading: 0, velocity: 0, maxVelocity: 1 },
		{ x: 2, y: 0, heading: 0, velocity: 0, maxVelocity: 1 },
	];
	const path = new PathGenerator(waypoints, robot, TankModifier);
	const modifier = path.modifier as TankModifier;

	for (let i = 0; i < path.coords.length; i++) {
		expect(modifier.left[i].velocity).toBeGreaterThanOrEqual(0);
		expect(modifier.left[i].velocity).toBeLessThanOrEqual(1);
		expect(modifier.left[i].position).toBeGreaterThanOrEqual(0);
		expect(modifier.left[i].position).toBeLessThanOrEqual(2);

		expect(modifier.right[i].velocity).toBeGreaterThanOrEqual(0);
		expect(modifier.right[i].velocity).toBeLessThanOrEqual(1);
		expect(modifier.right[i].position).toBeGreaterThanOrEqual(0);
		expect(modifier.right[i].position).toBeLessThanOrEqual(2);

		expect(modifier.angle[i]).toBe(0);
	}
});

test('tank | path', () => {
	const waypoints: Waypoint[] = [
		{ x: 0, y: 0, heading: 90, velocity: 0, maxVelocity: 1 },
		{ x: 0, y: -2, heading: 90, velocity: 0, maxVelocity: 1 },
	];
	const path = new PathGenerator(waypoints, robot, TankModifier);
	const modifier = path.modifier as TankModifier;

	for (let i = 0; i < path.coords.length; i++) {
		expect(modifier.left[i].velocity).toBeGreaterThanOrEqual(0);
		expect(modifier.left[i].velocity).toBeLessThanOrEqual(1);
		expect(modifier.left[i].position).toBeGreaterThanOrEqual(0);
		expect(modifier.left[i].position).toBeLessThanOrEqual(2);

		expect(modifier.right[i].velocity).toBeGreaterThanOrEqual(0);
		expect(modifier.right[i].velocity).toBeLessThanOrEqual(1);
		expect(modifier.right[i].position).toBeGreaterThanOrEqual(0);
		expect(modifier.right[i].position).toBeLessThanOrEqual(2);

		expect(modifier.angle[i]).toBeCloseTo(90);
	}
});

test('tank / path', () => {
	const waypoints: Waypoint[] = [
		{ x: 0, y: 0, heading: 45, velocity: 0, maxVelocity: 1 },
		{ x: 2, y: 2, heading: 45, velocity: 0, maxVelocity: 1 },
	];
	const path = new PathGenerator(waypoints, robot, TankModifier);
	const modifier = path.modifier as TankModifier;

	for (let i = 0; i < path.coords.length; i++) {
		expect(modifier.left[i].velocity).toBeGreaterThanOrEqual(0);
		expect(modifier.left[i].velocity).toBeLessThanOrEqual(1);
		expect(modifier.left[i].position).toBeGreaterThanOrEqual(0);

		expect(modifier.right[i].velocity).toBeGreaterThanOrEqual(0);
		expect(modifier.right[i].velocity).toBeLessThanOrEqual(1);
		expect(modifier.right[i].position).toBeGreaterThanOrEqual(0);

		expect(modifier.angle[i]).toBeCloseTo(45);
	}
});

test('tank \\ path', () => {
	const waypoints: Waypoint[] = [
		{ x: 0, y: 0, heading: -45, velocity: 0, maxVelocity: 1 },
		{ x: 2, y: -2, heading: -45, velocity: 0, maxVelocity: 1 },
	];
	const path = new PathGenerator(waypoints, robot, TankModifier);
	const modifier = path.modifier as TankModifier;

	for (let i = 0; i < path.coords.length; i++) {
		expect(modifier.left[i].velocity).toBeGreaterThanOrEqual(0);
		expect(modifier.left[i].velocity).toBeLessThanOrEqual(1);
		expect(modifier.left[i].position).toBeGreaterThanOrEqual(0);

		expect(modifier.right[i].velocity).toBeGreaterThanOrEqual(0);
		expect(modifier.right[i].velocity).toBeLessThanOrEqual(1);
		expect(modifier.right[i].position).toBeGreaterThanOrEqual(0);

		expect(modifier.angle[i]).toBeCloseTo(-45);
	}
});

test('tank ( path', () => {
	const waypoints: Waypoint[] = [
		{ x: 0, y: 0, heading: 0, velocity: 0, maxVelocity: 1 },
		{ x: 2, y: 2, heading: 90, velocity: 0, maxVelocity: 1 },
	];
	const path = new PathGenerator(waypoints, robot, TankModifier);
	const modifier = path.modifier as TankModifier;

	for (let i = 0; i < path.coords.length; i++) {
		expect(modifier.left[i].velocity).toBeGreaterThanOrEqual(0);
		expect(modifier.left[i].position).toBeGreaterThanOrEqual(0);

		expect(modifier.right[i].velocity).toBeGreaterThanOrEqual(0);
		expect(modifier.right[i].position).toBeGreaterThanOrEqual(0);

		expect(modifier.angle[i]).toBeGreaterThanOrEqual(0);
		expect(modifier.angle[i]).toBeLessThanOrEqual(90);
	}
});

test('tank ) path', () => {
	const waypoints: Waypoint[] = [
		{ x: 0, y: 0, heading: 0, velocity: 0, maxVelocity: 1 },
		{ x: 2, y: -2, heading: -90, velocity: 0, maxVelocity: 1 },
	];
	const path = new PathGenerator(waypoints, robot, TankModifier);
	const modifier = path.modifier as TankModifier;

	for (let i = 0; i < path.coords.length; i++) {
		expect(modifier.left[i].velocity).toBeGreaterThanOrEqual(0);
		expect(modifier.left[i].position).toBeGreaterThanOrEqual(0);

		expect(modifier.right[i].velocity).toBeGreaterThanOrEqual(0);
		expect(modifier.right[i].position).toBeGreaterThanOrEqual(0);

		expect(modifier.angle[i]).toBeGreaterThanOrEqual(-90);
		expect(modifier.angle[i]).toBeLessThanOrEqual(0);
	}
});
