import PathConfig from '../path_config/path-config';
import Setpoint from '../setpoint';
import Coord from '../coord';

export default class TankModifier {
	protected _leftSetpoints: Setpoint[] = [];
	protected _rightSetpoints: Setpoint[] = [];
	protected _leftCoords: Coord[] = [];
	protected _rightCoords: Coord[] = [];

	constructor(sourceSetpoints: Setpoint[], coords: Coord[], pathConfig: PathConfig) {
		this.modify(sourceSetpoints, coords, pathConfig);
	}

	get leftSetpoints(): Setpoint[] {
		return this._rightSetpoints;
	}

	get rightSetpoints(): Setpoint[] {
		return this._leftSetpoints;
	}

	protected modify(sourceSetpoints: Setpoint[], coords: Coord[], pathConfig: PathConfig): void {
		const robotWidth = pathConfig.width / 2;
		for (let i = 0; i < sourceSetpoints.length; i++) {
			this._leftSetpoints.push(new Setpoint(sourceSetpoints[i]));
			this._rightSetpoints.push(new Setpoint(sourceSetpoints[i]));
			this._leftCoords.push(this.getCoord(coords[i], robotWidth));
			this._rightCoords.push(this.getCoord(coords[i], -robotWidth));
			if (i > 0) {
				this.calculateSetpoint(this._leftSetpoints, this._leftCoords, i, pathConfig);
				this.calculateSetpoint(this._rightSetpoints, this._rightCoords, i, pathConfig);
			}
		}
	}

	protected getCoord(coord: Coord, robotWidth: number): Coord {
		const cos_angle = Math.cos(coord.angle);
		const sin_angle = Math.sin(coord.angle);
		return new Coord(
			coord.x - robotWidth * sin_angle,
			coord.y + robotWidth * cos_angle,
			coord.angle
		);
	}

	protected calculateSetpoint(
		setpoints: Setpoint[],
		coords: Coord[],
		index: number,
		pathConfig: PathConfig
	): void {
		const setpoint = setpoints[index];
		const coord = coords[index];
		const lastSetpoint = setpoints[index - 1];
		const lastCoord = coords[index - 1];
		const distance = Math.sqrt(
			(coord.x - lastCoord.x) * (coord.x - lastCoord.x) +
				(coord.y - lastCoord.y) * (coord.y - lastCoord.y)
		);
		setpoint.position = lastSetpoint.position + distance;
		setpoint.velocity = distance / pathConfig.robotLoopTime;
		const acc = (setpoint.velocity - lastSetpoint.velocity) / pathConfig.robotLoopTime;
		setpoint.acceleration = Math.abs(acc) > 0 ? (acc / Math.abs(acc)) * pathConfig.acc : 0;
	}
}
