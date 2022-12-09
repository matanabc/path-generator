export class PathGeneratorBaseError extends Error {
	public position?: string;

	public constructor(public message: string, public solution: string, public problem?: string) {
		super(message);
		Object.setPrototypeOf(this, PathGeneratorBaseError.prototype);

		this.message = message;
		this.problem = problem;
		this.solution = solution;
	}

	public addErrorPosition(index: number): void {
		this.position = `The error occurred while using waypoint ${index + 1} and ${index + 2}`;
	}
}

export class MaxVelocityEqualToZeroError extends PathGeneratorBaseError {
	public constructor() {
		super('Max velocity equal to 0', 'Increase max velocity');
	}
}

export class SplineIsToLongError extends PathGeneratorBaseError {
	public constructor() {
		super('Spline length is to long', 'Change path waypoints');
	}
}

export class MaxVelocitySmallerThenVEndError extends PathGeneratorBaseError {
	public constructor(V0: number, vEnd: number, vMax: number) {
		super(
			'Max velocity is smaller then end velocity',
			`Decrease end velocity or increase max velocity`,
			`Can't get from start velocity (${V0}) to end velocity (${vEnd}) because max velocity (${vMax}) is smaller then end velocity (${vEnd})`
		);
	}
}

export class MaxVelocityEqualToNaNError extends PathGeneratorBaseError {
	public constructor() {
		super('Max velocity equal to NaN', 'Decrease max velocity or increase distance');
	}
}
export class RobotAngleIsUndefinedError extends PathGeneratorBaseError {
	public constructor() {
		super('Robot angle is undefined', 'Change robot angle');
	}
}

export class RobotValueEqualToZeroError extends PathGeneratorBaseError {
	public constructor(value: string) {
		super(`Robot ${value} is equal to 0`, `Increase robot ${value}`);
	}
}
