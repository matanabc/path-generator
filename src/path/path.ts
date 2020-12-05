import { PathGenerator, TurnInPlaceGenerator } from '../generator/generate';
import PathConfig from '../path_config/path-config';
import Waypoint from '../waypoints/waypoint';
import Setpoint from '../setpoint';
import Coord from '../coord';

export default class Path {
	protected generator: PathGenerator = {} as PathGenerator;
	protected waypoints: Waypoint[];
	protected pathConfig: PathConfig;

	constructor(waypoints: Waypoint[], pathConfig: PathConfig) {
		this.waypoints = waypoints;
		this.pathConfig = pathConfig;
		this.generate();
	}

	protected generate(): void {
		if (TurnInPlaceGenerator.isTurnInPlace(this.waypoints))
			this.generator = new TurnInPlaceGenerator(this.waypoints, this.pathConfig);
		else this.generator = new PathGenerator(this.waypoints, this.pathConfig);
	}

	getWaypoints(): Waypoint[] {
		return this.waypoints;
	}

	getPathConfig(): PathConfig {
		return this.pathConfig;
	}

	getSourceSetpoints(): Setpoint[] {
		return this.generator.getSetpoint();
	}

	getRobotCoords(): Coord[] {
		return this.generator.getCoords();
	}

	isIllegal(): boolean {
		return this.generator.getError() !== undefined;
	}

	getError() {
		return this.generator.getError();
	}
}
