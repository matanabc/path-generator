import { Swerve, Util } from '../index';
import SwervePath from '../path/swerve-path';
import SwerveSetpoint from '../setpoint/swerve-setpoint';
import * as fs from 'fs';

const { Path, PathConfig, Waypoint } = Swerve;
const pathConfig = new PathConfig(0.8, 2, 2);

function basicPathCheck(path: SwervePath): void {
	expect(path.isIllegal()).toBe(false);
	// expect(path.frontLeftSetpoints.length).toBe(path.frontRightSetpoints.length);
	// expect(path.frontLeftSetpoints.length).toBe(path.backRightSetpoints.length);
	// expect(path.frontLeftSetpoints.length).toBe(path.backLeftSetpoints.length);
	// expect(path.frontLeftSetpoints.length).toBe(path.sourceSetpoints.length);
}

function checkSetpoint(left: SwerveSetpoint[], right: SwerveSetpoint[]): void {
	for (let i = 0; i < left.length; i++) {
		expect(Math.abs(right[i].position)).toBeLessThanOrEqual(Math.abs(left[i].position));
		expect(Math.abs(right[i].velocity)).toBeLessThanOrEqual(Math.abs(left[i].velocity));
		expect(Math.abs(right[i].acceleration)).toBeLessThanOrEqual(Math.abs(left[i].acceleration));
		expect(right[i].angle).toBeCloseTo(left[i].angle);
	}
}

function checkLastSetpointAngle(path: SwervePath, pathAngle: number): void {
	// expect(path.frontRightSetpoints[path.sourceSetpoints.length - 1].angle).toBeCloseTo(pathAngle);
	// expect(path.frontLeftSetpoints[path.sourceSetpoints.length - 1].angle).toBeCloseTo(pathAngle);
	// expect(path.backRightSetpoints[path.sourceSetpoints.length - 1].angle).toBeCloseTo(pathAngle);
	// expect(path.backLeftSetpoints[path.sourceSetpoints.length - 1].angle).toBeCloseTo(pathAngle);
}

test('Test path', () => {
	const waypoints = [new Waypoint(0, 0, 0, 0, 0, 1), new Waypoint(2, 0, 0, 90, 0, 0)];

	const path = new Path(waypoints, pathConfig);

	fs.writeFileSync('./test.x.json', JSON.stringify(path.xSetpoints));
	fs.writeFileSync('./test.y.json', JSON.stringify(path.ySetpoints));
	fs.writeFileSync('./test.z.json', JSON.stringify(path.zSetpoints));

	fs.writeFileSync('./test.front-right.json', JSON.stringify(path.frontRightSetpoints));
	fs.writeFileSync('./test.front-left.json', JSON.stringify(path.frontLeftSetpoints));
	fs.writeFileSync('./test.back-right.json', JSON.stringify(path.backRightSetpoints));
	fs.writeFileSync('./test.back-left.json', JSON.stringify(path.backLeftSetpoints));
});

test('Straight path', () => {
	const waypoints = [new Waypoint(0, 0, 0, 0, 0, 2), new Waypoint(2, 0, 0, 0, 0, 0)];
	const path = new Path(waypoints, pathConfig);
	basicPathCheck(path);
	// checkSetpoint(path.frontLeftSetpoints, path.frontRightSetpoints);
	checkLastSetpointAngle(path, waypoints[1].angle);
});

test('Straight path with robot turn 180 left', () => {
	const waypoints = [new Waypoint(0, 0, 0, 90, 0, 2), new Waypoint(2, 0, 0, -90, 0, 0)];
	const path = new Path(waypoints, pathConfig);
	basicPathCheck(path);
	expect(Util.r2d(path.coords[0].angle)).toBeCloseTo(waypoints[0].robotAngle, 0.05);
	expect(Util.r2d(path.coords[path.coords.length - 1].angle)).toBeCloseTo(waypoints[1].robotAngle, 0.05);
	// checkSetpoint(path.frontRightSetpoints, path.frontLeftSetpoints);
});

test('Straight path with robot turn 180 right', () => {
	const waypoints = [new Waypoint(0, 0, 0, -90, 0, 2), new Waypoint(2, 0, 0, 90, 0, 0)];
	const path = new Path(waypoints, pathConfig);
	basicPathCheck(path);
	expect(Util.r2d(path.coords[0].angle)).toBeCloseTo(waypoints[0].robotAngle, 0.05);
	expect(Util.r2d(path.coords[path.coords.length - 1].angle)).toBeCloseTo(waypoints[1].robotAngle, 0.05);
	// checkSetpoint(path.frontLeftSetpoints, path.frontRightSetpoints);
});

