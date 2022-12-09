import { Setpoint } from '../types';

export default class Segment {
	private _totalTime: number = 0;
	private _distance: number = 0;
	private _acceleration: number = 0;
	private _startVelocity: number = 0;

	public constructor(builder: SegmentBuilder) {
		const { velocity, distance, startVelocity, endVelocity, acceleration } = builder;
		if (startVelocity !== undefined && endVelocity !== undefined && acceleration !== undefined)
			this.segmentUsingAcceleration(startVelocity, endVelocity, acceleration);
		else if (velocity !== undefined && distance !== undefined) this.segmentUsingDistance(velocity, distance);
	}

	private segmentUsingAcceleration(startVelocity: number, endVelocity: number, acceleration: number): void {
		this._startVelocity = startVelocity;
		this._acceleration = startVelocity < endVelocity ? acceleration : -acceleration;
		this._totalTime = Math.abs((endVelocity - startVelocity) / acceleration);
		this._distance = this.getPosition(this._totalTime);
	}

	private segmentUsingDistance(velocity: number, distance: number): void {
		this._distance = distance;
		this._startVelocity = velocity;
		this._acceleration = 0;
		this._totalTime = distance / velocity;
	}

	public getSetpoint(time: number, relativePosition: number): Setpoint {
		return {
			position: this.getPosition(time) + relativePosition,
			velocity: this.getVelocity(time),
			acceleration: this._acceleration,
		};
	}

	private getPosition(time: number): number {
		return this._startVelocity * time + 0.5 * this._acceleration * time * time;
	}

	private getVelocity(time: number): number {
		return this._startVelocity + this._acceleration * time;
	}

	public get totalTime(): number {
		return Number.isNaN(this._totalTime) ? 0 : this._totalTime;
	}

	public get distance(): number {
		return this._distance;
	}
}

export class SegmentBuilder {
	public velocity?: number;
	public distance?: number;
	public startVelocity?: number;
	public endVelocity?: number;
	public acceleration?: number;

	public segmentUsingDistance(velocity: number, distance: number): SegmentBuilder {
		this.velocity = velocity;
		this.distance = distance;
		this.startVelocity = undefined;
		this.endVelocity = undefined;
		this.acceleration = undefined;
		return this;
	}

	public segmentUsingAcceleration(startVelocity: number, endVelocity: number, acceleration: number): SegmentBuilder {
		this.startVelocity = startVelocity;
		this.endVelocity = endVelocity;
		this.acceleration = acceleration;
		this.velocity = undefined;
		this.distance = undefined;
		return this;
	}

	public build(): Segment {
		return new Segment(this);
	}
}
