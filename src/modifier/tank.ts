import Trajectory from '../generate/trajectory';
import { Waypoint, Robot, Setpoint, Coord } from '../common/types';
import { changeSetpointDirection, degreesToRadians, mergeSetpoints, radiansToDegrees } from '../common/utils';
import Modifier from './modifier';

export default class TankModifier extends Modifier {
	protected _rightSetpoints: Setpoint[] = [];
	protected _leftSetpoints: Setpoint[] = [];
	protected _rightCoords: Coord[] = [];
	protected _leftCoords: Coord[] = [];
	protected _angle: number[] = [];

	constructor(trajectory: Trajectory, waypoints: Waypoint[], robot: Robot) {
		super();
		this.modify(trajectory, waypoints, robot);
	}

	protected modify(
		{ splineSetpoints, lineSetpoints, coords }: Trajectory,
		waypoints: Waypoint[],
		robot: Robot
	): void {
		coords.forEach((coord, index) => {
			this.splineModify(splineSetpoints[index], coord, robot, index);
			this.lineModify(lineSetpoints[index], index);
			this.updateAngle(index, waypoints[0].z === undefined ? waypoints[0].heading : waypoints[0].z, robot);
		});
	}

	protected splineModify(setpoint: Setpoint, coord: Coord, { width, loopTime }: Robot, index: number): void {
		this._leftSetpoints.push({ ...setpoint });
		this._rightSetpoints.push({ ...setpoint });
		this._leftCoords.push(this.getCoord(coord, width));
		this._rightCoords.push(this.getCoord(coord, -width));
		if (index > 0 && setpoint.velocity !== 0) {
			this.calculateSetpoint(this._leftSetpoints, this._leftCoords, index, loopTime);
			this.calculateSetpoint(this._rightSetpoints, this._rightCoords, index, loopTime);
		}
	}

	protected lineModify(setpoint: Setpoint, index: number): void {
		this._rightSetpoints[index] = mergeSetpoints(this._rightSetpoints[index], setpoint);
		changeSetpointDirection(setpoint);
		this._leftSetpoints[index] = mergeSetpoints(this._leftSetpoints[index], setpoint);
		changeSetpointDirection(setpoint);
	}

	protected getCoord({ x, y, z }: Coord, width: number): Coord {
		const radios = width / 2;
		const cos_angle = Math.cos(degreesToRadians(z));
		const sin_angle = Math.sin(degreesToRadians(z));
		return { x: x - radios * sin_angle, y: y + radios * cos_angle, z };
	}

	protected calculateSetpoint(setpoints: Setpoint[], coords: Coord[], index: number, loopTime: number): void {
		const setpoint = setpoints[index];
		const coord = coords[index];
		const lastSetpoint = setpoints[index - 1];
		const lastCoord = coords[index - 1];
		const distance = Math.sqrt(
			(coord.x - lastCoord.x) * (coord.x - lastCoord.x) + (coord.y - lastCoord.y) * (coord.y - lastCoord.y)
		);
		setpoint.position = lastSetpoint.position + distance;
		setpoint.velocity = distance / loopTime;
		setpoint.acceleration = (setpoint.velocity - lastSetpoint.velocity) / loopTime;
	}

	protected updateAngle(index: number, startAngle: number, { width }: Robot): void {
		const distance = this._rightSetpoints[index].position - this._leftSetpoints[index].position;
		this._angle.push(startAngle + radiansToDegrees(distance / width));
	}

	get left(): Setpoint[] {
		return this._rightSetpoints;
	}

	get right(): Setpoint[] {
		return this._leftSetpoints;
	}

	get angle(): number[] {
		return this._angle;
	}
}
