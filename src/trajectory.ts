import { PathGeneratorBaseError, RobotValueEqualToZeroError } from './errors';
import { LineGenerator, SplineGenerator } from './generate';
import { Line, Spline } from './motion_profiling';
import { Coord, Robot, Setpoint, Waypoint } from './types';
import { distanceToDegrees, radiansToDegrees } from './utils';

export default class Trajectory {
	protected _splinesSetpoints: Setpoint[] = [];
	protected _linesSetpoints: Setpoint[] = [];
	protected _coords: Coord[] = [];
	protected _splines: Spline[] = [];
	protected _lines: Line[] = [];
	protected _spline_delta_time: number = 0;
	protected _line_delta_time: number = 0;

	public constructor(private waypoints: Waypoint[], private robot: Robot) {
		this.checkRobot();
		this.generate();
	}

	protected checkRobot(): void {
		if (this.robot.acceleration === 0) throw new RobotValueEqualToZeroError('acceleration');
		else if (this.robot.maxVelocity === 0) throw new RobotValueEqualToZeroError('max velocity');
		else if (this.robot.loopTime === 0) throw new RobotValueEqualToZeroError('loop time');
	}

	private generate(): void {
		for (let index = 0; index < this.waypoints.length - 1; index++) {
			try {
				const { startPoint, endPoint } = this.getWaypoints(index);
				const spline_delta_time = this._spline_delta_time;
				const line = new LineGenerator(startPoint, endPoint, this.robot, this._line_delta_time).generate();
				const spline = new SplineGenerator(startPoint, endPoint, this.robot, spline_delta_time).generate();
				this.updateLine(spline, line, startPoint, endPoint);
				this.updateSpline(spline, line, startPoint, endPoint);
				this.update_coords(index, startPoint);
			} catch (error) {
				if (error instanceof PathGeneratorBaseError) error.addErrorPosition(index);
				throw error;
			}
		}
	}

	protected getWaypoints(index: number) {
		return { startPoint: this.waypoints[index], endPoint: this.waypoints[index + 1] };
	}

	protected updateLine(spline: Spline, line: Line, startPoint: Waypoint, endPoint: Waypoint) {
		const lineTotalTime = line.getTotalTime(this.robot.loopTime);
		const splineTotalTime = spline.getTotalTime(this.robot.loopTime);
		if (lineTotalTime < splineTotalTime)
			line = new LineGenerator(startPoint, endPoint, this.robot, this._line_delta_time)
				.setTotalTime(splineTotalTime, line.distance)
				.generate();
		if (spline.setpoints.length > 0 && line.setpoints.length === 0) this.fixLineLengthIsZero(line, spline);
		this._linesSetpoints.push(...line.setpoints);
		this._line_delta_time = line.delta_time;
		this._lines.push(line);
	}

	protected updateSpline(spline: Spline, line: Line, startPoint: Waypoint, endPoint: Waypoint) {
		const { loopTime } = this.robot;
		const lineTotalTime = line.getTotalTime(loopTime);
		const splineTotalTime = spline.getTotalTime(loopTime);
		if (splineTotalTime < lineTotalTime)
			spline = new SplineGenerator(startPoint, endPoint, this.robot, this._line_delta_time)
				.setTotalTime(lineTotalTime, spline.distance)
				.generate();
		if (line.setpoints.length > 0 && spline.setpoints.length === 0) this.fixSplineLengthIsZero(line, spline);
		this._splinesSetpoints.push(...spline.setpoints);
		this._spline_delta_time = spline.delta_time;
		this._splines.push(spline);
	}

	protected update_coords(index: number, startPoint: Waypoint): void {
		const spline = this._splines[index];
		const line = this._lines[index];
		let angle_offset = radiansToDegrees(spline.coords[index].z) - startPoint.heading;
		this._coords.push(
			...spline.coords.map((coord, index) => ({
				...coord,
				z:
					startPoint.z !== undefined
						? startPoint.z + distanceToDegrees(line.coords[index]?.z || 0, this.robot.width)
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