test('Turn path right', () => {
	const waypoints = [new Waypoint(0, 0, 0, 0, 0, 2), new Waypoint(1.5, 1.5, 90, 0, 0, 0)];
	const path = new Path(waypoints, pathConfig);
	basicPathCheck(path);
	expect(path.coords[path.coords.length - 1].angle).toBeCloseTo(waypoints[1].robotAngle);
	// checkSetpoint(path.frontLeftSetpoints, path.frontRightSetpoints);
	checkLastSetpointAngle(path, waypoints[1].angle);
});

test('Turn path left', () => {
	const waypoints = [new Waypoint(0, 0, 90, 0, 0, 2), new Waypoint(1.5, 1.5, 0, 0, 0, 0)];
	const path = new Path(waypoints, pathConfig);
	basicPathCheck(path);
	expect(path.coords[path.coords.length - 1].angle).toBeCloseTo(waypoints[1].robotAngle);
	// checkSetpoint(path.frontRightSetpoints, path.frontLeftSetpoints);
	checkLastSetpointAngle(path, waypoints[1].angle);
});

test('Turn path right with robot turn 180 right', () => {
	const waypoints = [new Waypoint(0, 0, 0, 0, 0, 2), new Waypoint(1.5, 1.5, 90, 180, 0, 0)];
	const path = new Path(waypoints, pathConfig);
	basicPathCheck(path);
	expect(Util.r2d(path.coords[path.coords.length - 1].angle)).toBeCloseTo(waypoints[1].robotAngle);
	// checkSetpoint(path.frontLeftSetpoints, path.frontRightSetpoints);
});

test('Turn path right with robot turn 180 left', () => {
	const waypoints = [new Waypoint(0, 0, 0, 180, 0, 2), new Waypoint(1.5, 1.5, 90, 0, 0, 0)];
	const path = new Path(waypoints, pathConfig);
	basicPathCheck(path);
	expect(Util.r2d(path.coords[path.coords.length - 1].angle)).toBeCloseTo(waypoints[1].robotAngle);
	// checkSetpoint(path.frontRightSetpoints, path.frontLeftSetpoints);
});

test('Turn path left with robot turn 180 right', () => {
	const waypoints = [new Waypoint(0, 0, 90, 0, 0, 2), new Waypoint(1.5, 1.5, 0, 180, 0, 0)];
	const path = new Path(waypoints, pathConfig);
	basicPathCheck(path);
	expect(Util.r2d(path.coords[path.coords.length - 1].angle)).toBeCloseTo(waypoints[1].robotAngle);
	// checkSetpoint(path.frontLeftSetpoints, path.frontRightSetpoints);
});

test('Turn path left with robot turn 180 left', () => {
	const waypoints = [new Waypoint(0, 0, 90, 180, 0, 2), new Waypoint(1.5, 1.5, 0, 0, 0, 0)];
	const path = new Path(waypoints, pathConfig);
	basicPathCheck(path);
	expect(Util.r2d(path.coords[path.coords.length - 1].angle)).toBeCloseTo(waypoints[1].robotAngle);
	// checkSetpoint(path.frontRightSetpoints, path.frontLeftSetpoints);
});

test('Turn in place path right', () => {
	const waypoints = [new Waypoint(0, 0, 0, 0, 0, 2.5), new Waypoint(0, 0, 90, 0, 0, 0)];
	const path = new Path(waypoints, pathConfig);
	basicPathCheck(path);
	expect(Util.r2d(path.coords[0].angle)).toBeCloseTo(waypoints[0].angle, 0.05);
	expect(Util.r2d(path.coords[path.coords.length - 1].angle)).toBeCloseTo(waypoints[1].angle, 0.05);
	// checkSetpoint(path.frontLeftSetpoints, path.frontRightSetpoints);
});

test('Turn in place path left', () => {
	const waypoints = [new Waypoint(0, 0, 0, 0, 0, 2.5), new Waypoint(0, 0, -90, 0, 0, 0)];
	const path = new Path(waypoints, pathConfig);
	basicPathCheck(path);
	expect(Util.r2d(path.coords[0].angle)).toBeCloseTo(waypoints[0].angle, 0.05);
	expect(Util.r2d(path.coords[path.coords.length - 1].angle)).toBeCloseTo(waypoints[1].angle, 0.05);
	// checkSetpoint(path.frontRightSetpoints, path.frontLeftSetpoints);
});

test('Path with no waypoints', () => {
	const path = new Path([], pathConfig);
	basicPathCheck(path);
});
