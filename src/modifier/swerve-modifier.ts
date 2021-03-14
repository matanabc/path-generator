import SwerveCoord from '../coord/swerve-coord';
import PathConfig from '../path/path-config';
import Setpoint from '../setpoint/setpoint';
import * as Util from '../util';
export default class SwerveModifier {
	protected _xSetpoints: Setpoint[] = [];
	protected _ySetpoints: Setpoint[] = [];
	protected _zSetpoints: Setpoint[] = [];
	protected _coords: SwerveCoord[] = [];
	protected _pathConfig: PathConfig;
	protected _source: Setpoint[];

	get xSetpoints(): Setpoint[] {
		return this._xSetpoints;
	}

	get ySetpoints(): Setpoint[] {
		return this._ySetpoints;
	}

	get zSetpoints(): Setpoint[] {
		return this._zSetpoints;
	}

	constructor(source: Setpoint[], coords: SwerveCoord[], pathConfig: PathConfig) {
		this._pathConfig = pathConfig;
		this._source = source;
		this._coords = coords;
		this.modify();
	}

	protected modify(): void {
		for (let i = 0; i < this._coords.length; i++) {
			const ratio = this.getRatio(this._coords[i]);
			if (i > 0) this.calculateSetpoint(i, ratio);
			else {
				this._zSetpoints.push(Object.assign(new Setpoint(), { position: this.getAngle(0, ratio) }));
				this._xSetpoints.push(Object.assign(new Setpoint(), { position: this._coords[0].x }));
				this._ySetpoints.push(Object.assign(new Setpoint(), { position: this._coords[0].y }));
			}
		}
	}

	protected getRatio(coord: SwerveCoord): number {
		return coord.radios === 0 ? 0 : this._pathConfig.width / coord.radios;
	}

	protected getAngle(index: number, ratio: number): number {
		const position = this._source[index].position;
		return Util.r2d((ratio * position) / this._pathConfig.width);
	}

	protected calculateSetpoint(index: number, ratio: number) {
		const xSetpoint = new Setpoint();
		const ySetpoint = new Setpoint();
		const zSetpoint = new Setpoint();
		const distanceX = this._coords[index].x - this._coords[index - 1].x;
		const distanceY = this._coords[index].y - this._coords[index - 1].y;
		const distanceZ = (this._source[index].position - this._source[index - 1].position) * ratio;
		xSetpoint.position = this._coords[index].x;
		ySetpoint.position = this._coords[index].y;
		zSetpoint.position = this.getAngle(index, ratio);
		xSetpoint.velocity = distanceX / this._pathConfig.robotLoopTime;
		ySetpoint.velocity = distanceY / this._pathConfig.robotLoopTime;
		zSetpoint.velocity = distanceZ / this._pathConfig.robotLoopTime;
		xSetpoint.acceleration =
			(xSetpoint.velocity - this._xSetpoints[index - 1].velocity) / this._pathConfig.robotLoopTime;
		ySetpoint.acceleration =
			(ySetpoint.velocity - this._ySetpoints[index - 1].velocity) / this._pathConfig.robotLoopTime;
		zSetpoint.acceleration =
			(zSetpoint.velocity - this._zSetpoints[index - 1].velocity) / this._pathConfig.robotLoopTime;
		this._xSetpoints.push(xSetpoint);
		this._ySetpoints.push(ySetpoint);
		this._zSetpoints.push(zSetpoint);
	}
}
