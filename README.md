# PathGenerator Package

**PathGenerator** is a motion profile generator, which you can easily generat path for your robot to follow. <br/>
To see an example of using this package you can take a look at [PathGenerator App](https://github.com/matanabc/path-generator-app).<br/>
This package is based of [Jaci's PathFinder](https://github.com/JacisNonsense/Pathfinder) with some improvements.

## Usage

### Basic

```javascript
const { Waypoint, PathConfig, Path } = require('path-generator');

const waypoints = [new Waypoint(0, 0, 0, 0, 2), new Waypoint(1.5, 1.5, 90, 2, 2), new Waypoint(3, 3, 0, 0, 0)];
const pathConfig = new PathConfig(0.8, 3.5, 3);
const path = new Path(waypoints, pathConfig);
```

### Tank

```javascript
const { Tank } = require('path-generator');
const { Path, PathConfig, Waypoint } = Tank;

const waypoints = [new Waypoint(0, 0, 0, 0, 2), new Waypoint(1.5, 1.5, 90, 2, 2), new Waypoint(3, 3, 0, 0, 0)];
const pathConfig = new PathConfig(0.8, 3.5, 3);
const path = new Path(waypoints, pathConfig);
```

### Holonomic

```javascript
const { Holonomic } = require('path-generator');
const { Path, PathConfig, Waypoint } = Holonomic;

const waypoints = [
	new Waypoint(0, 0, 0, 0, 0, 2),
	new Waypoint(1.5, 1.5, 90, 0, 2, 2),
	new Waypoint(3, 3, 0, 180, 0, 0),
];
const pathConfig = new PathConfig(0.8, 3.5, 3);
const path = new Path(waypoints, pathConfig);
```

-   **Note**:
    -   Not tested on a robot yet!
