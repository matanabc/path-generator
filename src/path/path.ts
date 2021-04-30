import TurnInPlaceTrajectory from '../trajectorys/turn-in-place-trajectory';
import SplineTrajectory from '../trajectorys/spline-trajectory';
import Trajectory from '../trajectorys/trajectory';
import Waypoint from '../waypoints/waypoint';
import Setpoint from '../setpoint/setpoint';
import PathConfig from './path-config';
import Coord from '../coord/coord';

export default class Path {
	protected _trajectory: Trajectory = {} as Trajectory;
	protected _isReverse: boolean = false;
	protected _pathConfig: PathConfig;
	protected _waypoints: Waypoint[];

	constructor(waypoints: Waypoint[], pathConfig: PathConfig) {
		this._waypoints = waypoints;
		this._pathConfig = pathConfig;
		this.generate();
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
		return this._trajectory.setpoints;
	}

	get coords(): Coord[] {
		return this._trajectory.coords;
	}

	get error() {
		return this._trajectory.error;
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
