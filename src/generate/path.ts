import { Modifier } from '../modifier';
import Trajectory from '../trajectory';
import { Coord, Robot, Waypoint } from '../types';

export default class PathGenerator {
	private _trajectory: Trajectory;
	private _modifier: Modifier;

	public constructor(public readonly waypoints: Waypoint[], public readonly robot: Robot, modifier: typeof Modifier) {
		this._trajectory = new Trajectory(waypoints, robot);
		this._modifier = new modifier();
		this._modifier.modify(this._trajectory, waypoints, robot);
	}

	public get coords(): Coord[] {
		return this._trajectory.coords;
	}

	public get trajectory(): Trajectory {
		return this._trajectory;
	}

	public get modifier(): Modifier {
		return this._modifier;
	}
}
