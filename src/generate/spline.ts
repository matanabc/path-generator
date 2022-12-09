import { Spline } from '../motion_profiling';
import LineGenerator from './line';

export default class SplineGenerator extends LineGenerator {
	public generate(): Spline {
		const startPoint = { ...this.startPoint, maxVelocity: this.maxVelocity };
		const spline = new Spline(startPoint, this.endPoint, this.robot);
		spline.generate(this.delta_time, this.robot);
		return spline;
	}
}
