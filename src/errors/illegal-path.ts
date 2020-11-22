import IllegalSpline from './illegal-spline';

export default class IllegalPath extends IllegalSpline {
	info: string;

	constructor(info: string, splineError: IllegalSpline) {
		super(splineError.problem, splineError.solution);
		this.info = info;
	}
}
