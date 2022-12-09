import Trajectory from '../trajectory';
import { Robot, Waypoint } from '../types';

export default class Modifier {
	modify(trajectory: Trajectory, waypoints: Waypoint[], robot: Robot): void {
		throw new Error('Method not implemented.');
	}
}
