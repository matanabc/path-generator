import Setpoint from './setpoint';

export default class Segment {
	private acc: number = 0;
	private V0: number = 0;

	totalTime: number = 0;
	distance: number = 0;

	constructor(V0OrV: number, VeOrDistance: number, acc?: number) {
		if (acc === undefined) this.constructorB(V0OrV, VeOrDistance);
		else this.constructorA(V0OrV, VeOrDistance, acc);
	}

	private constructorA(V0: number, Ve: number, acc: number): void {
		this.V0 = V0;
		this.acc = V0 < Ve ? acc : -acc;
		this.totalTime = Math.abs((Ve - V0) / acc);
		this.distance = this.getPosition(this.totalTime);
	}

	private constructorB(V: number, distance: number): void {
		this.distance = distance;
		this.V0 = V;
		this.acc = 0;
		this.totalTime = distance / V;
	}

	getSetpoint(time: number, relativePosition: number): Setpoint {
		return new Setpoint(
			0,
			0,
			0,
			this.getPosition(time) + relativePosition,
			this.getVelocity(time),
			this.acc,
			time
		);
	}

	getPosition(time: number): number {
		return this.V0 * time + 0.5 * this.acc * time * time;
	}

	getVelocity(time: number): number {
		return this.V0 + this.acc * time;
	}
}
