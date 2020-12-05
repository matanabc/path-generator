function fmod(num1: number, num2: number): number {
	return num1 - Math.floor(num1 / num2) * num2;
}

export function boundRadians(angle: number): number {
	var newAngle = fmod(angle, Math.PI * 2);
	if (newAngle < 0) newAngle = Math.PI * 2 + newAngle;
	return newAngle;
}

/**
 * @param angle in degrees
 * @returns angle in radians
 */
export function d2r(angle: number): number {
	return (angle * Math.PI) / 180;
}

/**
 * @param angle in radians
 * @returns angle in degrees
 */
export function r2d(angle: number): number {
	return (angle * 180) / Math.PI;
}

/**
 * @param angle In degrees
 */
export function angle2Distance(angle: number, width: number): number {
	return (width / 2) * d2r(angle);
}

/**
 * @returns Angle in degrees
 */
export function distance2Angle(distance: number, width: number): number {
	return r2d((distance / width) * 2);
}
