import PathConfig from '../path/path-config';
import Setpoint from '../setpoint/setpoint';
import Coord from '../coord/coord';

export default class TankModifier {
	protected _leftSetpoints: Setpoint[] = [];
	protected _rightSetpoints: Setpoint[] = [];
	protected _leftCoords: Coord[] = [];
	protected _rightCoords: Coord[] = [];

	constructor(source: Setpoint[], coords: Coord[], pathConfig: PathConfig, turnInPlaceAngle: number) {
		if (turnInPlaceAngle === 0) this.modify(source, coords, pathConfig);
		else this.turnInPlaceModify(source, turnInPlaceAngle);
	}

	get leftSetpoints(): Setpoint[] {
		return this._rightSetpoints;
	}

	get rightSetpoints(): Setpoint[] {
		return this._leftSetpoints;
	}

	protected turnInPlaceModify(source: Setpoint[], turnInPlaceAngle: number): void {
		const scale = turnInPlaceAngle > 0 ? 1 : -1;
		for (let i = 0; i < source.length; i++) {
			this._rightSetpoints.push(Object.assign(new Setpoint(), source[i]));
			this._leftSetpoints.push(Object.assign(new Setpoint(), source[i]));
			this.scale(this._rightSetpoints[i], scale);
			this.scale(this._leftSetpoints[i], -scale);
		}
	}

	protected scale(source: Setpoint, scale: number): void {
		source.acceleration *= scale;
		source.position *= scale;
		source.velocity *= scale;
	}

	protected modify(source: Setpoint[], coords: Coord[], pathConfig: PathConfig): void {
		const robotWidth = pathConfig.radios / 2;
		for (let i = 0; i < source.length; i++) {
			this._leftSetpoints.push(Object.assign(new Setpoint(), source[i]));
			this._rightSetpoints.push(Object.assign(new Setpoint(), source[i]));
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
		return new Coord(coord.x - robotWidth * sin_angle, coord.y + robotWidth * cos_angle, coord.angle);
	}

	protected calculateSetpoint(setpoints: Setpoint[], coords: Coord[], index: number, pathConfig: PathConfig): void {
		const setpoint = setpoints[index];
		const coord = coords[index];
		const lastSetpoint = setpoints[index - 1];
		const lastCoord = coords[index - 1];
		const distance = Math.sqrt(
			(coord.x - lastCoord.x) * (coord.x - lastCoord.x) + (coord.y - lastCoord.y) * (coord.y - lastCoord.y)
		);
		setpoint.position = lastSetpoint.position + distance;
		setpoint.velocity = distance / pathConfig.robotLoopTime;
		setpoint.acceleration = (setpoint.velocity - lastSetpoint.velocity) / pathConfig.robotLoopTime;
	}
}
