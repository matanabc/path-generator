import { Setpoint } from './types';

export const boundRadians = (radians: number): number => {
	const doublePI = Math.PI * 2;
	let newAngle = radians - Math.floor(radians / doublePI) * doublePI;
	return newAngle < 0 ? doublePI + newAngle : newAngle;
};

export const degreesToRadians = (degrees: number): number => (degrees * Math.PI) / 180;
export const radiansToDegrees = (radians: number): number => (radians * 180) / Math.PI;

export const degreesToDistance = (degrees: number, width: number): number => (width / 2) * degreesToRadians(degrees);
export const distanceToDegrees = (distance: number, width: number): number => radiansToDegrees((distance / width) * 2);

export const copy = (type: any, objects: any[]): any => objects.map((object) => Object.assign(new type(), object));
export const deepCopy = (value: object | any[]): any => JSON.parse(JSON.stringify(value));

export const changeSetpointDirection = (setpoint: Setpoint): void => {
	setpoint.acceleration *= -1;
	setpoint.velocity *= -1;
	setpoint.position *= -1;
};
export const mergeSetpoints = (setpoint1: Setpoint, setpoint2: Setpoint): Setpoint => {
	return {
		acceleration: setpoint1.acceleration + setpoint2.acceleration,
		velocity: setpoint1.velocity + setpoint2.velocity,
		position: setpoint1.position + setpoint2.position,
	};
};

export const getMaxVelocityByVelocity = (
	distance: number,
	acceleration: number,
	startVelocity: number,
	endVelocity: number,
	maxVelocity: number
): number => {
	return Math.min(
		Math.sqrt(
			Math.abs(
				(2 * distance * Math.pow(acceleration, 2) +
					acceleration * Math.pow(startVelocity, 2) +
					acceleration * Math.pow(endVelocity, 2)) /
					(acceleration * 2)
			)
		),
		Math.abs(maxVelocity)
	);
};
export const getMaxVelocityByTime = (totalTime: number, distance: number, acceleration: number): number =>
	(-totalTime + Math.sqrt(totalTime * totalTime - (4 * Math.abs(distance)) / acceleration)) / (-2 / acceleration);
