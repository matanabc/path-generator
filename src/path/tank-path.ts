import { Setpoint } from '..';
import TankModifier from '../modifier/tank-modifier';
import PathConfig from '../path_config/path-config';
import Waypoint from '../waypoints/waypoint';
import Path from './path';

export default class TankPath extends Path {
	protected tankModifier: TankModifier = {} as TankModifier;

	constructor(waypoints: Waypoint[], pathConfig: PathConfig) {
		super(waypoints, pathConfig);
	}

	protected generate(): void {
		super.generate();
		this.tankModifier = new TankModifier(this.getSourceSetpoints(), this.pathConfig);
	}

	getLeftSetpoints(): Setpoint[] {
		return this.tankModifier.getLeftSetpoints();
	}

	getRightSetpoints(): Setpoint[] {
		return this.tankModifier.getRightSetpoints();
	}
}
