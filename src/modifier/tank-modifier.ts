import Setpoint from '../motionProfiling/setpoint';
import PathConfig from '../path/path-config';
import Coord from '../motionProfiling/coord';
import { r2d } from '../util';

export default class TankModifier {
	protected _rightSetpoints: Setpoint[] = [];
	protected _leftSetpoints: Setpoint[] = [];
	protected _rightCoords: Coord[] = [];
	protected _leftCoords: Coord[] = [];
	protected source: Setpoint[] = [];
	protected _coords: Coord[] = [];
	protected startAngle = 0;
	protected pathConfig;

	get leftSetpoints(): Setpoint[] {
		return this._rightSetpoints;
	}

	get rightSetpoints(): Setpoint[] {
		return this._leftSetpoints;
	}

	get coords(): Coord[] {
		return this._coords;
	}

	constructor(source: Setpoint[], coords: Coord[], startAngle: number, pathConfig: PathConfig) {
		this.source = source;
		this._coords = coords;
		this.startAngle = startAngle;
		this.pathConfig = pathConfig;
	}

	public turnInPlace(): void {
		this.source.forEach((setpoint, index) => {
			this._rightSetpoints.push(Object.assign(new Setpoint(), setpoint));
			this._leftSetpoints.push(Object.assign(new Setpoint(), setpoint));
			this._leftSetpoints[index].changeDirection();
		});
		this.updateCoordsAngle();
	}

	public spline(): void {
		const robotWidth = this.pathConfig.radios / 2;
		this.source.forEach((setpoint, index) => {
			this._leftSetpoints.push(Object.assign(new Setpoint(), setpoint));
			this._rightSetpoints.push(Object.assign(new Setpoint(), setpoint));
			this._leftCoords.push(this.getCoord(this._coords[index], robotWidth));
			this._rightCoords.push(this.getCoord(this._coords[index], -robotWidth));
			if (index > 0) {
				this.calculateSetpoint(this._leftSetpoints, this._leftCoords, index);
				this.calculateSetpoint(this._rightSetpoints, this._rightCoords, index);
			}
		});
		this.updateCoordsAngle();
	}

	protected getCoord(coord: Coord, robotWidth: number): Coord {
		const cos_angle = Math.cos(coord.angle);
		const sin_angle = Math.sin(coord.angle);
		return new Coord(coord.x - robotWidth * sin_angle, coord.y + robotWidth * cos_angle, coord.angle);
	}

	protected calculateSetpoint(setpoints: Setpoint[], coords: Coord[], index: number): void {
		const setpoint = setpoints[index];
		const coord = coords[index];
		const lastSetpoint = setpoints[index - 1];
		const lastCoord = coords[index - 1];
		const distance = Math.sqrt(
			(coord.x - lastCoord.x) * (coord.x - lastCoord.x) + (coord.y - lastCoord.y) * (coord.y - lastCoord.y)
		);
		setpoint.position = lastSetpoint.position + distance;
		setpoint.velocity = distance / this.pathConfig.robotLoopTime;
		setpoint.acceleration = (setpoint.velocity - lastSetpoint.velocity) / this.pathConfig.robotLoopTime;
	}

	protected updateCoordsAngle(): void {
		this._coords.forEach((coord, index) => {
			const distance = this.leftSetpoints[index].position - this.rightSetpoints[index].position;
			coord.angle = this.startAngle + r2d(distance / this.pathConfig.radios);
		});
	}
}
