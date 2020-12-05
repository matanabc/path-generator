function fmod(num1: number, num2: number): number {
	return num1 - Math.floor(num1 / num2) * num2;
}

export function boundRadians(angle: number): number {
	var newAngle = fmod(angle, Math.PI * 2);
	if (newAngle < 0) newAngle = Math.PI * 2 + newAngle;
	return newAngle;
}

export function d2r(angleInDegrees: number): number {
	return (angleInDegrees * Math.PI) / 180;
}

export function r2d(angleInRads: number): number {
	return (angleInRads * 180) / Math.PI;
}

export function angle2Distance(angle: number, width: number): number {
	return (width / 2) * d2r(angle);
}

export function distance2Angle(distance: number, width: number): number {
	return (distance / width) * 2;
}
