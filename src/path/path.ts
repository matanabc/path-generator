import PathConfig from '../path_config/path-config';
import Generator from '../generate/generator';
import Waypoints from '../waypoints/waypoint';
import Setpoint from '../setpoint';
import IPath from './ipath';

export default class Path implements IPath {
	protected generator: Generator = {} as Generator;
	protected waypoints: Waypoints[];
	protected pathConfig: PathConfig;

	constructor(waypoints: Waypoints[], pathConfig: PathConfig) {
		this.waypoints = waypoints;
		this.pathConfig = pathConfig;
		this.generate();
	}

	protected generate(): void {
		this.generator = new Generator(this.waypoints, this.pathConfig);
	}

	getWaypoints(): Waypoints[] {
		return this.waypoints;
	}

	getPathConfig(): PathConfig {
		return this.pathConfig;
	}

	getSourceSetpoints(): Setpoint[] {
		return this.generator.getSourceSetpoint();
	}

	isIllegal(): boolean {
		return this.generator.getError() !== undefined;
	}

	getError() {
		return this.generator.getError();
	}
}
