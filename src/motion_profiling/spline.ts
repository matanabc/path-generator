import { SplineIsToLongError } from '../common/errors';
import { Coord, Robot, Waypoint } from '../common/types';
import Arc from './arc';
import Line from './line';

export default class Spline extends Line {
	public readonly startPoint: Waypoint;
	public readonly endPoint: Waypoint;
	public readonly robot: Robot;
	protected arc: Arc;

	public constructor(startPoint: Waypoint, endPoint: Waypoint, robot: Robot) {
		const arc = new Arc(startPoint, endPoint);
		super(
			Math.abs(arc.arc_length),
			Math.abs(robot.acceleration),
			Math.abs(Math.min(startPoint.velocity, robot.maxVelocity)),
			Math.abs(Math.min(endPoint.velocity, robot.maxVelocity)),
			Math.abs(Math.min(startPoint.maxVelocity, robot.maxVelocity))
		);
		this.startPoint = startPoint;
		this.endPoint = endPoint;
		this.robot = robot;
		this.arc = arc;
	}

	protected getPositionCoords(relativePosition: number): Coord {
		return this.arc.getPositionCoords(relativePosition);
	}

	protected checkForError(): void {
		super.checkForError();
		if (this.distance > 20) throw new SplineIsToLongError();
	}

	protected generateCoords(): void {
		this._coords = this._setpoints.map(({ position }) => this.getPositionCoords(position));
	}
}
