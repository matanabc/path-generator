import { PathGeneratorBaseError, RobotValueEqualOrLessThenZeroError } from './errors';
import { LineGenerator, SplineGenerator } from './generate';
import { Line, Spline } from './motion_profiling';
import { Coord, Robot, Setpoint, Waypoint } from './types';
import { distanceToDegrees, radiansToDegrees } from './utils';

export default class Trajectory {
	protected _splinesSetpoints: Setpoint[] = [];
	protected _linesSetpoints: Setpoint[] = [];
	protected _coords: Coord[] = [];
	protected _spline_delta_time: number = 0;
	protected _line_delta_time: number = 0;

	public constructor(waypoints: Waypoint[], robot: Robot) {
		this.checkRobot(robot);
		this.generate(waypoints, robot);
	}

	protected checkRobot(robot: Robot): void {
		if (robot.acceleration <= 0) throw new RobotValueEqualOrLessThenZeroError('acceleration');
		else if (robot.maxVelocity <= 0) throw new RobotValueEqualOrLessThenZeroError('max velocity');
		else if (robot.loopTime <= 0) throw new RobotValueEqualOrLessThenZeroError('loop time');
	}

	private generate(waypoints: Waypoint[], robot: Robot): void {
		for (let index = 0; index < waypoints.length - 1; index++) {
			try {
				const startPoint = waypoints[index];
				const endPoint = waypoints[index + 1];
				const spline_delta_time = this._spline_delta_time;
				let line = new LineGenerator(startPoint, endPoint, robot, this._line_delta_time).generate();
				let spline = new SplineGenerator(startPoint, endPoint, robot, spline_delta_time).generate();
				line = this.updateLine(spline, line, startPoint, endPoint, robot);
				spline = this.updateSpline(spline, line, startPoint, endPoint, robot);
				this.update_coords(spline, line, startPoint, robot);
			} catch (error) {
				if (error instanceof PathGeneratorBaseError) error.addErrorPosition(index);
				throw error;
			}
		}
	}

	protected updateLine(spline: Spline, line: Line, startPoint: Waypoint, endPoint: Waypoint, robot: Robot): Line {
		const lineTotalTime = line.getTotalTime(robot.loopTime);
		const splineTotalTime = spline.getTotalTime(robot.loopTime);
		if (lineTotalTime < splineTotalTime)
			line = new LineGenerator(startPoint, endPoint, robot, this._line_delta_time)
				.setTotalTime(splineTotalTime, line.distance)
				.generate();
		if (spline.setpoints.length > 0 && line.setpoints.length === 0) this.fixLineLengthIsZero(line, spline);
		this._linesSetpoints.push(...line.setpoints);
		this._line_delta_time = line.delta_time;
		return line;
	}

	protected updateSpline(spline: Spline, line: Line, startPoint: Waypoint, endPoint: Waypoint, robot: Robot): Spline {
		const lineTotalTime = line.getTotalTime(robot.loopTime);
		const splineTotalTime = spline.getTotalTime(robot.loopTime);
		if (splineTotalTime < lineTotalTime)
			spline = new SplineGenerator(startPoint, endPoint, robot, this._line_delta_time)
				.setTotalTime(lineTotalTime, spline.distance)
				.generate();
		if (line.setpoints.length > 0 && spline.setpoints.length === 0) this.fixSplineLengthIsZero(line, spline);
		this._splinesSetpoints.push(...spline.setpoints);
		this._spline_delta_time = spline.delta_time;
		return spline;
	}

	protected update_coords(spline: Spline, line: Line, startPoint: Waypoint, robot: Robot): void {
		let angle_offset = radiansToDegrees(spline.coords[0].z) - startPoint.heading;
		this._coords.push(
			...spline.coords.map((coord, index) => ({
				...coord,
				z:
					startPoint.z !== undefined
						? startPoint.z + distanceToDegrees(line.coords[index]?.z || 0, robot.width)
						: radiansToDegrees(spline.coords[index].z) - angle_offset,
			}))
		);
	}

	protected fixSplineLengthIsZero(line: Line, spline: Spline): void {
		line.setpoints.forEach(() => spline.setpoints.push({ position: 0, acceleration: 0, velocity: 0 }));
		spline.coords.push(...line.coords);
	}

	protected fixLineLengthIsZero(line: Line, spline: Spline): void {
		spline.setpoints.forEach(() => line.setpoints.push({ position: 0, acceleration: 0, velocity: 0 }));
	}

	public get coords(): Coord[] {
		return this._coords;
	}

	public get splineSetpoints(): Setpoint[] {
		return this._splinesSetpoints;
	}

	public get lineSetpoints(): Setpoint[] {
		return this._linesSetpoints;
	}
}
