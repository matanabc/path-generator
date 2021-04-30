import TurnInPlaceTrajectory from '../trajectorys/turn-in-place-trajectory';
import LineTrajectory from '../trajectorys/line-trajectory';
import SwerveWaypoint from '../waypoints/swerve-waypoint';
import Setpoint from '../setpoint/setpoint';
import { PathConfig, Waypoint } from '..';
import Coord from '../coord/coord';

export default class SwervePath {
	protected _zTrajectory: TurnInPlaceTrajectory[] = [];
	protected _xTrajectory: LineTrajectory[] = [];
	protected _yTrajectory: LineTrajectory[] = [];
	protected _pathConfig: PathConfig;
	protected _waypoints: Waypoint[];

	constructor(waypoints: SwerveWaypoint[], pathConfig: PathConfig) {
		this._pathConfig = pathConfig;
		this._waypoints = waypoints;
		this.generate();
	}

	protected generate(): void {
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
			if (xLine.error) return;
			if (yLine.error) return;
			if (zLine.error) return;
			this._xTrajectory.push(xLine);
			this._yTrajectory.push(yLine);
			this._zTrajectory.push(zLine);
		}
	}

	protected fixTrajectory(trajectory: LineTrajectory, totalTime: number) {
		if (trajectory.distance > 0) return;
		for (let i = 0; i < totalTime / this.pathConfig.robotLoopTime; i++) {
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
			x: this.waypoints[index].x,
			v: this.waypoints[index].v,
			vMax: vMax,
		});
		const endWaypoint = Object.assign(new Waypoint(), {
			x: this.waypoints[index + 1].x,
			v: this.waypoints[index + 1].v,
			vMax: vMax,
		});
		return new LineTrajectory([startWaypoint, endWaypoint], this.pathConfig);
	}

	protected getYLine(index: number, vMax: number = this.waypoints[index].vMax): LineTrajectory {
		const startWaypoint = Object.assign(new Waypoint(), {
			x: this.waypoints[index].y,
			v: this.waypoints[index].v,
			vMax: vMax,
		});
		const endWaypoint = Object.assign(new Waypoint(), {
			x: this.waypoints[index + 1].y,
			v: this.waypoints[index + 1].v,
			vMax: vMax,
		});
		return new LineTrajectory([startWaypoint, endWaypoint], this.pathConfig);
	}

	protected getZLine(index: number, vMax: number = this.waypoints[index].vMax): TurnInPlaceTrajectory {
		return new TurnInPlaceTrajectory([this.waypoints[index], this.waypoints[index + 1]], this.pathConfig, vMax);
	}

	get waypoints(): Waypoint[] {
		return this._waypoints;
	}

	get pathConfig(): PathConfig {
		return this._pathConfig;
	}

	get xSetpoints(): Setpoint[] {
		const setpoints: Setpoint[] = [];
		this._xTrajectory.forEach((trajectory) => setpoints.push(...trajectory.setpoints));
		return setpoints;
	}

	get ySetpoints(): Setpoint[] {
		const setpoints: Setpoint[] = [];
		this._yTrajectory.forEach((trajectory) => setpoints.push(...trajectory.setpoints));
		return setpoints;
	}

	get zSetpoints(): Setpoint[] {
		const setpoints: Setpoint[] = [];
		this._zTrajectory.forEach((trajectory) => setpoints.push(...trajectory.setpoints));
		return setpoints;
	}
}
