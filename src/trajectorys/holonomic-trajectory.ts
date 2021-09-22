import HolonomicWaypoint from '../waypoints/holonomic-waypoint';
import TurnInPlaceTrajectory from './turn-in-place-trajectory';
import SplineTrajectory from './spline-trajectory';
import Setpoint from '../motionProfiling/setpoint';
import PathConfig from '../path/path-config';
import Waypoint from '../waypoints/waypoint';
import Coord from '../motionProfiling/coord';
import Trajectory from './trajectory';
import { Util } from '..';

export default class HolonomicTrajectory extends Trajectory {
	protected _turnsTrajectory: TurnInPlaceTrajectory[] = [];
	protected _splinesTrajectory: SplineTrajectory[] = [];
	protected holonomicWaypoint: HolonomicWaypoint[] = [];

	constructor(waypoints: Waypoint[], pathConfig: PathConfig) {
		super(waypoints, pathConfig);
		this.holonomicWaypoint = Util.copy(HolonomicWaypoint, this.waypoints);
		this.generateTrajectory();
	}

	protected generate(index: number): void {
		const waypoints = [this.holonomicWaypoint[index], this.holonomicWaypoint[index + 1]];
		let turnTrajectory = new TurnInPlaceTrajectory(waypoints, this.pathConfig);
		let splineTrajectory = new SplineTrajectory(waypoints, this.pathConfig);
		if (turnTrajectory.setpoints.length > 0 && splineTrajectory.setpoints.length === 0) {
			turnTrajectory.setpoints.forEach(() => splineTrajectory.setpoints.push(new Setpoint()));
			splineTrajectory.coords.push(...turnTrajectory.coords);
		} else if (turnTrajectory.setpoints.length === 0 && splineTrajectory.setpoints.length > 0)
			splineTrajectory.setpoints.forEach(() => turnTrajectory.setpoints.push(new Setpoint()));
		else if (turnTrajectory.totalTime > splineTrajectory.totalTime) {
			waypoints[0].vMax = this.getVMax(turnTrajectory.totalTime, splineTrajectory.distance);
			splineTrajectory = new SplineTrajectory(waypoints, this.pathConfig);
		} else if (turnTrajectory.totalTime < splineTrajectory.totalTime) {
			waypoints[0].vMax = this.getVMax(splineTrajectory.totalTime, turnTrajectory.distance);
			turnTrajectory = new TurnInPlaceTrajectory(waypoints, this.pathConfig);
		}
		const robotAngle = Util.angle2Distance(this.holonomicWaypoint[index].robotAngle, this.pathConfig.radios);
		turnTrajectory.setpoints.forEach((setpoint) => (setpoint.position += robotAngle));
		this._splinesTrajectory.push(splineTrajectory);
		this._turnsTrajectory.push(turnTrajectory);
	}

	protected getVMax(totalTime: number, distance: number): number {
		return (
			(-totalTime + Math.sqrt(totalTime * totalTime - (4 * Math.abs(distance)) / this.pathConfig.acc)) /
			(-2 / this.pathConfig.acc)
		);
	}

	protected getSetpoint<CoordKey extends keyof Coord>(index: number, key: CoordKey, lastVelocity: number): Setpoint {
		const setpoint = new Setpoint();
		const distance = this.coords[index][key] - this.coords[index - 1][key];
		setpoint.position = this.coords[index][key];
		setpoint.velocity = distance / this.pathConfig.robotLoopTime;
		setpoint.acceleration = (setpoint.velocity - lastVelocity) / this.pathConfig.robotLoopTime;
		return setpoint;
	}

	get turnsTrajectory(): TurnInPlaceTrajectory[] {
		return this._turnsTrajectory;
	}

	get splinesTrajectory(): SplineTrajectory[] {
		return this._splinesTrajectory;
	}
}
