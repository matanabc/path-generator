export default class PathConfig {
	public acc: number;
	public vMax: number;
	public width: number;
	public robotLoopTime: number;

	/**
	 * @param width				Robot width
	 * @param vMax				Robot max velocity
	 * @param acc				Robot acceleration
	 * @param robotLoopTime		Robot loop time
	 */
	constructor(width: number = 0, vMax: number = 0, acc: number = 0, robotLoopTime: number = 0.02) {
		this.acc = acc;
		this.vMax = vMax;
		this.width = width;
		this.robotLoopTime = robotLoopTime;
	}
}
