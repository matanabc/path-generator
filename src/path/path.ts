import TurnInPlaceTrajectory from '../trajectorys/turn-in-place-trajectory';
import SplineTrajectory from '../trajectorys/spline-trajectory';
import { PathGeneratorError } from '../motionProfiling/errors';
import Trajectory from '../trajectorys/trajectory';
import Setpoint from '../motionProfiling/setpoint';
import Coord from '../motionProfiling/coord';
import Waypoint from '../waypoints/waypoint';
import Arc from '../motionProfiling/arc';
import PathConfig from './path-config';
import { copy } from '../util';

export default class Path {
	protected _trajectory: Trajectory = {} as Trajectory;
	protected _isReverse: boolean = false;
	protected _error?: PathGeneratorError;
	protected _pathConfig: PathConfig;
	protected _waypoints: Waypoint[];

	constructor(waypoints: Waypoint[], pathConfig: PathConfig) {
		this._waypoints = copy(Waypoint, waypoints);
		this._pathConfig = pathConfig;
		try {
			this.fixWaypointV();
			this.generate();
		} catch (error) {
			if (error instanceof PathGeneratorError) this._error = error;
		}
	}

	protected fixWaypointV(): void {
		const arcs: Arc[] = [];
		const { acc, vMax } = this.pathConfig;
		const getSpeed = (distance: number, v0: number) => Math.sqrt(Math.pow(v0, 2) + 2 * acc * distance);
		for (let i = 1; i < this.waypoints.length; i++) arcs.push(new Arc(this.waypoints[i - 1], this.waypoints[i]));
		const fromEnd = [];
		for (let i = arcs.length; i > 1; i--) {
			const v0: number =
				fromEnd.length > 0 ? fromEnd[fromEnd.length - 1] : this.waypoints[this.waypoints.length - 1].v;
			fromEnd.push(getSpeed(arcs[i - 1].arc_length, v0));
		}
		for (let i = 1; i < this.waypoints.length - 1; i++) {
			const fromStart = getSpeed(arcs[i - 1].arc_length, this.waypoints[i - 1].v);
			this.waypoints[i].v = Math.min(vMax, this.waypoints[i].v, fromStart, fromEnd[fromEnd.length - i]);
		}
	}

	protected generate(): void {
		if (TurnInPlaceTrajectory.isTurnInPlace(this.waypoints))
			this._trajectory = new TurnInPlaceTrajectory(this.waypoints, this.pathConfig);
		else this._trajectory = new SplineTrajectory(this.waypoints, this.pathConfig);
	}

	get waypoints(): Waypoint[] {
		return this._waypoints;
	}

	get pathConfig(): PathConfig {
		return this._pathConfig;
	}

	get sourceSetpoints(): Setpoint[] {
		return this._trajectory.setpoints || [];
	}

	get coords(): Coord[] {
		return this._trajectory.coords || [];
	}

	get error() {
		return this._error;
	}

	isIllegal(): boolean {
		return this.error !== undefined;
	}

	isTurnInPlace(): boolean {
		return this._trajectory instanceof TurnInPlaceTrajectory;
	}

	isReverse(): boolean {
		return this._isReverse;
	}

	changeDirection(): void {
		if (this.isTurnInPlace()) return;
		this._isReverse = !this._isReverse;
		this.sourceSetpoints.forEach((setpoint) => setpoint.changeDirection());
	}
}
