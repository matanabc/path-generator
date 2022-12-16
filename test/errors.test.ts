import {
	MaxVelocityEqualToNaNError,
	MaxVelocityEqualToZeroError,
	MaxVelocitySmallerThenEndVelocityError,
	RobotValueEqualOrLessThenZeroError,
	SplineIsToLongError,
	Trajectory,
	Waypoint,
} from '../src';
import { robot } from './utils';

test('max velocity === 0', () => {
	const waypoints: Waypoint[] = [
		{ x: 0, y: 0, z: 0, heading: 0, velocity: 0, maxVelocity: 0 },
		{ x: 1, y: 0, z: 0, heading: 0, velocity: 0, maxVelocity: 0 },
	];
	expect(() => new Trajectory(waypoints, robot)).toThrowError(new MaxVelocityEqualToZeroError());
});

test('max velocity === NaN', () => {
	const waypoints: Waypoint[] = [
		{ x: 0, y: 0, z: 0, heading: 0, velocity: 0, maxVelocity: NaN },
		{ x: 1, y: 0, z: 0, heading: 0, velocity: 0, maxVelocity: 0 },
	];
	expect(() => new Trajectory(waypoints, robot)).toThrowError(new MaxVelocityEqualToNaNError());
});

test('max velocity < end velocity', () => {
	const waypoints: Waypoint[] = [
		{ x: 0, y: 0, z: 0, heading: 0, velocity: 0, maxVelocity: 0.5 },
		{ x: 1, y: 0, z: 0, heading: 0, velocity: 1, maxVelocity: 0 },
	];
	expect(() => new Trajectory(waypoints, robot)).toThrowError(new MaxVelocitySmallerThenEndVelocityError(0, 1, 0));
});

test('spline is to long', () => {
	const waypoints: Waypoint[] = [
		{ x: 0, y: 0, heading: 0, velocity: 0, maxVelocity: 1 },
		{ x: 0, y: 1, heading: 0, velocity: 0, maxVelocity: 0 },
	];
	expect(() => new Trajectory(waypoints, robot)).toThrowError(new SplineIsToLongError());
});

test('robot max velocity <= 0', () => {
	const waypoints: Waypoint[] = [
		{ x: 0, y: 0, heading: 0, velocity: 0, maxVelocity: 1 },
		{ x: 1, y: 0, heading: 0, velocity: 0, maxVelocity: 0 },
	];
	expect(() => new Trajectory(waypoints, { ...robot, maxVelocity: 0 })).toThrowError(
		new RobotValueEqualOrLessThenZeroError('max velocity')
	);
	expect(() => new Trajectory(waypoints, { ...robot, maxVelocity: -1 })).toThrowError(
		new RobotValueEqualOrLessThenZeroError('max velocity')
	);
});

test('robot acceleration <= 0', () => {
	const waypoints: Waypoint[] = [
		{ x: 0, y: 0, heading: 0, velocity: 0, maxVelocity: 1 },
		{ x: 1, y: 0, heading: 0, velocity: 0, maxVelocity: 0 },
	];
	expect(() => new Trajectory(waypoints, { ...robot, acceleration: 0 })).toThrowError(
		new RobotValueEqualOrLessThenZeroError('acceleration')
	);
	expect(() => new Trajectory(waypoints, { ...robot, acceleration: -1 })).toThrowError(
		new RobotValueEqualOrLessThenZeroError('acceleration')
	);
});

test('robot loop time <= 0', () => {
	const waypoints: Waypoint[] = [
		{ x: 0, y: 0, heading: 0, velocity: 0, maxVelocity: 1 },
		{ x: 1, y: 0, heading: 0, velocity: 0, maxVelocity: 0 },
	];
	expect(() => new Trajectory(waypoints, { ...robot, loopTime: 0 })).toThrowError(
		new RobotValueEqualOrLessThenZeroError('loop time')
	);
	expect(() => new Trajectory(waypoints, { ...robot, loopTime: -1 })).toThrowError(
		new RobotValueEqualOrLessThenZeroError('loop time')
	);
});
