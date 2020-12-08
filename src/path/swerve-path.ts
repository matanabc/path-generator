import { SwervePathGenerator, TurnInPlaceGenerator } from '../generator/generate';
import Waypoint from '../waypoints/waypoint';
import PathConfig from './path-config';
import Path from './path';

export default class SwervePath extends Path {
	constructor(waypoints: Waypoint[], pathConfig: PathConfig) {
		super(waypoints, pathConfig);
	}

	protected generate(): void {
		if (TurnInPlaceGenerator.isTurnInPlace(this.waypoints))
			this._generator = new TurnInPlaceGenerator(this.waypoints, this.pathConfig);
		else this._generator = new SwervePathGenerator(this.waypoints, this.pathConfig);
	}
}
