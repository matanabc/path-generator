export default class PathConfig {
	acc: number;
	vMax: number;
	width: number;
	robotLoopTime: number;

	constructor(width: number = 0, vMax: number = 0, acc: number = 0, robotLoopTime: number = 0.02) {
		this.acc = acc;
		this.vMax = vMax;
		this.width = width;
		this.robotLoopTime = robotLoopTime;
	}
}
