import Trajectory from '../generate/trajectory';
import { Robot, Waypoint } from '../common/types';

export interface ModifierConstructor<T extends Modifier> {
	new (trajectory: Trajectory, waypoints: Waypoint[], robot: Robot): T;
}

export default abstract class Modifier {
	protected abstract modify(trajectory: Trajectory, waypoints: Waypoint[], robot: Robot): void;
}
