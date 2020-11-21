import Setpoint from '../setpoint';
import IModifier from './imodifier';
import PathConfig from '../path-config';

export default class TankModifier implements IModifier<TankModify> {
	modify(sourceSetpoints: Setpoint[], pathConfig: PathConfig): TankModify {
		const leftSetpoints = [],
			rightSetpoints = [],
			robotWidth = pathConfig.width / 2;
		var left, right;
		for (let i = 0; i < sourceSetpoints.length; i++) {
			left = new Setpoint(sourceSetpoints[i]);
			right = new Setpoint(sourceSetpoints[i]);
			this.calculateSetpointCoords(sourceSetpoints[i], left, right, robotWidth);
			if (i > 0) {
				this.calculateSetpoint(left, leftSetpoints[i - 1], pathConfig);
				this.calculateSetpoint(right, rightSetpoints[i - 1], pathConfig);
			}
			leftSetpoints.push(left);
			rightSetpoints.push(right);
		}
		return new TankModify(leftSetpoints, rightSetpoints);
	}

	private calculateSetpointCoords(
		source: Setpoint,
		left: Setpoint,
		right: Setpoint,
		robotWidth: number
	): void {
		const cos_angle = Math.cos(source.heading);
		const sin_angle = Math.sin(source.heading);
		left.x = source.x - robotWidth * sin_angle;
		left.y = source.y + robotWidth * cos_angle;
		right.x = source.x + robotWidth * sin_angle;
		right.y = source.y - robotWidth * cos_angle;
	}

	private calculateSetpoint(
		sideSetpoint: Setpoint,
		lastSetpoint: Setpoint,
		config: PathConfig
	): void {
		var distance = 0,
			acc;
		distance = Math.sqrt(
			(sideSetpoint.x - lastSetpoint.x) * (sideSetpoint.x - lastSetpoint.x) +
				(sideSetpoint.y - lastSetpoint.y) * (sideSetpoint.y - lastSetpoint.y)
		);
		sideSetpoint.position = lastSetpoint.position + distance;
		sideSetpoint.velocity = distance / config.robotLoopTime;
		acc = (sideSetpoint.velocity - lastSetpoint.velocity) / config.robotLoopTime;
		sideSetpoint.acceleration = Math.abs(acc) > 0 ? (acc / Math.abs(acc)) * config.acc : 0;
	}
}

class TankModify {
	left: Setpoint[];
	right: Setpoint[];

	constructor(left: Setpoint[] = [], right: Setpoint[] = []) {
		this.left = right;
		this.right = left;
	}
}
