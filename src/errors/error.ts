import IllegalSpline from './illegal-spline';
import IllegalPath from './illegal-path';

export function vMaxEqualTo0(): IllegalSpline {
	return new IllegalSpline(`Can't create spline because vMax is equal to 0!`, `Increase vMax!`);
}

export function splineIsToLong(): IllegalSpline {
	return new IllegalSpline(`Spline length is to long!`, `Change path waypoints!`);
}

export function vMaxSmallerThenVEnd(
	V0: number,
	vEnd: number,
	vMax: number,
	newVMax: number
): IllegalSpline {
	return new IllegalSpline(
		`Can't get from v0 (${V0}) to vEnd (${vEnd}) because vMax` +
			`(${vMax}) is smaller then vEnd (${vEnd})!`,
		`Decrease vEnd or increase vMax!\n` + `Try using vEnd ${vMax} or vMax ${newVMax.toFixed(3)}!`
	);
}

export function pathConfigValueEqualTo0(value: string): IllegalPath {
	const error = new IllegalSpline(
		`Path config ${value} is equal to 0!`,
		`Increase path config ${value}!`
	);
	return new IllegalPath('Path config is illegal!', error);
}
