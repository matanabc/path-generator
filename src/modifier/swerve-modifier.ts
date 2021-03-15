import PathConfig from '../path/path-config';
import Setpoint from '../setpoint/setpoint';
import Coord from '../coord/coord';
import * as Util from '../util';
export default class SwerveModifier {
	protected _xSetpoints: Setpoint[] = [];
	protected _ySetpoints: Setpoint[] = [];
	protected _zSetpoints: Setpoint[] = [];
	protected _pathConfig: PathConfig;
	protected _coords: Coord[] = [];
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

	constructor(source: Setpoint[], coords: Coord[], pathConfig: PathConfig) {
		this._pathConfig = pathConfig;
		this._source = source;
		this._coords = coords;
		this.modify();
	}

	protected modify(): void {
		for (let i = 0; i < this._coords.length; i++) {
			if (i > 0) this.calculateSetpoint(i);
			else {
				this._xSetpoints.push(Object.assign(new Setpoint(), { position: this._coords[0].x }));
				this._ySetpoints.push(Object.assign(new Setpoint(), { position: this._coords[0].y }));
			}
		}
	}

	protected calculateSetpoint(index: number) {
		const xSetpoint = new Setpoint();
		const ySetpoint = new Setpoint();
		const zSetpoint = new Setpoint();
		const distanceX = this._coords[index].x - this._coords[index - 1].x;
		const distanceY = this._coords[index].y - this._coords[index - 1].y;
		xSetpoint.position = this._coords[index].x;
		ySetpoint.position = this._coords[index].y;
		xSetpoint.velocity = distanceX / this._pathConfig.robotLoopTime;
		ySetpoint.velocity = distanceY / this._pathConfig.robotLoopTime;
		xSetpoint.acceleration =
			(xSetpoint.velocity - this._xSetpoints[index - 1].velocity) / this._pathConfig.robotLoopTime;
		ySetpoint.acceleration =
			(ySetpoint.velocity - this._ySetpoints[index - 1].velocity) / this._pathConfig.robotLoopTime;
		this._xSetpoints.push(xSetpoint);
		this._ySetpoints.push(ySetpoint);
	}
}
