import IModifier from './modifier/imodifier';
import PathConfig from './path-config';
import Generator from './generator';
import Waypoints from './waypoint';
import Setpoint from './setpoint';

export default class Path {
	private generator: Generator;
	private waypoints: Waypoints[];
	private pathConfig: PathConfig;
	private modifierSetpoints: any = undefined;

	constructor(waypoints: Waypoints[], pathConfig: PathConfig, modifier?: new () => IModifier) {
		this.waypoints = waypoints;
		this.pathConfig = pathConfig;
		this.generator = new Generator(this.waypoints, this.pathConfig);
		if (modifier !== undefined && this.generator.isIllegal() === undefined)
			this.modifierSetpoints = new modifier().modify(
				this.generator.getSourceSetpoint(),
				this.pathConfig
			);
	}

	identity<T>(arg: T): T {
		return arg;
	}

	getModifierSetpoints(): any {
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

	isIllegal(): any | undefined {
		return this.generator.isIllegal();
	}
}
