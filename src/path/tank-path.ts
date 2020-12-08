import TankModifier from '../modifier/tank-modifier';
import Waypoint from '../waypoints/waypoint';
import PathConfig from './path-config';
import Setpoint from '../setpoint';
import Path from './path';

export default class TankPath extends Path {
	protected tankModifier: TankModifier = {} as TankModifier;

	constructor(waypoints: Waypoint[], pathConfig: PathConfig) {
		super(waypoints, pathConfig);
	}

	protected generate(): void {
		super.generate();
		this.tankModifier = new TankModifier(this.sourceSetpoints, this.coords, this.pathConfig);
	}

	get leftSetpoints(): Setpoint[] {
		return this.tankModifier.leftSetpoints;
	}

	get rightSetpoints(): Setpoint[] {
		return this.tankModifier.rightSetpoints;
	}
}
