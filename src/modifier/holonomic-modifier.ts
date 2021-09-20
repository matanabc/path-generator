import { PathConfig } from '..';
import { distance2Angle } from '../util';
import Coord from '../motionProfiling/coord';
import Setpoint from '../motionProfiling/setpoint';
import HolonomicTrajectory from '../trajectorys/holonomic-trajectory';

export default class HolonomicModifier {
	protected _xSetpoints: Setpoint[] = [];
	protected _ySetpoints: Setpoint[] = [];
	protected _zSetpoints: Setpoint[] = [];
	protected pathConfig: PathConfig;
	protected _coords: Coord[] = [];

	constructor(pathConfig: PathConfig, trajectory: HolonomicTrajectory) {
		this.pathConfig = pathConfig;
		trajectory.splinesTrajectory.forEach((spline) => this._coords.push(...spline.coords));
		trajectory.turnsTrajectory.forEach((turn) => this._zSetpoints.push(...turn.setpoints));
		this.updateCoordAngle(0);
		this._xSetpoints.push(new Setpoint(this._coords[0].x));
		this._ySetpoints.push(new Setpoint(this._coords[0].y));
		const length = Math.min(this._zSetpoints.length, this._coords.length);
		for (let index = 1; index < length; index++) {
			this._xSetpoints.push(this.getSetpoint(index, 'x', this._xSetpoints[index - 1].velocity));
			this._ySetpoints.push(this.getSetpoint(index, 'y', this._ySetpoints[index - 1].velocity));
			this.updateCoordAngle(index);
		}
		this._zSetpoints.splice(length);
		this._coords.splice(length);
	}

	protected updateCoordAngle(index: number): void {
		const robotAngle = distance2Angle(this._zSetpoints[index].position, this.pathConfig.radios);
		this._coords[index].angle = this._zSetpoints[index].position = robotAngle;
	}

	protected getSetpoint<CoordKey extends keyof Coord>(index: number, key: CoordKey, lastVelocity: number): Setpoint {
		const setpoint = new Setpoint();
		const distance = this._coords[index][key] - this._coords[index - 1][key];
		setpoint.position = this._coords[index][key];
		setpoint.velocity = distance / this.pathConfig.robotLoopTime;
		setpoint.acceleration = (setpoint.velocity - lastVelocity) / this.pathConfig.robotLoopTime;
		return setpoint;
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

	get coords(): Coord[] {
		return this._coords;
	}
}
