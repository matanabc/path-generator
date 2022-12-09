import { Waypoint, PathGenerator, HolonomicModifier } from '../..';
import { robot } from '../utils';
import { basicPathCheck } from './utils';

test('holonomic - path (backward)', () => {
	const waypoints: Waypoint[] = [
		{ x: 0, y: 0, z: 0, heading: 0, velocity: 0, maxVelocity: 1 },
		{ x: -2, y: 0, z: 0, heading: 0, velocity: 0, maxVelocity: 1 },
	];
	const path = new PathGenerator(waypoints, robot, HolonomicModifier);
	const modifier = path.modifier as HolonomicModifier;

	basicPathCheck(path);
	for (let i = 0; i < path.coords.length; i++) {
		expect(modifier.x[i].velocity).toBeLessThanOrEqual(0);
		expect(modifier.x[i].velocity).toBeGreaterThanOrEqual(-1);
		expect(modifier.x[i].position).toBeLessThanOrEqual(0);
		expect(modifier.x[i].position).toBeGreaterThanOrEqual(-2);

		expect(modifier.y[i].velocity).toBeCloseTo(0);
		expect(modifier.y[i].position).toBeCloseTo(0);
		expect(modifier.y[i].acceleration).toBeCloseTo(0);

		expect(modifier.z[i].velocity).toBe(0);
		expect(modifier.z[i].position).toBe(0);
		expect(modifier.z[i].acceleration).toBe(0);
	}
});

test('holonomic | path (backward)', () => {
	const waypoints: Waypoint[] = [
		{ x: 0, y: 0, z: 0, heading: 90, velocity: 0, maxVelocity: 1 },
		{ x: 0, y: -2, z: 0, heading: 90, velocity: 0, maxVelocity: 1 },
	];
	const path = new PathGenerator(waypoints, robot, HolonomicModifier);
	const modifier = path.modifier as HolonomicModifier;

	basicPathCheck(path);
	for (let i = 0; i < path.coords.length; i++) {
		expect(modifier.x[i].velocity).toBeCloseTo(0);
		expect(modifier.x[i].position).toBeCloseTo(0);
		expect(modifier.x[i].acceleration).toBeCloseTo(0);

		expect(modifier.y[i].velocity).toBeLessThanOrEqual(0);
		expect(modifier.y[i].velocity).toBeGreaterThanOrEqual(-1);
		expect(modifier.y[i].position).toBeLessThanOrEqual(0);
		expect(modifier.y[i].position).toBeGreaterThanOrEqual(-2);

		expect(modifier.z[i].velocity).toBe(0);
		expect(modifier.z[i].position).toBe(0);
		expect(modifier.z[i].acceleration).toBe(0);
	}
});

test('holonomic / path (backward)', () => {
	const waypoints: Waypoint[] = [
		{ x: 2, y: 2, z: 0, heading: 45, velocity: 0, maxVelocity: robot.maxVelocity },
		{ x: 0, y: 0, z: 0, heading: 45, velocity: 0, maxVelocity: robot.maxVelocity },
	];
	const path = new PathGenerator(waypoints, robot, HolonomicModifier);
	const modifier = path.modifier as HolonomicModifier;

	basicPathCheck(path);
	for (let i = 0; i < path.coords.length; i++) {
		expect(modifier.x[i].velocity).toBeLessThanOrEqual(0);
		expect(modifier.x[i].position).toBeGreaterThanOrEqual(0);
		expect(modifier.x[i].position).toBeLessThanOrEqual(2);

		expect(modifier.y[i].velocity).toBeLessThanOrEqual(0);
		expect(modifier.y[i].position).toBeGreaterThanOrEqual(0);
		expect(modifier.y[i].position).toBeLessThanOrEqual(2);

		expect(modifier.z[i].velocity).toBe(0);
		expect(modifier.z[i].position).toBe(0);
		expect(modifier.z[i].acceleration).toBe(0);
	}
});

test('holonomic \\ path (backward)', () => {
	const waypoints: Waypoint[] = [
		{ x: 2, y: -2, z: 0, heading: -45, velocity: 0, maxVelocity: robot.maxVelocity },
		{ x: 0, y: 0, z: 0, heading: -45, velocity: 0, maxVelocity: robot.maxVelocity },
	];
	const path = new PathGenerator(waypoints, robot, HolonomicModifier);
	const modifier = path.modifier as HolonomicModifier;

	basicPathCheck(path);
	for (let i = 0; i < path.coords.length; i++) {
		expect(modifier.x[i].velocity).toBeLessThanOrEqual(0);
		expect(modifier.x[i].position).toBeGreaterThanOrEqual(0);
		expect(modifier.x[i].position).toBeLessThanOrEqual(2);

		expect(modifier.y[i].velocity).toBeGreaterThanOrEqual(0);
		expect(modifier.y[i].position).toBeLessThanOrEqual(0);
		expect(modifier.y[i].position).toBeGreaterThanOrEqual(-2);

		expect(modifier.z[i].velocity).toBe(0);
		expect(modifier.z[i].position).toBe(0);
		expect(modifier.z[i].acceleration).toBe(0);
	}
});

test('holonomic S path (backward)', () => {
	const waypoints: Waypoint[] = [
		{ x: 2, y: 2, z: 0, heading: 0, velocity: 0, maxVelocity: robot.maxVelocity },
		{ x: 0, y: 0, z: 0, heading: 0, velocity: 0, maxVelocity: robot.maxVelocity },
	];
	const path = new PathGenerator(waypoints, robot, HolonomicModifier);
	const modifier = path.modifier as HolonomicModifier;

	basicPathCheck(path);
	for (let i = 0; i < path.coords.length; i++) {
		expect(modifier.x[i].velocity).toBeLessThanOrEqual(0);
		expect(modifier.x[i].position).toBeLessThanOrEqual(2);
		expect(modifier.x[i].position).toBeGreaterThanOrEqual(0);

		expect(modifier.y[i].velocity).toBeLessThanOrEqual(0);
		expect(modifier.y[i].position).toBeLessThanOrEqual(2);
		expect(modifier.y[i].position).toBeGreaterThanOrEqual(0);

		expect(modifier.z[i].velocity).toBe(0);
		expect(modifier.z[i].position).toBe(0);
		expect(modifier.z[i].acceleration).toBe(0);
	}
});
