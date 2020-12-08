import Coord from './coord';

export default class SwerveCoord extends Coord {
	protected _radios: number;

	constructor(x: number, y: number, angle: number, radios: number) {
		super(x, y, angle);
		this._radios = radios;
	}

	get radios(): number {
		return this._radios;
	}
}
