import { Tank, Util } from '../index';
import TankPath from '../path/tank-path';
const { Path, PathConfig, Waypoint } = Tank;

const pathConfig = new PathConfig(0.8, 2, 3);

function basicPathCheck(path: TankPath): void {
	expect(path.isIllegal()).toBe(false);
	expect(path.leftSetpoints.length).toBe(path.rightSetpoints.length);
	expect(path.leftSetpoints.length).toBe(path.sourceSetpoints.length);
}

test('Straight path', () => {
	const waypoints = [new Waypoint(0, 0, 0, 0, 2), new Waypoint(2, 0, 0, 0, 0)];
	const path = new Path(waypoints, pathConfig);
	basicPathCheck(path);
});

test('Turn path right', () => {
	const waypoints = [new Waypoint(0, 0, 0, 0, 2), new Waypoint(1.5, 1.5, 90, 0, 0)];
	const path = new Path(waypoints, pathConfig);
	basicPathCheck(path);
	for (let i = 0; i < path.sourceSetpoints.length; i++) {
		expect(path.rightSetpoints[i].position).toBeLessThanOrEqual(path.leftSetpoints[i].position);
	}
});

test('Turn path left', () => {
	const waypoints = [new Waypoint(0, 0, 90, 0, 2), new Waypoint(1.5, 1.5, 0, 0, 0)];
	const path = new Path(waypoints, pathConfig);
	basicPathCheck(path);
	for (let i = 0; i < path.sourceSetpoints.length; i++) {
		expect(path.leftSetpoints[i].position).toBeLessThanOrEqual(path.rightSetpoints[i].position);
	}
});

test('Turn in place path right', () => {
	const waypoints = [new Waypoint(0, 0, 0, 0, 2.5), new Waypoint(0, 0, 90, 0, 0)];
	const path = new Path(waypoints, pathConfig);
	basicPathCheck(path);
	expect(Util.r2d(path.coords[0].angle)).toBeCloseTo(waypoints[0].angle, 0.05);
	expect(Util.r2d(path.coords[path.coords.length - 1].angle)).toBeCloseTo(waypoints[1].angle, 0.05);
	for (let i = 0; i < path.sourceSetpoints.length; i++) {
		expect(path.leftSetpoints[i].position).toBeLessThanOrEqual(-path.rightSetpoints[i].position);
	}
});

test('Turn in place path left', () => {
	const waypoints = [new Waypoint(0, 0, 0, 0, 2.5), new Waypoint(0, 0, -90, 0, 0)];
	const path = new Path(waypoints, pathConfig);
	basicPathCheck(path);
	expect(Util.r2d(path.coords[0].angle)).toBeCloseTo(waypoints[0].angle, 0.05);
	expect(Util.r2d(path.coords[path.coords.length - 1].angle)).toBeCloseTo(waypoints[1].angle, 0.05);
	for (let i = 0; i < path.sourceSetpoints.length; i++) {
		expect(path.rightSetpoints[i].position).toBeLessThanOrEqual(-path.leftSetpoints[i].position);
	}
});
