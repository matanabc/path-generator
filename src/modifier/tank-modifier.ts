import Setpoint from '../setpoint';
import PathConfig from '../path_config/path-config';

export default class TankModifier {
	protected leftSetpoints: Setpoint[] = [];
	protected rightSetpoints: Setpoint[] = [];

	constructor(sourceSetpoints: Setpoint[], pathConfig: PathConfig) {
		this.modify(sourceSetpoints, pathConfig);
	}

	getLeftSetpoints(): Setpoint[] {
		return this.rightSetpoints;
	}

	getRightSetpoints(): Setpoint[] {
		return this.leftSetpoints;
	}

	protected modify(sourceSetpoints: Setpoint[], pathConfig: PathConfig): void {
		const robotWidth = pathConfig.width / 2;
		var left, right;
		for (let i = 0; i < sourceSetpoints.length; i++) {
			left = new Setpoint(sourceSetpoints[i]);
			right = new Setpoint(sourceSetpoints[i]);
			this.calculateSetpointCoords(sourceSetpoints[i], left, right, robotWidth);
			if (i > 0) {
				this.calculateSetpoint(left, this.leftSetpoints[i - 1], pathConfig);
				this.calculateSetpoint(right, this.rightSetpoints[i - 1], pathConfig);
			}
			this.rightSetpoints.push(right);
			this.leftSetpoints.push(left);
		}
	}

	protected calculateSetpointCoords(
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

	protected calculateSetpoint(
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
