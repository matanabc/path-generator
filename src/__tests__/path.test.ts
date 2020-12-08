import { Path, Waypoint, PathConfig, Util } from '../index';
import Setpoint from '../setpoint/setpoint';
import Coord from '../coord/coord';

const pathConfig = new PathConfig(0.8, 2, 3);

test('Straight path', () => {
	const waypoints = [new Waypoint(0, 0, 0, 0, 2), new Waypoint(2, 0, 0, 0, 0)];
	const path = new Path(waypoints, pathConfig);

	expect(path.isIllegal()).toBe(false);
	expect(path.coords[0].y).toBe(path.coords[path.coords.length - 1].y);

	checkSetpointsSpeed(path.sourceSetpoints, pathConfig.vMax);
	checkLastSetpoint(
		path.sourceSetpoints[path.sourceSetpoints.length - 1],
		path.coords[path.coords.length - 1],
		waypoints[waypoints.length - 1]
	);
});

test('Turn path', () => {
	const waypoints = [new Waypoint(0, 0, 0, 0, 1), new Waypoint(1.5, 1.5, 90, 0, 0)];
	const path = new Path(waypoints, pathConfig);

	expect(path.isIllegal()).toBe(false);

	checkSetpointsSpeed(path.sourceSetpoints, pathConfig.vMax);
	checkLastSetpoint(
		path.sourceSetpoints[path.sourceSetpoints.length - 1],
		path.coords[path.coords.length - 1],
		waypoints[waypoints.length - 1]
	);
});

test('Turn in place path', () => {
	const waypoints = [new Waypoint(0, 0, 0, 0, 2.5), new Waypoint(0, 0, 90, 0, 0)];
	const path = new Path(waypoints, pathConfig);
	const lastCoords = path.coords[path.coords.length - 1];
	const lastSetpoint = path.sourceSetpoints[path.sourceSetpoints.length - 1];

	expect(path.isIllegal()).toBe(false);

	expect(lastCoords.x).toBeCloseTo(waypoints[1].x);
	expect(lastCoords.y).toBeCloseTo(waypoints[1].y);
	expect(lastSetpoint.velocity).toBeCloseTo(waypoints[1].v, 0.05);
	expect(path.coords[0].x).toBe(path.coords[1].x);
	expect(path.coords[0].y).toBe(path.coords[1].y);

	checkSetpointsSpeed(path.sourceSetpoints, pathConfig.vMax);
});

test('S path', () => {
	const waypoints = [
		new Waypoint(0, 0, 0, 0, 2),
		new Waypoint(1.5, 1.5, 90, 2, 2),
		new Waypoint(3, 3, 0, 0, 0),
	];
	const path = new Path(waypoints, pathConfig);

	expect(path.isIllegal()).toBe(false);

	checkSetpointsSpeed(path.sourceSetpoints, pathConfig.vMax);
	checkLastSetpoint(
		path.sourceSetpoints[path.sourceSetpoints.length - 1],
		path.coords[path.coords.length - 1],
		waypoints[waypoints.length - 1]
	);
});

function checkSetpointsSpeed(setpoints: Setpoint[], vMax: number) {
	for (let i = 0; i < setpoints.length; i++) {
		expect(setpoints[0].velocity).toBeLessThanOrEqual(vMax);
	}
}

function checkLastSetpoint(lastSetpoint: Setpoint, lastCoord: Coord, lastWaypoint: Waypoint) {
	expect(lastCoord.x).toBeCloseTo(lastWaypoint.x);
	expect(lastCoord.y).toBeCloseTo(lastWaypoint.y);
	expect(lastSetpoint.velocity).toBeCloseTo(lastWaypoint.v, 0.05);
	expect(Util.r2d(lastCoord.angle)).toBeCloseTo(lastWaypoint.angle);
}
