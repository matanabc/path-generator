import IModifier from './modifier/imodifier';
import PathConfig from './path-config';
import Generator from './generator';
import Waypoints from './waypoint';
import Setpoint from './setpoint';

export default class Path<T> {
	private generator: Generator;
	private waypoints: Waypoints[];
	private pathConfig: PathConfig;
	private modifierSetpoints: T;

	constructor(waypoints: Waypoints[], pathConfig: PathConfig, modifier?: new () => IModifier<T>) {
		this.waypoints = waypoints;
		this.pathConfig = pathConfig;
		this.generator = new Generator(this.waypoints, this.pathConfig);
		if (modifier !== undefined && this.generator.getError() === undefined)
			this.modifierSetpoints = new modifier().modify(
				this.generator.getSourceSetpoint(),
				this.pathConfig
			);
		else this.modifierSetpoints = {} as T;
	}

	getModifierSetpoints(): T {
		return this.modifierSetpoints;
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
