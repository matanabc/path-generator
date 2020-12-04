export default interface IPath {
	getSourceSetpoints(): any;
	getPathConfig(): any;
	getWaypoints(): any;
	isIllegal(): boolean;
	getError(): any;
}
