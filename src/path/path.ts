import { PathGenerator, TurnInPlaceGenerator } from '../generator/generate';
import Waypoint from '../waypoints/waypoint';
import PathConfig from './path-config';
import Setpoint from '../setpoint';
import Coord from '../coord';

export default class Path {
	protected _generator: PathGenerator = {} as PathGenerator;
	protected _waypoints: Waypoint[];
	protected _pathConfig: PathConfig;

	constructor(waypoints: Waypoint[], pathConfig: PathConfig) {
		this._waypoints = waypoints;
		this._pathConfig = pathConfig;
		this.generate();
	}

	protected generate(): void {
		if (TurnInPlaceGenerator.isTurnInPlace(this.waypoints))
			this._generator = new TurnInPlaceGenerator(this.waypoints, this.pathConfig);
		else this._generator = new PathGenerator(this.waypoints, this.pathConfig);
	}

	get waypoints(): Waypoint[] {
		return this._waypoints;
	}

	get pathConfig(): PathConfig {
		return this._pathConfig;
	}

	get sourceSetpoints(): Setpoint[] {
		return this._generator.getSetpoint();
	}

	get coords(): Coord[] {
		return this._generator.getCoords();
	}

	get error() {
		return this._generator.getError();
	}

	isIllegal(): boolean {
		return this._generator.getError() !== undefined;
	}
}
