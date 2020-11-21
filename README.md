# PathGenerator Package

**PathGenerator** is a motion profile generator, which you can easily generator path for your robot to follow. <br/>
This package is base of [Jaci's PathFinder](https://github.com/JacisNonsense/Pathfinder) with some improvements.

## Usage

### Without modifier

```typescript
const { Waypoint, PathConfig, Path } = require('path-generator');

const waypoints = [
	new Waypoint(0, 0, 0, 0, 2),
	new Waypoint(1.5, 1.5, 90, 2, 2),
	new Waypoint(3, 3, 0, 0, 0),
];
const pathConfig = new PathConfig(0.8, 3.5, 3);
const path = new Path(waypoints, pathConfig);
```

### With modifier

```typescript
const { Waypoint, PathConfig, Path, TankModifier } = require('path-generator');

const waypoints = [
	new Waypoint(0, 0, 0, 0, 2),
	new Waypoint(1.5, 1.5, 90, 2, 2),
	new Waypoint(3, 3, 0, 0, 0),
];
const pathConfig = new PathConfig(0.8, 3.5, 3);
const path = new Path(waypoints, pathConfig, new TankModifier());
```

## Modifier options

- Tank: `TankModifier`
