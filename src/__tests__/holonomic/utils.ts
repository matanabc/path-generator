import { PathGenerator, HolonomicModifier } from '../../';

export function basicPathCheck(path: PathGenerator): void {
	const firstWaypoint = path.waypoints[0];
	expect(path.coords[0].x).toBeCloseTo(firstWaypoint.x);
	expect(path.coords[0].y).toBeCloseTo(firstWaypoint.y);
	expect(path.coords[0].z).toBeCloseTo(firstWaypoint.z || 0);

	const lestWaypoint = path.waypoints[path.waypoints.length - 1];
	expect(path.coords[path.coords.length - 1].x).toBeCloseTo(lestWaypoint.x);
	expect(path.coords[path.coords.length - 1].y).toBeCloseTo(lestWaypoint.y);
	expect(path.coords[path.coords.length - 1].z).toBeCloseTo(lestWaypoint.z || 0, 0.05);

	const modifier = path.modifier as HolonomicModifier;
	expect(modifier.x.length).toBe(path.coords.length);
	expect(modifier.y.length).toBe(path.coords.length);
	expect(modifier.z.length).toBe(path.coords.length);

	path.coords.forEach((coord, index) => {
		expect(modifier.x[index].position).toBeCloseTo(coord.x);
		expect(modifier.y[index].position).toBeCloseTo(coord.y);
		expect(modifier.z[index].position).toBeCloseTo(coord.z);
	});
}
