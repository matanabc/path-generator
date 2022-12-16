import { HolonomicModifier, Robot, TankModifier, Trajectory, Waypoint } from '../src';

export const robot: Robot = { acceleration: 2, maxVelocity: 2, width: 0.6, loopTime: 0.02 };

export function trajectoryCheck(trajectory: Trajectory, waypoints: Waypoint[]) {
	const firstWaypoint = waypoints[0];
	expect(trajectory.coords[0].x).toBeCloseTo(firstWaypoint.x);
	expect(trajectory.coords[0].y).toBeCloseTo(firstWaypoint.y);
	expect(trajectory.coords[0].z).toBeCloseTo(firstWaypoint.z !== undefined ? firstWaypoint.z : firstWaypoint.heading);

	const lestWaypoint = waypoints[waypoints.length - 1];
	expect(trajectory.coords[trajectory.coords.length - 1].x).toBeCloseTo(lestWaypoint.x);
	expect(trajectory.coords[trajectory.coords.length - 1].y).toBeCloseTo(lestWaypoint.y);
	expect(trajectory.coords[trajectory.coords.length - 1].z).toBeCloseTo(
		lestWaypoint.z !== undefined ? lestWaypoint.z : lestWaypoint.heading,
		0.05
	);
}

export function holonomicModifierCheck(modifier: HolonomicModifier, trajectory: Trajectory): void {
	expect(modifier.x.length).toBe(trajectory.coords.length);
	expect(modifier.y.length).toBe(trajectory.coords.length);
	expect(modifier.z.length).toBe(trajectory.coords.length);

	trajectory.coords.forEach((coord, index) => {
		expect(modifier.x[index].position).toBeCloseTo(coord.x);
		expect(modifier.y[index].position).toBeCloseTo(coord.y);
		expect(modifier.z[index].position).toBeCloseTo(coord.z);
	});
}

export function tankModifierCheck(modifier: TankModifier, trajectory: Trajectory): void {
	expect(modifier.left.length).toBe(trajectory.coords.length);
	expect(modifier.right.length).toBe(trajectory.coords.length);
	expect(modifier.angle.length).toBe(trajectory.coords.length);
}
