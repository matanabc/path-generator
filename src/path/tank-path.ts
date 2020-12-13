import TankModifier from '../modifier/tank-modifier';
import Waypoint from '../waypoints/waypoint';
import Setpoint from '../setpoint/setpoint';
import PathConfig from './path-config';
import Path from './path';

export default class TankPath extends Path {
	protected modifier: TankModifier;

	constructor(waypoints: Waypoint[], pathConfig: PathConfig) {
		super(waypoints, pathConfig);
		this.modifier = new TankModifier(this.sourceSetpoints, this.coords, this.pathConfig);
	}

	get leftSetpoints(): Setpoint[] {
		return this.modifier.leftSetpoints;
	}

	get rightSetpoints(): Setpoint[] {
		return this.modifier.rightSetpoints;
	}
}
