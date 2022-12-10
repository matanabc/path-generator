import { Waypoint, Trajectory, TankModifier } from '../..';
import { robot, trajectoryCheck, tankModifierCheck } from '../';

test('tank 0 » path', () => {
	const waypoints: Waypoint[] = [
		{ x: 0, y: 0, z: 0, heading: 0, velocity: 0, maxVelocity: robot.maxVelocity },
		{ x: 0, y: 0, z: 180, heading: 0, velocity: 0, maxVelocity: robot.maxVelocity },
	];

	const trajectory = new Trajectory(waypoints, robot);
	const modifier = new TankModifier(trajectory, waypoints, robot);

	trajectoryCheck(trajectory, waypoints);
	tankModifierCheck(modifier, trajectory);
	for (let i = 0; i < trajectory.coords.length; i++) {
		expect(modifier.left[i].velocity).toBeGreaterThanOrEqual(0);
		expect(modifier.left[i].position).toBeGreaterThanOrEqual(0);

		expect(modifier.right[i].velocity).toBeLessThanOrEqual(0);
		expect(modifier.right[i].position).toBeLessThanOrEqual(0);

		expect(modifier.angle[i]).toBeGreaterThanOrEqual(0);
		expect(modifier.angle[i]).toBeLessThanOrEqual(180);
	}
});

test('tank 0 « path', () => {
	const waypoints: Waypoint[] = [
		{ x: 0, y: 0, z: 180, heading: 0, velocity: 0, maxVelocity: robot.maxVelocity },
		{ x: 0, y: 0, z: 0, heading: 0, velocity: 0, maxVelocity: robot.maxVelocity },
	];

	const trajectory = new Trajectory(waypoints, robot);
	const modifier = new TankModifier(trajectory, waypoints, robot);

	trajectoryCheck(trajectory, waypoints);
	tankModifierCheck(modifier, trajectory);
	for (let i = 0; i < trajectory.coords.length; i++) {
		expect(modifier.left[i].velocity).toBeLessThanOrEqual(0);
		expect(modifier.left[i].position).toBeLessThanOrEqual(0);

		expect(modifier.right[i].velocity).toBeGreaterThanOrEqual(0);
		expect(modifier.right[i].position).toBeGreaterThanOrEqual(0);

		expect(modifier.angle[i]).toBeGreaterThanOrEqual(0);
		expect(modifier.angle[i]).toBeLessThanOrEqual(180);
	}
});
