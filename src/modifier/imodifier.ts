import Setpoint from '../setpoint';
import PathConfig from '../path-config';

export default interface IModifier<T> {
	modify(sourceSetpoints: Setpoint[], pathConfig: PathConfig): T;
}
