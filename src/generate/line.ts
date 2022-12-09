import { Line } from '../motion_profiling';
import { Robot, Waypoint } from '../types';
import { degreesToDistance, getMaxVelocityByTime } from '../utils';

export default class LineGenerator {
	protected startPosition: number = 0;

	public constructor(
		protected readonly startPoint: Waypoint,
		protected readonly endPoint: Waypoint,
		protected readonly robot: Robot,
		protected readonly delta_time: number = 0,
		protected maxVelocity: number = Math.min(robot.maxVelocity, startPoint.maxVelocity)
	) {}

	public setTotalTime(totalTime: number, distance: number): this {
		this.maxVelocity = getMaxVelocityByTime(totalTime, distance, this.robot.acceleration);
		return this;
	}

	public generate(): Line {
		const line = new Line(this.getDistance(), this.robot.acceleration, 0, 0, this.maxVelocity);
		line.generate(this.delta_time, this.robot);
		return line;
	}

	private getDistance(): number {
		if (Number.isInteger(this.startPoint.z) && Number.isInteger(this.endPoint.z)) {
			this.startPosition = this.startPoint.z || 0;
			return degreesToDistance((this.endPoint.z || 0) - (this.startPoint.z || 0), this.robot.width);
		}
		return 0;
	}
}
