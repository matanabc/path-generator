import { Swerve, Util } from '../index';
import SwervePath from '../path/swerve-path';
import * as fs from 'fs';

const { Path, PathConfig, Waypoint } = Swerve;
const pathConfig = new PathConfig(2, 2, 0.8);

function basicPathCheck(path: SwervePath): void {
	expect(path.isIllegal()).toBe(false);
	expect(path.ySetpoints.length).toBe(path.xSetpoints.length);
	expect(path.zSetpoints.length).toBe(path.xSetpoints.length);
	expect(path.coords.length).toBe(path.xSetpoints.length);
}

test('Test path', () => {
	const waypoints = [new Waypoint(0, 0, 0, 0, 0, 1), new Waypoint(1, 2, 0, 180, 0, 0)];
	const path = new SwervePath(waypoints, pathConfig);
	// fs.writeFileSync('./test.coord.json', JSON.stringify(path.coords));
	// fs.writeFileSync('./test.x.json', JSON.stringify(path.xSetpoints));
	// fs.writeFileSync('./test.y.json', JSON.stringify(path.ySetpoints));
	// fs.writeFileSync('./test.z.json', JSON.stringify(path.zSetpoints));
	// fs.writeFileSync('./test.front-right.json', JSON.stringify(path.frontRightSetpoints));
	// fs.writeFileSync('./test.front-left.json', JSON.stringify(path.frontLeftSetpoints));
	// fs.writeFileSync('./test.back-right.json', JSON.stringify(path.backRightSetpoints));
	// fs.writeFileSync('./test.back-left.json', JSON.stringify(path.backLeftSetpoints));
});

test('| path', () => {
	const waypoints = [new Waypoint(0, 0, 0, 0, 0, 2), new Waypoint(2, 0, 0, 0, 0, 0)];
	const path = new Path(waypoints, pathConfig);
	basicPathCheck(path);
	path.xSetpoints.forEach((setpoint) => {
		expect(setpoint.velocity).toBeGreaterThanOrEqual(0);
		expect(setpoint.position).toBeGreaterThanOrEqual(0);
	});
	path.ySetpoints.forEach((setpoint) => {
		expect(setpoint.acceleration).toBe(0);
		expect(setpoint.velocity).toBe(0);
		expect(setpoint.position).toBe(0);
	});
	path.zSetpoints.forEach((setpoint) => {
		expect(setpoint.acceleration).toBe(0);
		expect(setpoint.velocity).toBe(0);
		expect(setpoint.position).toBe(0);
	});
	path.coords.forEach((coord) => {
		expect(coord.x).toBeGreaterThanOrEqual(0);
		expect(coord.angle).toBe(0);
		expect(coord.y).toBe(0);
	});
});

test('- path', () => {
	const waypoints = [new Waypoint(0, 0, 0, 0, 0, 2), new Waypoint(0, 2, 0, 0, 0, 0)];
	const path = new Path(waypoints, pathConfig);
	basicPathCheck(path);
	path.ySetpoints.forEach((setpoint) => {
		expect(setpoint.velocity).toBeGreaterThanOrEqual(0);
		expect(setpoint.position).toBeGreaterThanOrEqual(0);
	});
	path.xSetpoints.forEach((setpoint) => {
		expect(setpoint.acceleration).toBe(0);
		expect(setpoint.velocity).toBe(0);
		expect(setpoint.position).toBe(0);
	});
	path.zSetpoints.forEach((setpoint) => {
		expect(setpoint.acceleration).toBe(0);
		expect(setpoint.velocity).toBe(0);
		expect(setpoint.position).toBe(0);
	});
	path.coords.forEach((coord) => {
		expect(coord.y).toBeGreaterThanOrEqual(0);
		expect(coord.angle).toBe(0);
		expect(coord.x).toBe(0);
	});
});

test('/ path', () => {
	const waypoints = [new Waypoint(0, 0, 0, 0, 0, 2), new Waypoint(2, 2, 0, 0, 0, 0)];
	const path = new Path(waypoints, pathConfig);
	basicPathCheck(path);
	path.ySetpoints.forEach((setpoint) => {
		expect(setpoint.velocity).toBeGreaterThanOrEqual(0);
		expect(setpoint.position).toBeGreaterThanOrEqual(0);
	});
	path.xSetpoints.forEach((setpoint) => {
		expect(setpoint.velocity).toBeGreaterThanOrEqual(0);
		expect(setpoint.position).toBeGreaterThanOrEqual(0);
	});
	path.zSetpoints.forEach((setpoint) => {
		expect(setpoint.acceleration).toBe(0);
		expect(setpoint.velocity).toBe(0);
		expect(setpoint.position).toBe(0);
	});
	path.coords.forEach((coord) => {
		expect(coord.y).toBeGreaterThanOrEqual(0);
		expect(coord.x).toBeGreaterThanOrEqual(0);
		expect(coord.angle).toBe(0);
	});
});

