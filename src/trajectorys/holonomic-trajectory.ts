import { RobotAngleIsUndefined } from '../motionProfiling/errors';
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
	protected _xSetpoints: Setpoint[] = [];
	protected _ySetpoints: Setpoint[] = [];
	protected _zSetpoints: Setpoint[] = [];

	constructor(waypoints: Waypoint[], pathConfig: PathConfig) {
		super(waypoints, pathConfig);
		this.generateHolonomicTrajectory();
	}

	protected generate() {}

	protected generateHolonomicTrajectory(): void {
		for (let index = 0; index < this.waypoints.length - 1; index++) {
			const waypoints = [this.waypoints[index], this.waypoints[index + 1]];
			const splineTrajectory = new SplineTrajectory(waypoints, this.pathConfig, index);
			this.setpoints.push(...splineTrajectory.setpoints);
			this.setZSetpoints(splineTrajectory, index);
		}
		this.setXYSetpoints();
	}

	protected setXYSetpoints(): void {
		this._xSetpoints.push(new Setpoint());
		this._ySetpoints.push(new Setpoint());
		for (let i = 1; i < this.setpoints.length; i++) {
			this._xSetpoints.push(this.getSetpoint(i, 'x', this._xSetpoints[i - 1].velocity));
			this._ySetpoints.push(this.getSetpoint(i, 'y', this._ySetpoints[i - 1].velocity));
		}
	}

	protected setZSetpoints(trajectory: SplineTrajectory, index: number) {
		const setpoints = [];
		const startRobotAngle = (<HolonomicWaypoint>this.waypoints[index]).robotAngle;
		const endRobotAngle = (<HolonomicWaypoint>this.waypoints[index + 1]).robotAngle;
		if (startRobotAngle === undefined || endRobotAngle === undefined) throw new RobotAngleIsUndefined();
		const distance = Util.angle2Distance(endRobotAngle - startRobotAngle, this.pathConfig.radios);
		const vMax = this.getVMax(trajectory.totalTime, distance);
		const waypoints = [this.waypoints[index], this.waypoints[index + 1]];
		setpoints.push(...new TurnInPlaceTrajectory(waypoints, this.pathConfig, vMax, index).setpoints);
		if (setpoints.length === 0) trajectory.setpoints.forEach(() => setpoints.push(new Setpoint()));
		this.setCoords(trajectory.coords, setpoints, (<HolonomicWaypoint>this.waypoints[index]).robotAngle);
		this._zSetpoints.push(...setpoints);
	}

	protected setCoords(coords: Coord[], setpoints: Setpoint[], lastAngle: number): void {
		coords.forEach((coord, index) => {
			const position = setpoints[index].position;
			coord.angle = Util.d2r(Util.distance2Angle(position, this.pathConfig.radios) + lastAngle);
		});
		this._coords.push(...coords);
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

	get xSetpoints(): Setpoint[] {
		return this._xSetpoints;
	}

	get ySetpoints(): Setpoint[] {
		return this._ySetpoints;
	}

	get zSetpoints(): Setpoint[] {
		return this._zSetpoints;
	}
}
