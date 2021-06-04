import TurnInPlaceTrajectory from '../trajectorys/turn-in-place-trajectory';
import SplineTrajectory from '../trajectorys/spline-trajectory';
import { PathGeneratorError } from '../motionProfiling/errors';
import Trajectory from '../trajectorys/trajectory';
import Setpoint from '../motionProfiling/setpoint';
import Coord from '../motionProfiling/coord';
import Waypoint from '../waypoints/waypoint';
import PathConfig from './path-config';

export default class Path {
	protected _trajectory: Trajectory = {} as Trajectory;
	protected _isReverse: boolean = false;
	protected _error?: PathGeneratorError;
	protected _pathConfig: PathConfig;
	protected _waypoints: Waypoint[];

	constructor(waypoints: Waypoint[], pathConfig: PathConfig) {
		this._waypoints = waypoints;
		this._pathConfig = pathConfig;
		try {
			this.generate();
		} catch (error) {
			this._error = error;
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
		return this._trajectory.setpoints ? this._trajectory.setpoints : [];
	}

	get coords(): Coord[] {
		return this._trajectory.coords ? this._trajectory.coords : [];
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
