import Trajectory from '../trajectory';
import { Robot, Waypoint } from '../types';

export default abstract class Modifier {
	protected abstract modify(trajectory: Trajectory, waypoints: Waypoint[], robot: Robot): void;
}
