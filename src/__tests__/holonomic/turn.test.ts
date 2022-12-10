import { Waypoint, Trajectory, HolonomicModifier } from '../..';
import { holonomicModifierCheck, robot, trajectoryCheck } from '../';

test('holonomic 0 » path', () => {
	const waypoints: Waypoint[] = [
		{ x: 0, y: 0, z: 0, heading: 0, velocity: 0, maxVelocity: robot.maxVelocity },
		{ x: 0, y: 0, z: 180, heading: 0, velocity: 0, maxVelocity: robot.maxVelocity },
	];
	const trajectory = new Trajectory(waypoints, robot);
	const modifier = new HolonomicModifier(trajectory, waypoints, robot);

	trajectoryCheck(trajectory, waypoints);
	holonomicModifierCheck(modifier, trajectory);
	for (let i = 0; i < trajectory.coords.length; i++) {
		expect(modifier.x[i].velocity).toBe(0);
		expect(modifier.x[i].position).toBe(0);

		expect(modifier.y[i].velocity).toBe(0);
		expect(modifier.y[i].position).toBe(0);
		expect(modifier.y[i].acceleration).toBe(0);

		expect(modifier.z[i].velocity).toBeGreaterThanOrEqual(0);
		expect(modifier.z[i].position).toBeGreaterThanOrEqual(0);
		expect(modifier.z[i].position).toBeLessThanOrEqual(180);
	}
});

test('holonomic 0 « path', () => {
	const waypoints: Waypoint[] = [
		{ x: 0, y: 0, z: -180, heading: 0, velocity: 0, maxVelocity: robot.maxVelocity },
		{ x: 0, y: 0, z: -360, heading: 0, velocity: 0, maxVelocity: robot.maxVelocity },
	];
	const trajectory = new Trajectory(waypoints, robot);
	const modifier = new HolonomicModifier(trajectory, waypoints, robot);

	trajectoryCheck(trajectory, waypoints);
	holonomicModifierCheck(modifier, trajectory);
	for (let i = 0; i < trajectory.coords.length; i++) {
		expect(modifier.x[i].velocity).toBe(0);
		expect(modifier.x[i].position).toBe(0);

		expect(modifier.y[i].velocity).toBe(0);
		expect(modifier.y[i].position).toBe(0);
		expect(modifier.y[i].acceleration).toBe(0);

		expect(modifier.z[i].velocity).toBeLessThanOrEqual(0);
		expect(modifier.z[i].position).toBeLessThanOrEqual(-180);
		expect(modifier.z[i].position).toBeGreaterThanOrEqual(-360);
	}
});

test('holonomic - » path (forward)', () => {
	const waypoints: Waypoint[] = [
		{ x: 0, y: 0, z: 0, heading: 0, velocity: 0, maxVelocity: robot.maxVelocity },
		{ x: 2, y: 0, z: 180, heading: 0, velocity: 0, maxVelocity: robot.maxVelocity },
		{ x: 4, y: 0, z: 0, heading: 0, velocity: 0, maxVelocity: robot.maxVelocity },
	];
	const trajectory = new Trajectory(waypoints, robot);
	const modifier = new HolonomicModifier(trajectory, waypoints, robot);

	trajectoryCheck(trajectory, waypoints);
	holonomicModifierCheck(modifier, trajectory);
	for (let i = 0; i < trajectory.coords.length; i++) {
		expect(modifier.x[i].velocity).toBeGreaterThanOrEqual(0);
		expect(modifier.x[i].position).toBeGreaterThanOrEqual(0);
		expect(modifier.x[i].position).toBeLessThanOrEqual(4);

		expect(modifier.y[i].velocity).toBeCloseTo(0);
		expect(modifier.y[i].position).toBeCloseTo(0);
		expect(modifier.y[i].acceleration).toBeCloseTo(0);

		expect(modifier.z[i].position).toBeGreaterThanOrEqual(0);
		expect(modifier.z[i].position).toBeLessThanOrEqual(180);
	}
});

test('holonomic - « path (forward)', () => {
	const waypoints: Waypoint[] = [
		{ x: 2, y: 0, z: 0, heading: 0, velocity: 0, maxVelocity: robot.maxVelocity },
		{ x: 4, y: 0, z: -180, heading: 0, velocity: 0, maxVelocity: robot.maxVelocity },
		{ x: 6, y: 0, z: 0, heading: 0, velocity: 0, maxVelocity: robot.maxVelocity },
	];
	const trajectory = new Trajectory(waypoints, robot);
	const modifier = new HolonomicModifier(trajectory, waypoints, robot);

	trajectoryCheck(trajectory, waypoints);
	holonomicModifierCheck(modifier, trajectory);
	for (let i = 0; i < trajectory.coords.length; i++) {
		expect(modifier.x[i].velocity).toBeGreaterThanOrEqual(0);
		expect(modifier.x[i].position).toBeGreaterThanOrEqual(2);
		expect(modifier.x[i].position).toBeLessThanOrEqual(6);

		expect(modifier.y[i].velocity).toBe(0);
		expect(modifier.y[i].position).toBe(0);
		expect(modifier.y[i].acceleration).toBe(0);

		expect(modifier.z[i].position).toBeLessThanOrEqual(0);
		expect(modifier.z[i].position).toBeGreaterThanOrEqual(-180);
	}
});

