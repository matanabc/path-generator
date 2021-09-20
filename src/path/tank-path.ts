import TankModifier from '../modifier/tank-modifier';
import Setpoint from '../motionProfiling/setpoint';
import Coord from '../motionProfiling/coord';
import { PathConfig, Waypoint } from '..';
import Path from './path';

export default class TankPath extends Path {
	protected _modifier: TankModifier = {} as TankModifier;
	protected _rightSetpoints: Setpoint[] = [];
	protected _leftSetpoints: Setpoint[] = [];

	constructor(waypoints: Waypoint[], pathConfig: PathConfig) {
		super(waypoints, pathConfig);
		if (this.isIllegal()) return;
		const startAngle = this.waypoints[0].angle;
		this._modifier = new TankModifier(this.sourceSetpoints, this._trajectory.coords, startAngle, this.pathConfig);
		this.isTurnInPlace() ? this._modifier.turnInPlace() : this._modifier.spline();
		this._rightSetpoints = this._modifier.rightSetpoints;
		this._leftSetpoints = this._modifier.leftSetpoints;
	}

	get leftSetpoints(): Setpoint[] {
		return this._leftSetpoints || [];
	}

	get rightSetpoints(): Setpoint[] {
		return this._rightSetpoints || [];
	}

	get coords(): Coord[] {
		return this._modifier.coords || [];
	}

	changeDirection(): void {
		if (this.isTurnInPlace()) return;
		this._isReverse = !this._isReverse;
		if (!this._isReverse) {
			this._rightSetpoints = this._modifier.rightSetpoints;
			this._leftSetpoints = this._modifier.leftSetpoints;
		} else {
			this._rightSetpoints = this._modifier.leftSetpoints;
			this._leftSetpoints = this._modifier.rightSetpoints;
		}
		for (let i = 0; i < this.sourceSetpoints.length; i++) {
			this.sourceSetpoints[i].changeDirection();
			this._rightSetpoints[i].changeDirection();
			this._leftSetpoints[i].changeDirection();
		}
	}
}
