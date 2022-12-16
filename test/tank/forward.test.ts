import { TankModifier, Trajectory, Waypoint } from '../../src';
import { robot, tankModifierCheck, trajectoryCheck } from '../utils';

test('tank - path', () => {
	const waypoints: Waypoint[] = [
		{ x: 0, y: 0, heading: 0, velocity: 0, maxVelocity: 1 },
		{ x: 2, y: 0, heading: 0, velocity: 0, maxVelocity: 1 },
	];
	const trajectory = new Trajectory(waypoints, robot);
	const modifier = new TankModifier(trajectory, waypoints, robot);

	trajectoryCheck(trajectory, waypoints);
	tankModifierCheck(modifier, trajectory);
	for (let i = 0; i < trajectory.coords.length; i++) {
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
	const trajectory = new Trajectory(waypoints, robot);
	const modifier = new TankModifier(trajectory, waypoints, robot);

	trajectoryCheck(trajectory, waypoints);
	tankModifierCheck(modifier, trajectory);
	for (let i = 0; i < trajectory.coords.length; i++) {
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
	const trajectory = new Trajectory(waypoints, robot);
	const modifier = new TankModifier(trajectory, waypoints, robot);

	trajectoryCheck(trajectory, waypoints);
	tankModifierCheck(modifier, trajectory);
	for (let i = 0; i < trajectory.coords.length; i++) {
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
	const trajectory = new Trajectory(waypoints, robot);
	const modifier = new TankModifier(trajectory, waypoints, robot);

	trajectoryCheck(trajectory, waypoints);
	tankModifierCheck(modifier, trajectory);
	for (let i = 0; i < trajectory.coords.length; i++) {
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
	const trajectory = new Trajectory(waypoints, robot);
	const modifier = new TankModifier(trajectory, waypoints, robot);

	trajectoryCheck(trajectory, waypoints);
	tankModifierCheck(modifier, trajectory);
	for (let i = 0; i < trajectory.coords.length; i++) {
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
	const trajectory = new Trajectory(waypoints, robot);
	const modifier = new TankModifier(trajectory, waypoints, robot);

	trajectoryCheck(trajectory, waypoints);
	tankModifierCheck(modifier, trajectory);
	for (let i = 0; i < trajectory.coords.length; i++) {
		expect(modifier.left[i].velocity).toBeGreaterThanOrEqual(0);
		expect(modifier.left[i].position).toBeGreaterThanOrEqual(0);

		expect(modifier.right[i].velocity).toBeGreaterThanOrEqual(0);
		expect(modifier.right[i].position).toBeGreaterThanOrEqual(0);

		expect(modifier.angle[i]).toBeGreaterThanOrEqual(-90);
		expect(modifier.angle[i]).toBeLessThanOrEqual(0);
	}
});
