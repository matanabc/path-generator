import {
	MaxVelocityEqualToNaNError,
	MaxVelocityEqualToZeroError,
	MaxVelocitySmallerThenEndVelocityError,
} from '../errors';
import { Coord, Robot, Setpoint, Waypoint } from '../types';
import { getMaxVelocityByVelocity } from '../utils';
import Segment, { SegmentBuilder } from './segment';

export default class Line {
	protected _segments: Segment[] = [];
	protected _setpoints: Setpoint[] = [];
	protected _coords: Coord[] = [];
	protected _delta_time: number = 0;

	public constructor(
		public readonly distance: number = 0,
		public readonly acceleration: number = 0,
		public readonly startVelocity: number = 0,
		public readonly endVelocity: number = 0,
		public readonly maxVelocity: number = 0
	) {
		this.maxVelocity = getMaxVelocityByVelocity(distance, acceleration, startVelocity, endVelocity, maxVelocity);
		this.maxVelocity *= Math.sign(distance);
		this.checkForError();
	}

	protected checkForError(): void {
		if (Number.isNaN(this.maxVelocity)) throw new MaxVelocityEqualToNaNError();
		if (this.maxVelocity === 0 && this.distance !== 0) throw new MaxVelocityEqualToZeroError();
		if (Math.abs(this.maxVelocity) < Math.abs(this.endVelocity))
			throw new MaxVelocitySmallerThenEndVelocityError(this.startVelocity, this.endVelocity, this.maxVelocity);
	}

	public getWaypoints(): Waypoint[] {
		return [
			{ x: 0, y: 0, heading: 0, velocity: this.startVelocity, maxVelocity: this.maxVelocity },
			{ x: this.distance, y: 0, heading: 0, velocity: this.endVelocity, maxVelocity: this.maxVelocity },
		];
	}

	public getInfo(): string {
		return `(Distance: ${this.distance}, Acceleration: ${this.acceleration}, Start velocity: ${this.startVelocity}, End velocity: ${this.endVelocity}, Max velocity: ${this.maxVelocity})`;
	}

	public generate(delta_time: number, { loopTime, width }: Robot): void {
		this.generateSegments();
		this.generateSetpoints(delta_time, loopTime);
		this.generateCoords();
	}

	protected generateSegments(): void {
		const speedingToMaxVelocity = new SegmentBuilder()
			.segmentUsingAcceleration(this.startVelocity, this.maxVelocity, this.acceleration)
			.build();
		const slowingToEndVelocity = new SegmentBuilder()
			.segmentUsingAcceleration(this.maxVelocity, this.endVelocity, this.acceleration)
			.build();
		this._segments = [
			speedingToMaxVelocity,
			new SegmentBuilder()
				.segmentUsingDistance(
					this.maxVelocity,
					this.distance - (speedingToMaxVelocity.distance + slowingToEndVelocity.distance)
				)
				.build(),
			slowingToEndVelocity,
		];
	}

	protected generateSetpoints(delta_time: number, loopTime: number): void {
		let lastPos = 0;
		let setpointTime = delta_time;
		this._segments.forEach((segment) => {
			if (segment.distance === 0) return;
			for (; setpointTime <= segment.totalTime; setpointTime += loopTime)
				this._setpoints.push(segment.getSetpoint(setpointTime, lastPos));
			lastPos += segment.distance;
			setpointTime -= segment.totalTime;
		});
		this._delta_time = setpointTime;
	}

	protected generateCoords(): void {
		this._coords = this._setpoints.map(({ position }) => ({
			x: 0,
			y: 0,
			z: position,
		}));
	}

	public get segments(): Segment[] {
		return this._segments;
	}

	public get setpoints(): Setpoint[] {
		return this._setpoints;
	}

	public get coords(): Coord[] {
		return this._coords;
	}

	public get delta_time(): number {
		return this._delta_time;
	}

	public getTotalTime(loopTime: number): number {
		return this.setpoints.length * loopTime;
	}
}
