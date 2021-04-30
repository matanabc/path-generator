import TurnInPlaceTrajectory from './turn-in-place-trajectory';
import { PathConfig, Util, Waypoint } from '..';
import LineTrajectory from './line-trajectory';
import Setpoint from '../setpoint/setpoint';
import Trajectory from './trajectory';
import Coord from '../coord/coord';

export default class SwerveTrajectory extends Trajectory {
	protected _zTrajectory: TurnInPlaceTrajectory[] = [];
	protected _xTrajectory: LineTrajectory[] = [];
	protected _yTrajectory: LineTrajectory[] = [];
	protected _zSetpoints: Setpoint[] = [];
	protected _xSetpoints: Setpoint[] = [];
	protected _ySetpoints: Setpoint[] = [];
	protected _coords: Coord[] = [];

	constructor(waypoints: Waypoint[], pathConfig: PathConfig) {
		super(waypoints, pathConfig);
		this.generateTrajectory();
		this.calculateSetpoints();
		this.calculateCoords();
	}

	protected generate(): void {}

	protected generateTrajectory(): void {
		for (let i = 0; i < this.waypoints.length - 1; i++) {
			let xLine = this.getXLine(i);
			let yLine = this.getYLine(i);
			let zLine = this.getZLine(i);
			const maxTime = Math.max(xLine.totalTime, yLine.totalTime, zLine.totalTime);
			xLine = this.getXLine(i, this.getVMax(maxTime, xLine.distance));
			yLine = this.getYLine(i, this.getVMax(maxTime, yLine.distance));
			zLine = this.getZLine(i, this.getVMax(maxTime, zLine.distance));
			this.fixTrajectory(xLine, maxTime);
			this.fixTrajectory(yLine, maxTime);
			this.fixTrajectory(zLine, maxTime);
			if (xLine.error) this.error = xLine.error;
			else if (yLine.error) this.error = yLine.error;
			else if (zLine.error) this.error = zLine.error;
			if (this.error) return;
			this._xTrajectory.push(xLine);
			this._yTrajectory.push(yLine);
			this._zTrajectory.push(zLine);
		}
	}

	protected calculateSetpoints(): void {
		this._xTrajectory.forEach((trajectory) => this.xSetpoints.push(...trajectory.setpoints));
		this._yTrajectory.forEach((trajectory) => this.ySetpoints.push(...trajectory.setpoints));
		this._zTrajectory.forEach((trajectory) => this.zSetpoints.push(...trajectory.setpoints));
	}

	protected calculateCoords(): void {
		for (let i = 0; i < this.xSetpoints.length; i++) {
			const angle = this.zSetpoints[i] ? this.zSetpoints[i].position : 0;
			this._coords.push(
				new Coord(
					this.xSetpoints[i] ? this.xSetpoints[i].position : 0,
					this.ySetpoints[i] ? this.ySetpoints[i].position : 0,
					Util.d2r(Util.distance2Angle(angle, this.pathConfig.radios))
				)
			);
		}
	}

	protected fixTrajectory(trajectory: LineTrajectory, totalTime: number) {
		if (trajectory.distance > 0) return;
		for (let i = 0; i < Number(totalTime.toFixed(3)) / this.pathConfig.robotLoopTime; i++) {
			trajectory.setpoints.push(new Setpoint());
			trajectory.coords.push(new Coord(0, 0, 0));
			trajectory.error = undefined;
		}
	}

	protected getVMax(totalTime: number, distance: number): number {
		return (
			(-totalTime + Math.sqrt(totalTime * totalTime - (4 * Math.abs(distance)) / this.pathConfig.acc)) /
			(-2 / this.pathConfig.acc)
		);
	}

	protected getXLine(index: number, vMax: number = this.waypoints[index].vMax): LineTrajectory {
		const startWaypoint = Object.assign(new Waypoint(), {
			v: this.waypoints[index].v * Math.cos(Util.d2r(this.waypoints[index].angle)),
			x: this.waypoints[index].x,
			vMax: vMax,
		});
		const endWaypoint = Object.assign(new Waypoint(), {
			v: this.waypoints[index + 1].v * Math.cos(Util.d2r(this.waypoints[index + 1].angle)),
			x: this.waypoints[index + 1].x,
			vMax: vMax,
		});
		return new LineTrajectory([startWaypoint, endWaypoint], this.pathConfig);
	}

	protected getYLine(index: number, vMax: number = this.waypoints[index].vMax): LineTrajectory {
		const startWaypoint = Object.assign(new Waypoint(), {
			v: this.waypoints[index].v * Math.sin(Util.d2r(this.waypoints[index].angle)),
			x: this.waypoints[index].y,
			vMax: vMax,
		});
		const endWaypoint = Object.assign(new Waypoint(), {
			v: this.waypoints[index + 1].v * Math.sin(Util.d2r(this.waypoints[index + 1].angle)),
			x: this.waypoints[index + 1].y,
			vMax: vMax,
		});
		return new LineTrajectory([startWaypoint, endWaypoint], this.pathConfig);
	}

	protected getZLine(index: number, vMax: number = this.waypoints[index].vMax): TurnInPlaceTrajectory {
		const waypoints = [this.waypoints[index], this.waypoints[index + 1]];
		const trajectory = new TurnInPlaceTrajectory(waypoints, this.pathConfig, vMax);
		if (trajectory.turnAngle < 0) trajectory.setpoints.forEach((setpoint) => setpoint.changeDirection());
		return trajectory;
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
