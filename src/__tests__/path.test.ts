import { Path, Waypoint, PathConfig, Util } from '../index';
import Setpoint from '../setpoint';

const pathConfig = new PathConfig(0.8, 2, 3);

test('Straight path', () => {
	const waypoints = [new Waypoint(0, 0, 0, 0, 2), new Waypoint(2, 0, 0, 0, 0)];
	const path = new Path(waypoints, pathConfig);

	expect(path.isIllegal()).toBeUndefined();
	expect(path.getModifierSetpoints()).toBeUndefined();
	expect(path.getSourceSetpoints()[0].y).toBe(
		path.getSourceSetpoints()[path.getSourceSetpoints().length - 1].y
	);

	checkSetpointsSpeed(path.getSourceSetpoints(), pathConfig.vMax);
	checkLastSetpoint(
		path.getSourceSetpoints()[path.getSourceSetpoints().length - 1],
		waypoints[waypoints.length - 1]
	);
});

test('Turn path', () => {
	const waypoints = [new Waypoint(0, 0, 0, 0, 1), new Waypoint(1.5, 1.5, 90, 0, 0)];
	const path = new Path(waypoints, pathConfig);

	expect(path.isIllegal()).toBeUndefined();
	expect(path.getModifierSetpoints()).toBeUndefined();

	checkSetpointsSpeed(path.getSourceSetpoints(), pathConfig.vMax);
	checkLastSetpoint(
		path.getSourceSetpoints()[path.getSourceSetpoints().length - 1],
		waypoints[waypoints.length - 1]
	);
});

test('Turn in place path', () => {
	const waypoints = [new Waypoint(0, 0, 0, 0, 2.5), new Waypoint(0, 0, 90, 0, 0)];
	const path = new Path(waypoints, pathConfig);
	const lastSetpoint = path.getSourceSetpoints()[path.getSourceSetpoints().length - 1];

	expect(path.isIllegal()).toBeUndefined();
	expect(path.getModifierSetpoints()).toBeUndefined();
	expect(lastSetpoint.x).toBeCloseTo(waypoints[1].x);
	expect(lastSetpoint.y).toBeCloseTo(waypoints[1].y);
	expect(lastSetpoint.velocity).toBeCloseTo(waypoints[1].v, 0.05);
	expect(path.getSourceSetpoints()[0].x).toBe(path.getSourceSetpoints()[1].x);
	expect(path.getSourceSetpoints()[0].y).toBe(path.getSourceSetpoints()[1].y);

	checkSetpointsSpeed(path.getSourceSetpoints(), pathConfig.vMax);
});

test('S path', () => {
	const waypoints = [
		new Waypoint(0, 0, 0, 0, 2),
		new Waypoint(1.5, 1.5, 90, 2, 2),
		new Waypoint(3, 3, 0, 0, 0),
	];
	const path = new Path(waypoints, pathConfig);

	expect(path.isIllegal()).toBeUndefined();
	expect(path.getModifierSetpoints()).toBeUndefined();

	checkSetpointsSpeed(path.getSourceSetpoints(), pathConfig.vMax);
	checkLastSetpoint(
		path.getSourceSetpoints()[path.getSourceSetpoints().length - 1],
		waypoints[waypoints.length - 1]
	);
});

test('Illegal path', () => {
	const waypoints = [new Waypoint(0, 0, 0, 0, 0), new Waypoint(1, 0, 0, 0, 0)];
	const path = new Path(waypoints, pathConfig);

	expect(path.isIllegal()).toBeDefined();
	expect(path.getModifierSetpoints()).toBeUndefined();
});

function checkSetpointsSpeed(setpoints: Setpoint[], vMax: number) {
	for (let i = 0; i < setpoints.length; i++) {
		expect(setpoints[0].velocity).toBeLessThanOrEqual(vMax);
	}
}

function checkLastSetpoint(lastSetpoint: Setpoint, lastWaypoint: Waypoint) {
	expect(lastSetpoint.x).toBeCloseTo(lastWaypoint.x);
	expect(lastSetpoint.y).toBeCloseTo(lastWaypoint.y);
	expect(lastSetpoint.velocity).toBeCloseTo(lastWaypoint.v, 0.05);
	expect(Util.r2d(lastSetpoint.heading)).toBeCloseTo(lastWaypoint.angle);
}
