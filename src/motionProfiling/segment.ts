import Setpoint from './setpoint';

export default class Segment {
	private _totalTime: number = 0;
	private _distance: number = 0;
	private _acc: number = 0;
	private _V0: number = 0;

	constructor(V0OrV: number, VeOrDistance: number, acc?: number) {
		if (acc === undefined) this.constructorB(V0OrV, VeOrDistance);
		else this.constructorA(V0OrV, VeOrDistance, acc);
	}

	private constructorA(V0: number, Ve: number, acc: number): void {
		this._V0 = V0;
		this._acc = V0 < Ve ? acc : -acc;
		this._totalTime = Math.abs((Ve - V0) / acc);
		this._distance = this.getPosition(this._totalTime);
	}

	private constructorB(V: number, distance: number): void {
		this._distance = distance;
		this._V0 = V;
		this._acc = 0;
		this._totalTime = distance / V;
	}

	getSetpoint(time: number, relativePosition: number): Setpoint {
		return new Setpoint(this.getPosition(time) + relativePosition, this.getVelocity(time), this._acc);
	}

	private getPosition(time: number): number {
		return this._V0 * time + 0.5 * this._acc * time * time;
	}

	private getVelocity(time: number): number {
		return this._V0 + this._acc * time;
	}

	get totalTime(): number {
		return Number.isNaN(this._totalTime) ? 0 : this._totalTime;
	}

	get distance(): number {
		return this._distance;
	}
}
