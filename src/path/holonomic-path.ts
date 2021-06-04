import TurnInPlaceTrajectory from '../trajectorys/turn-in-place-trajectory';
import HolonomicTrajectory from '../trajectorys/holonomic-trajectory';
import HolonomicWaypoint from '../waypoints/holonomic-waypoint';
import Setpoint from '../motionProfiling/setpoint';
import { PathConfig } from '..';
import Path from './path';

export default class HolonomicPath extends Path {
	protected _xSetpoints: Setpoint[] = [];
	protected _ySetpoints: Setpoint[] = [];
	protected _zSetpoints: Setpoint[] = [];

	constructor(waypoints: HolonomicWaypoint[], pathConfig: PathConfig) {
		super(waypoints, pathConfig);
		this.setSetpoints();
	}

	protected generate(): void {
		if (TurnInPlaceTrajectory.isTurnInPlace(this.waypoints))
			this._trajectory = new TurnInPlaceTrajectory(this.waypoints, this.pathConfig);
		else this._trajectory = new HolonomicTrajectory(this.waypoints, this.pathConfig);
	}

	protected setSetpoints() {
		if (this.isIllegal()) return;
		else if (this.isTurnInPlace()) {
			this._zSetpoints = this._trajectory.setpoints;
			const setpoints = this.zSetpoints.map(() => new Setpoint());
			this._xSetpoints = setpoints;
			this._ySetpoints = setpoints;
		} else {
			const trajectory = <HolonomicTrajectory>this._trajectory;
			this._xSetpoints = trajectory.xSetpoints;
			this._ySetpoints = trajectory.ySetpoints;
			this._zSetpoints = trajectory.zSetpoints;
		}
	}

	get xSetpoints(): Setpoint[] {
		return this._xSetpoints;
	}

	get ySetpoints(): Setpoint[] {
		return this._ySetpoints;
	}

	get zSetpoints(): Setpoint[] {
		return this._zSetpoints;
	}

	get coords() {
		return this._trajectory.coords;
	}
}
