import TurnInPlaceGenerator from '../generator/turn-in-place-generator';
import PathGenerator from '../generator/path-generator';
import Waypoint from '../waypoints/waypoint';
import Setpoint from '../setpoint/setpoint';
import PathConfig from './path-config';
import Coord from '../coord/coord';

export default class Path {
	protected _generator: PathGenerator = {} as PathGenerator;
	protected _turnInPlaceAngle: number = 0;
	protected _isReverse: boolean = false;
	protected _pathConfig: PathConfig;
	protected _waypoints: Waypoint[];

	constructor(waypoints: Waypoint[], pathConfig: PathConfig) {
		this._waypoints = waypoints;
		this._pathConfig = pathConfig;
		this.generate();
	}

	protected generate(): void {
		if (TurnInPlaceGenerator.isTurnInPlace(this.waypoints)) {
			this._generator = this.generateTurnInPlacePath();
			this._turnInPlaceAngle = (<TurnInPlaceGenerator>this._generator).turnAngle;
		} else this._generator = this.generatePath();
	}

	protected generatePath(): PathGenerator {
		return new PathGenerator(this.waypoints, this.pathConfig);
	}

	protected generateTurnInPlacePath(): PathGenerator {
		return new TurnInPlaceGenerator(this.waypoints, this.pathConfig);
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

	isTurnInPlace(): boolean {
		return this._turnInPlaceAngle !== 0;
	}

	isReverse(): boolean {
		return this._isReverse;
	}

	changeDirection(): void {
		if (TurnInPlaceGenerator.isTurnInPlace(this.waypoints)) return;
		this._isReverse = !this._isReverse;
		for (let i = 0; i < this.sourceSetpoints.length; i++) this.sourceSetpoints[i].changeDirection();
	}
}