test('/ » path', () => {
	const waypoints = [new Waypoint(0, 0, 0, 0, 0, 2), new Waypoint(2, 2, 0, 180, 0, 0)];
	const path = new Path(waypoints, pathConfig);
	basicPathCheck(path);
	path.ySetpoints.forEach((setpoint) => {
		expect(setpoint.velocity).toBeGreaterThanOrEqual(0);
		expect(setpoint.position).toBeGreaterThanOrEqual(0);
	});
	path.xSetpoints.forEach((setpoint) => {
		expect(setpoint.velocity).toBeGreaterThanOrEqual(0);
		expect(setpoint.position).toBeGreaterThanOrEqual(0);
	});
	path.zSetpoints.forEach((setpoint) => {
		expect(setpoint.velocity).toBeGreaterThanOrEqual(0);
		expect(setpoint.position).toBeGreaterThanOrEqual(0);
	});
	path.coords.forEach((coord) => {
		expect(coord.angle).toBeGreaterThanOrEqual(0);
		expect(coord.y).toBeGreaterThanOrEqual(0);
		expect(coord.x).toBeGreaterThanOrEqual(0);
	});
	expect(Util.r2d(path.coords[path.coords.length - 1].angle)).toBeCloseTo(180, 0.05);
});

test('\\ « path', () => {
	const waypoints = [new Waypoint(0, 0, 0, 0, 0, 2), new Waypoint(-2, -2, 0, -180, 0, 0)];
	const path = new Path(waypoints, pathConfig);
	basicPathCheck(path);
	path.ySetpoints.forEach((setpoint) => {
		expect(setpoint.velocity).toBeGreaterThanOrEqual(0);
		expect(setpoint.position).toBeGreaterThanOrEqual(0);
	});
	path.xSetpoints.forEach((setpoint) => {
		expect(setpoint.velocity).toBeGreaterThanOrEqual(0);
		expect(setpoint.position).toBeGreaterThanOrEqual(0);
	});
	path.zSetpoints.forEach((setpoint) => {
		expect(setpoint.velocity).toBeLessThanOrEqual(0);
		expect(setpoint.position).toBeLessThanOrEqual(0);
	});
	path.coords.forEach((coord) => {
		expect(coord.angle).toBeLessThanOrEqual(0);
		expect(coord.y).toBeLessThanOrEqual(0);
		expect(coord.x).toBeGreaterThanOrEqual(0);
	});
	expect(Util.r2d(path.coords[path.coords.length - 1].angle)).toBeCloseTo(-180, 0.05);
});

test('0 » path', () => {
	const waypoints = [new Waypoint(0, 0, 0, 0, 0, 2), new Waypoint(0, 0, 0, 180, 0, 0)];
	const path = new Path(waypoints, pathConfig);
	basicPathCheck(path);
	path.zSetpoints.forEach((setpoint) => {
		expect(setpoint.velocity).toBeGreaterThanOrEqual(0);
		expect(setpoint.position).toBeGreaterThanOrEqual(0);
	});
	path.xSetpoints.forEach((setpoint) => {
		expect(setpoint.acceleration).toBe(0);
		expect(setpoint.velocity).toBe(0);
		expect(setpoint.position).toBe(0);
	});
	path.ySetpoints.forEach((setpoint) => {
		expect(setpoint.acceleration).toBe(0);
		expect(setpoint.velocity).toBe(0);
		expect(setpoint.position).toBe(0);
	});
	path.coords.forEach((coord) => {
		expect(coord.angle).toBeGreaterThanOrEqual(0);
		expect(coord.y).toBe(0);
		expect(coord.x).toBe(0);
	});
	expect(Util.r2d(path.coords[path.coords.length - 1].angle)).toBeCloseTo(180, 0.05);
});

test('0 « path', () => {
	const waypoints = [new Waypoint(0, 0, 0, 0, 0, 2), new Waypoint(0, 0, 0, -180, 0, 0)];
	const path = new Path(waypoints, pathConfig);
	basicPathCheck(path);
	path.zSetpoints.forEach((setpoint) => {
		expect(setpoint.velocity).toBeLessThanOrEqual(0);
		expect(setpoint.position).toBeLessThanOrEqual(0);
	});
	path.xSetpoints.forEach((setpoint) => {
		expect(setpoint.acceleration).toBe(0);
		expect(setpoint.velocity).toBe(0);
		expect(setpoint.position).toBe(0);
	});
	path.ySetpoints.forEach((setpoint) => {
		expect(setpoint.acceleration).toBe(0);
		expect(setpoint.velocity).toBe(0);
		expect(setpoint.position).toBe(0);
	});
	path.coords.forEach((coord) => {
		expect(coord.angle).toBeLessThanOrEqual(0);
		expect(coord.y).toBe(0);
		expect(coord.x).toBe(0);
	});
	expect(Util.r2d(path.coords[path.coords.length - 1].angle)).toBeCloseTo(-180, 0.05);
});
