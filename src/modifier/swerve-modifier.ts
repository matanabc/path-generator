import SwerveCoord from '../coord/swerve-coord';
import PathConfig from '../path/path-config';
import Setpoint from '../setpoint/setpoint';

export default class SwerveModifier {
	constructor(sourceSetpoints: Setpoint[], coords: SwerveCoord[], pathConfig: PathConfig) {
		this.modify(sourceSetpoints, coords, pathConfig);
	}

	protected modify(
		sourceSetpoints: Setpoint[],
		coords: SwerveCoord[],
		pathConfig: PathConfig
	): void {}
}
