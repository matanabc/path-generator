import Setpoint from '../setpoint';
import PathConfig from '../path-config';

export default interface IModifier {
	modify(sourceSetpoints: Setpoint[], pathConfig: PathConfig): any;
}
