import { HolonomicModifier, pathGenerator, TankModifier, Waypoint } from '../src';
import { robot } from './utils';

test('tank path', () => {
	const waypoints: Waypoint[] = [
		{ x: 0, y: 0, heading: 0, velocity: 0, maxVelocity: robot.maxVelocity },
		{ x: 2, y: 2, heading: 0, velocity: 0, maxVelocity: 0 },
	];
	const path = pathGenerator(waypoints, robot, TankModifier);

	expect(path).toBeInstanceOf(TankModifier);
	expect(path.angle).toBeInstanceOf(Array);
	expect(path.right).toBeInstanceOf(Array);
	expect(path.left).toBeInstanceOf(Array);
});

test('holonomic path', () => {
	const waypoints: Waypoint[] = [
		{ x: 0, y: 0, z: 0, heading: 0, velocity: 0, maxVelocity: robot.maxVelocity },
		{ x: 2, y: 2, z: 0, heading: 0, velocity: 0, maxVelocity: 0 },
	];
	const path = pathGenerator(waypoints, robot, HolonomicModifier);

	expect(path).toBeInstanceOf(HolonomicModifier);
	expect(path.x).toBeInstanceOf(Array);
	expect(path.y).toBeInstanceOf(Array);
	expect(path.z).toBeInstanceOf(Array);
});