test('holonomic | » path (backward)', () => {
	const waypoints: Waypoint[] = [
		{ x: 0, y: 2, z: 0, heading: 90, velocity: 0, maxVelocity: robot.maxVelocity },
		{ x: 0, y: 0, z: 180, heading: 90, velocity: 0, maxVelocity: robot.maxVelocity },
	];
	const trajectory = new Trajectory(waypoints, robot);
	const modifier = new HolonomicModifier(trajectory, waypoints, robot);

	trajectoryCheck(trajectory, waypoints);
	holonomicModifierCheck(modifier, trajectory);
	for (let i = 0; i < trajectory.coords.length; i++) {
		expect(modifier.x[i].velocity).toBeCloseTo(0);
		expect(modifier.x[i].position).toBeCloseTo(0);
		expect(modifier.x[i].acceleration).toBeCloseTo(0);

		expect(modifier.y[i].velocity).toBeLessThanOrEqual(0);
		expect(modifier.y[i].position).toBeGreaterThanOrEqual(0);
		expect(modifier.y[i].position).toBeLessThanOrEqual(2);

		expect(modifier.z[i].velocity).toBeGreaterThanOrEqual(0);
		expect(modifier.z[i].position).toBeGreaterThanOrEqual(0);
		expect(modifier.z[i].position).toBeLessThanOrEqual(180);
	}
});

test('holonomic | « path (backward)', () => {
	const waypoints: Waypoint[] = [
		{ x: 0, y: 2, z: 0, heading: 90, velocity: 0, maxVelocity: robot.maxVelocity },
		{ x: 0, y: 0, z: -180, heading: 90, velocity: 0, maxVelocity: robot.maxVelocity },
	];
	const trajectory = new Trajectory(waypoints, robot);
	const modifier = new HolonomicModifier(trajectory, waypoints, robot);

	trajectoryCheck(trajectory, waypoints);
	holonomicModifierCheck(modifier, trajectory);
	for (let i = 0; i < trajectory.coords.length; i++) {
		expect(modifier.x[i].velocity).toBeCloseTo(0);
		expect(modifier.x[i].position).toBeCloseTo(0);
		expect(modifier.x[i].acceleration).toBeCloseTo(0);

		expect(modifier.y[i].velocity).toBeLessThanOrEqual(0);
		expect(modifier.y[i].position).toBeGreaterThanOrEqual(0);
		expect(modifier.y[i].position).toBeLessThanOrEqual(2);

		expect(modifier.z[i].velocity).toBeLessThanOrEqual(0);
		expect(modifier.z[i].position).toBeLessThanOrEqual(0);
		expect(modifier.z[i].position).toBeGreaterThanOrEqual(-180);
	}
});

test('holonomic S » path (forward)', () => {
	const waypoints: Waypoint[] = [
		{ x: 0, y: 0, z: 0, heading: 0, velocity: 0, maxVelocity: robot.maxVelocity },
		{ x: 2, y: 2, z: 180, heading: 0, velocity: 0, maxVelocity: robot.maxVelocity },
	];
	const trajectory = new Trajectory(waypoints, robot);
	const modifier = new HolonomicModifier(trajectory, waypoints, robot);

	trajectoryCheck(trajectory, waypoints);
	holonomicModifierCheck(modifier, trajectory);
	for (let i = 0; i < trajectory.coords.length; i++) {
		expect(modifier.x[i].velocity).toBeGreaterThanOrEqual(0);
		expect(modifier.x[i].position).toBeGreaterThanOrEqual(0);
		expect(modifier.x[i].position).toBeLessThanOrEqual(2);

		expect(modifier.y[i].velocity).toBeGreaterThanOrEqual(0);
		expect(modifier.y[i].position).toBeGreaterThanOrEqual(0);
		expect(modifier.y[i].position).toBeLessThanOrEqual(2);

		expect(modifier.z[i].velocity).toBeGreaterThanOrEqual(0);
		expect(modifier.z[i].position).toBeGreaterThanOrEqual(0);
		expect(modifier.z[i].position).toBeLessThanOrEqual(180);
	}
});

test('holonomic S « path (backward)', () => {
	const waypoints: Waypoint[] = [
		{ x: 2, y: 2, z: 0, heading: 0, velocity: 0, maxVelocity: robot.maxVelocity },
		{ x: 0, y: 0, z: -180, heading: 0, velocity: 0, maxVelocity: robot.maxVelocity },
	];
	const trajectory = new Trajectory(waypoints, robot);
	const modifier = new HolonomicModifier(trajectory, waypoints, robot);

	trajectoryCheck(trajectory, waypoints);
	holonomicModifierCheck(modifier, trajectory);
	for (let i = 0; i < trajectory.coords.length; i++) {
		expect(modifier.x[i].velocity).toBeLessThanOrEqual(0);
		expect(modifier.x[i].position).toBeLessThanOrEqual(2);
		expect(modifier.x[i].position).toBeGreaterThanOrEqual(0);

		expect(modifier.y[i].velocity).toBeLessThanOrEqual(0);
		expect(modifier.y[i].position).toBeLessThanOrEqual(2);
		expect(modifier.y[i].position).toBeGreaterThanOrEqual(0);

		expect(modifier.z[i].velocity).toBeLessThanOrEqual(0);
		expect(modifier.z[i].position).toBeLessThanOrEqual(0);
		expect(modifier.z[i].position).toBeGreaterThanOrEqual(-180);
	}
});
