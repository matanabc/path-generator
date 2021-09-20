import HolonomicTrajectory from '../trajectorys/holonomic-trajectory';
import HolonomicWaypoint from '../waypoints/holonomic-waypoint';
import HolonomicModifier from '../modifier/holonomic-modifier';
import Setpoint from '../motionProfiling/setpoint';
import { PathConfig } from '..';
import Path from './path';

export default class HolonomicPath extends Path {
	protected _modifier: HolonomicModifier = {} as HolonomicModifier;

	constructor(waypoints: HolonomicWaypoint[], pathConfig: PathConfig) {
		super(waypoints, pathConfig);
		if (this.isIllegal()) return;
		this._modifier = new HolonomicModifier(this.pathConfig, <HolonomicTrajectory>this._trajectory);
	}

	protected generate(): void {
		this._trajectory = new HolonomicTrajectory(this.waypoints, this.pathConfig);
	}

	get xSetpoints(): Setpoint[] {
		return this._modifier.xSetpoints || [];
	}

	get ySetpoints(): Setpoint[] {
		return this._modifier.ySetpoints || [];
	}

	get zSetpoints(): Setpoint[] {
		return this._modifier.zSetpoints || [];
	}

	get coords() {
		return this._modifier.coords || [];
	}
}
