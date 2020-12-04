export default class PathConfig {
	acc: number = 2;
	vMax: number = 2;
	width: number = 0.6;
	robotLoopTime: number = 0.02;

	constructor(
		widthOrPathConfig: number | PathConfig = 0,
		vMax: number = 0,
		acc: number = 0,
		robotLoopTime: number = 0.02
	) {
		if (widthOrPathConfig instanceof PathConfig) this.copyConstructor(widthOrPathConfig);
		else {
			this.acc = acc;
			this.vMax = vMax;
			this.width = widthOrPathConfig;
			this.robotLoopTime = robotLoopTime;
		}
	}

	private copyConstructor(pathConfig: PathConfig) {
		this.acc = pathConfig.acc ? pathConfig.acc : this.acc;
		this.vMax = pathConfig.vMax ? pathConfig.vMax : this.vMax;
		this.width = pathConfig.width ? pathConfig.width : this.width;
		this.robotLoopTime = pathConfig.robotLoopTime ? pathConfig.robotLoopTime : this.robotLoopTime;
	}
}
