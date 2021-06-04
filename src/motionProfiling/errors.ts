export class PathGeneratorError extends Error {
	public message: string;
	public solution: string;
	public problem?: string;
	public position?: string;

	constructor(message: string, solution: string, problem?: string) {
		super(message);
		Object.setPrototypeOf(this, PathGeneratorError.prototype);
		this.message = message;
		this.problem = problem;
		this.solution = solution;
	}

	public addErrorPosition(index: number): void {
		this.position = `The error occurred while using waypoint ${index + 1} and ${index + 2}`;
	}
}

export class VMaxEqualToZero extends PathGeneratorError {
	constructor() {
		super('V max equal to 0', 'Increase vMax');
	}
}

export class SplineIsToLong extends PathGeneratorError {
	constructor() {
		super('Spline length is to long', 'Change path waypoints');
	}
}

export class VMaxSmallerThenVEnd extends PathGeneratorError {
	constructor(V0: number, vEnd: number, vMax: number, newVMax: number) {
		super(
			'V max is smaller then V end',
			`Decrease vEnd or increase vMax, try using vEnd ${vMax} or vMax ${newVMax.toFixed(3)}`,
			`Can't get from v0 (${V0}) to vEnd (${vEnd}) because vMax (${vMax}) is smaller then vEnd (${vEnd})`
		);
	}
}

export class PathConfigValueEqualToZero extends PathGeneratorError {
	constructor(value: string) {
		super(`Path config ${value} is equal to 0`, `Increase path config ${value}`);
	}
}

export class VMaxEqualToNaN extends PathGeneratorError {
	constructor() {
		super('V max equal to NaN', 'Decrease vMax or increase distance');
	}
}
