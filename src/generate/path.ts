import { Robot, Waypoint } from '../common/types';
import { Modifier, ModifierConstructor } from '../modifier';
import Trajectory from './trajectory';

export default function pathGenerator<T extends Modifier>(
	waypoints: Waypoint[],
	robot: Robot,
	type: ModifierConstructor<T>
): T {
	const trajectory = new Trajectory(waypoints, robot);
	return new type(trajectory, waypoints, robot);
}
