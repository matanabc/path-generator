import TurnInPlaceGenerator from '../generator/turn-in-place-generator';
import PathGenerator from '../generator/path-generator';
import Waypoint from '../waypoints/waypoint';
import Setpoint from '../setpoint/setpoint';
import PathConfig from './path-config';
import Coord from '../coord/coord';

export default class Path {
	protected _generator: PathGenerator = {} as PathGenerator;
	protected _turnInPlaceAngle: number = 0;
	protected _pathConfig: PathConfig;
	protected _waypoints: Waypoint[];

	constructor(waypoints: Waypoint[], pathConfig: PathConfig) {
		this._waypoints = waypoints;
		this._pathConfig = pathConfig;
		this.generate();
	}

	protected generate(): void {
		if (TurnInPlaceGenerator.isTurnInPlace(this.waypoints)) {
			this._generator = new TurnInPlaceGenerator(this.waypoints, this.pathConfig);
			this._turnInPlaceAngle = (<TurnInPlaceGenerator>this._generator).turnAngle;
		} else this._generator = new PathGenerator(this.waypoints, this.pathConfig);
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
