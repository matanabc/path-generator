import TurnInPlaceTrajectory from '../trajectorys/turn-in-place-trajectory';
import TankModifier from '../modifier/tank-modifier';
import Setpoint from '../motionProfiling/setpoint';
import { PathConfig, Waypoint } from '..';
import Path from './path';

export default class TankPath extends Path {
	protected _modifier: TankModifier = {} as TankModifier;
	protected _rightSetpoints: Setpoint[] = [];
	protected _leftSetpoints: Setpoint[] = [];

	constructor(waypoints: Waypoint[], pathConfig: PathConfig) {
		super(waypoints, pathConfig);
		this.modify();
	}

	protected modify(): void {
		const turnAngle = this.isTurnInPlace() ? (<TurnInPlaceTrajectory>(<unknown>this._trajectory)).turnAngle : 0;
		this._modifier = new TankModifier(this.sourceSetpoints, this.coords, this.pathConfig, turnAngle);
		this._rightSetpoints = this._modifier.rightSetpoints;
		this._leftSetpoints = this._modifier.leftSetpoints;
	}

	get leftSetpoints(): Setpoint[] {
		return this._leftSetpoints;
	}

	get rightSetpoints(): Setpoint[] {
		return this._rightSetpoints;
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
