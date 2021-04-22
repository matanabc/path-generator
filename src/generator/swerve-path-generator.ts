import PathGenerator from './path-generator';
import PathConfig from '../path/path-config';
import Waypoint from '../waypoints/waypoint';
import Setpoint from '../setpoint/setpoint';
import Coord from '../coord/coord';
import Spline from '../motionProfiling/spline';
import TurnInPlaceGenerator from './turn-in-place-generator';
import SwerveWaypoint from '../waypoints/swerve-waypoint';
import { Util } from '..';

export default class SwervePathGenerator extends PathGenerator {
	constructor(waypoints: Waypoint[], pathConfig: PathConfig) {
		super(waypoints, pathConfig);
	}

	protected generateCoords(spline: Spline, setpoints: Setpoint[], startPosition: number): Coord[] {
		const coords = super.generateCoords(spline, setpoints, startPosition);
		this.generateTurn(coords.length * this.pathConfig.robotLoopTime);
		return coords;
	}

	protected generateTurn(totalTime: number): void {
		const index = this.splines.length;
		const config = Object.assign(new PathConfig(), this.pathConfig);
		const turnAngle =
			(<SwerveWaypoint>this.waypoints[index + 1]).robotAngle - (<SwerveWaypoint>this.waypoints[index]).robotAngle;
		if (turnAngle === 0) {
			for (let i = 0; i < totalTime / this.pathConfig.robotLoopTime; i++) this.turnSetpoints.push(new Setpoint());
			return;
		}
		const distance = Util.angle2Distance(turnAngle, this.pathConfig.radios);
		config.vMax =
			(-totalTime + Math.sqrt(totalTime * totalTime - (4 * Math.abs(distance)) / this.pathConfig.acc)) /
			(-2 / this.pathConfig.acc);
		const turnPath = new TurnInPlaceGenerator([this.waypoints[index], this.waypoints[index + 1]], config);
		if (distance < 0) turnPath.getSetpoint().forEach((setpoint) => setpoint.changeDirection());
		this.turnSetpoints.push(...turnPath.getSetpoint());
	}

	getTurnSetpoints(): Setpoint[] {
		return this.turnSetpoints;
	}
}
