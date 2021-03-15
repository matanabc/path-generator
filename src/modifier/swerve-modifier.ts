import SwerveSetpoint from '../setpoint/swerve-setpoint';
import PathConfig from '../path/path-config';
import Setpoint from '../setpoint/setpoint';
import Coord from '../coord/coord';
import * as Util from '../util';
import Vector from '../vector';

export default class SwerveModifier {
	public frontRightSetpoints: SwerveSetpoint[] = [];
	public backRightSetpoints: SwerveSetpoint[] = [];
	public frontLeftSetpoints: SwerveSetpoint[] = [];
	public backLeftSetpoints: SwerveSetpoint[] = [];
	public xSetpoints: Setpoint[] = [];
	public ySetpoints: Setpoint[] = [];
	public zSetpoints: Setpoint[] = [];
	protected pathConfig: PathConfig;
	protected coords: Coord[] = [];

	constructor(coords: Coord[], pathConfig: PathConfig) {
		this.pathConfig = pathConfig;
		this.coords = coords;
		this.modify();
	}

	protected modify(): void {
		this.xSetpoints.push(Object.assign(new Setpoint(), { position: this.coords[0].x }));
		this.ySetpoints.push(Object.assign(new Setpoint(), { position: this.coords[0].y }));
		this.frontRightSetpoints.push(new SwerveSetpoint());
		this.backRightSetpoints.push(new SwerveSetpoint());
		this.frontLeftSetpoints.push(new SwerveSetpoint());
		this.backLeftSetpoints.push(new SwerveSetpoint());
		for (let i = 1; i < this.coords.length; i++) {
			this.calculateAxisSetpoint(i);
			this.calculateSetpoint(i);
		}
		this.xSetpoints = this.xSetpoints.slice(1);
		this.ySetpoints = this.ySetpoints.slice(1);
		this.frontRightSetpoints = this.frontRightSetpoints.slice(1);
		this.backRightSetpoints = this.backRightSetpoints.slice(1);
		this.frontLeftSetpoints = this.frontLeftSetpoints.slice(1);
		this.backLeftSetpoints = this.backLeftSetpoints.slice(1);
	}

	protected calculateAxisSetpoint(index: number) {
		const xSetpoint = new Setpoint();
		const ySetpoint = new Setpoint();
		const zSetpoint = new Setpoint();
		const distanceX = this.coords[index].x - this.coords[index - 1].x;
		const distanceY = this.coords[index].y - this.coords[index - 1].y;
		xSetpoint.position = this.coords[index].x;
		ySetpoint.position = this.coords[index].y;
		xSetpoint.velocity = distanceX / this.pathConfig.robotLoopTime;
		ySetpoint.velocity = distanceY / this.pathConfig.robotLoopTime;
		xSetpoint.acceleration =
			(xSetpoint.velocity - this.xSetpoints[index - 1].velocity) / this.pathConfig.robotLoopTime;
		ySetpoint.acceleration =
			(ySetpoint.velocity - this.ySetpoints[index - 1].velocity) / this.pathConfig.robotLoopTime;
		this.xSetpoints.push(xSetpoint);
		this.ySetpoints.push(ySetpoint);
	}

	protected calculateSetpoint(index: number) {
		const vector = new Vector(this.xSetpoints[index].velocity, this.ySetpoints[index].velocity, 0);
		vector.fieldOriented(0);
		const r = Math.sqrt(Math.pow(this.pathConfig.width, 2) + Math.pow(this.pathConfig.width, 2));

		const a = vector.x - vector.rotation * (this.pathConfig.width / r);
		const b = vector.x + vector.rotation * (this.pathConfig.width / r);
		const c = vector.y - vector.rotation * (this.pathConfig.width / r);
		const d = vector.y + vector.rotation * (this.pathConfig.width / r);

		this.getSetpoint(this.frontRightSetpoints, this.frontRightSetpoints[index - 1], b, c, d);
		this.getSetpoint(this.backRightSetpoints, this.backRightSetpoints[index - 1], b, d, d);
		this.getSetpoint(this.frontLeftSetpoints, this.frontLeftSetpoints[index - 1], a, c, c);
		this.getSetpoint(this.backLeftSetpoints, this.backLeftSetpoints[index - 1], a, d, c);
	}

	protected getSetpoint(setpoints: SwerveSetpoint[], lastSetpoint: SwerveSetpoint, a: number, b: number, c: number) {
		const setpoint = new SwerveSetpoint();
		setpoint.velocity = Math.sqrt(a * a + b * b);
		setpoint.angle = 90 - Util.r2d(Math.atan2(a, c));
		setpoint.position = lastSetpoint.position + setpoint.velocity * this.pathConfig.robotLoopTime;
		setpoint.acceleration = (setpoint.velocity - lastSetpoint.velocity) / this.pathConfig.robotLoopTime;
		setpoints.push(setpoint);
	}
}
