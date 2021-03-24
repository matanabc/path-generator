export default class PathConfig {
	public acc: number;
	public vMax: number;
	public width: number;
	public length: number;
	public radios: number;
	public robotLoopTime: number;

	/**
	 * @param vMax				Robot max velocity
	 * @param acc				Robot acceleration
	 * @param width				Robot width
	 * @param length			Robot length
	 * @param robotLoopTime		Robot loop time
	 */
	constructor(
		vMax: number = 0,
		acc: number = 0,
		width: number = 0,
		length: number = width,
		robotLoopTime: number = 0.02
	) {
		this.acc = acc;
		this.vMax = vMax;
		this.width = width;
		this.length = length;
		this.robotLoopTime = robotLoopTime;
		this.radios = Math.sqrt(length * length + width * width);
	}
}
