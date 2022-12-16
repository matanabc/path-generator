import Trajectory from '../generate/trajectory';
import { Waypoint, Robot, Setpoint, Coord } from '../common/types';
import { degreesToRadians } from '../common/utils';
import Modifier from './modifier';

export default class HolonomicModifier extends Modifier {
	protected _setpointsX: Setpoint[] = [];
	protected _setpointsY: Setpoint[] = [];
	protected _setpointsZ: Setpoint[] = [];

	constructor(trajectory: Trajectory, waypoints: Waypoint[], robot: Robot) {
		super();
		this.modify(trajectory, waypoints, robot);
	}

	protected modify({ coords }: Trajectory, waypoints: Waypoint[], robot: Robot): void {
		const startPoint = waypoints[0];
		coords.forEach((coord, index) => {
			if (index === 0) this.generateFirstSetpoint(coord, startPoint);
			else {
				this.generateSetpoints('x', this._setpointsX, coords, index, robot);
				this.generateSetpoints('y', this._setpointsY, coords, index, robot);
				this.generateZSetpoints(this._setpointsZ, coords, index, robot);
			}
		});
	}

	protected getStartVelocity({ heading, velocity, z }: Waypoint): Coord {
		return {
			x: Math.cos(degreesToRadians(heading)) * velocity,
			y: Math.sin(degreesToRadians(heading)) * velocity,
			z: 0,
		};
	}

	protected generateFirstSetpoint(coord: Coord, startPoint: Waypoint): void {
		const startVelocity = this.getStartVelocity(startPoint);
		this._setpointsX = [{ acceleration: 0, position: coord.x, velocity: startVelocity.x }];
		this._setpointsY = [{ acceleration: 0, position: coord.y, velocity: startVelocity.y }];
		this._setpointsZ = [{ acceleration: 0, position: startPoint.z || 0, velocity: startVelocity.z }];
	}

	protected generateSetpoints(
		axis: keyof Coord,
		setpoints: Setpoint[],
		coords: Coord[],
		index: number,
		{ loopTime }: Robot
	): void {
		const velocity = (coords[index][axis] - coords[index - 1][axis]) / loopTime;
		setpoints.push({
			acceleration: (velocity - setpoints[index - 1].velocity) / loopTime,
			position: coords[index][axis],
			velocity,
		});
	}

	protected generateZSetpoints(
		setpoints: Setpoint[],
		coords: Coord[],
		index: number,
		{ loopTime, width }: Robot
	): void {
		const position = (degreesToRadians(coords[index].z) / 2) * width;
		const lestPosition = (degreesToRadians(coords[index - 1].z) / 2) * width;
		const velocity = (position - lestPosition) / loopTime;
		setpoints.push({
			acceleration: (velocity - setpoints[index - 1].velocity) / loopTime,
			position: coords[index].z,
			velocity,
		});
	}

	public get x(): Setpoint[] {
		return this._setpointsX;
	}

	public get y(): Setpoint[] {
		return this._setpointsY;
	}

	public get z(): Setpoint[] {
		return this._setpointsZ;
	}
}
