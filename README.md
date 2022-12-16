![npm](https://img.shields.io/npm/v/path-generator)

# PathGenerator Package

**PathGenerator** is a motion profile generator, which you can easily generate path for your robot to follow. <br/>
To see an example of using this package you can take a look at [PathGenerator App](https://github.com/matanabc/path-generator-app).<br/>
This package is based of [Jaci's PathFinder](https://github.com/JacisNonsense/Pathfinder) with some improvements.

## Usage

### Tank

```javascript
const { TankModifier, Trajectory, Waypoint, Robot } = require('path-generator');

const robot: Robot = { acceleration: 2, maxVelocity: 2, width: 0.6, loopTime: 0.02 };
const waypoints: Waypoint[] = [
	{ x: 0, y: 0, heading: 0, velocity: 0, maxVelocity: robot.maxVelocity },
	{ x: 2, y: 2, heading: 0, velocity: 0, maxVelocity: 0 },
];
const path = pathGenerator(waypoints, robot, TankModifier);
```

### Holonomic

```javascript
const { HolonomicModifier, Trajectory, Waypoint, Robot } = require('path-generator');

const robot: Robot = { acceleration: 2, maxVelocity: 2, width: 0.6, loopTime: 0.02 };
const waypoints: Waypoint[] = [
	{ x: 0, y: 0, z: 0, heading: 0, velocity: 0, maxVelocity: robot.maxVelocity },
	{ x: 2, y: 2, z: 0, heading: 0, velocity: 0, maxVelocity: 0 },
];
const path = pathGenerator(waypoints, robot, HolonomicModifier);
```

If you want to see more examples you can look in [here](test).
