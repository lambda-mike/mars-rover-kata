export interface Planet {
    readonly width: number;
    readonly height: number;
}

export enum Orientation {
    N = "N",
    E = "E",
    S = "S",
    W = "W",
}

export interface Pos {
    readonly x: number;
    readonly y: number;
}

export interface Rover {
    readonly x: number;
    readonly y: number;
    readonly orientation: Orientation;
}

// TODO return obj or Error ??
export const mkPlanet = (w: number, h: number): Planet => ({ width: w, height: h });

export const mkRover = (x: number, y: number, dir: Orientation): Rover => ({
    x,
    y,
    orientation: dir,
});

export const turnLeft = (rover: Rover): Rover => {
    switch (rover.orientation) {
        case Orientation.N:
            return { ...rover, orientation: Orientation.W };
        case Orientation.W:
            return { ...rover, orientation: Orientation.S };
        case Orientation.S:
            return { ...rover, orientation: Orientation.E };
        case Orientation.E:
            return { ...rover, orientation: Orientation.N };
    }
};

export const turnRight = (rover: Rover): Rover => {
    switch (rover.orientation) {
        case Orientation.N:
            return { ...rover, orientation: Orientation.E };
        case Orientation.E:
            return { ...rover, orientation: Orientation.S };
        case Orientation.S:
            return { ...rover, orientation: Orientation.W };
        case Orientation.W:
            return { ...rover, orientation: Orientation.N };
    }
};

export const moveForward = (planet: Planet, rover: Rover): Rover => {
    const wrapPositive = (a: number, max: number) =>
        (a + 1) % max;
    const wrapNegative = (a: number, max: number) =>
        a === 0 ? max - 1 : a - 1;
    switch (rover.orientation) {
        case Orientation.N:
            return { ...rover, y: wrapPositive(rover.y, planet.height) };
        case Orientation.E:
            return { ...rover, x: wrapPositive(rover.x, planet.width) };
        case Orientation.S:
            return { ...rover, y: wrapNegative(rover.y, planet.height) };
        case Orientation.W:
            return { ...rover, x: wrapNegative(rover.x, planet.width) };
    }
};

export const moveBackward = (planet: Planet, rover: Rover): Rover => {
    const oppositeDir = (dir: Orientation): Orientation => {
        switch (dir) {
            case Orientation.N:
                return Orientation.S;
            case Orientation.S:
                return Orientation.N;
            case Orientation.E:
                return Orientation.W;
            case Orientation.W:
                return Orientation.E;
        }
    };
    const movedRoverOppositeDir =
        moveForward(planet, { ...rover, orientation: oppositeDir(rover.orientation) });
    return { ...movedRoverOppositeDir, orientation: rover.orientation };
};

export enum Cmd {
    "F",
    "B",
    "L",
    "R",
}

export interface Obstacle {
    pos: Pos;
}

export type TravelOutcome =
    | { kind: "Normal", rover: Rover }
    | { kind: "Hit", rover: Rover }
    ;

export const move = (
    planet: Planet,
    rover: Rover,
    obstacles: Array<Obstacle>,
    cmd: Cmd
): TravelOutcome => {
    const hasHitObstacle = (r: Rover): boolean =>
        undefined !== obstacles.find(
            ({ pos }) => r.x === pos.x && r.y === pos.y);
    switch (cmd) {
        case Cmd.L:
            return { kind: "Normal", rover: turnLeft(rover) };
        case Cmd.R:
            return { kind: "Normal", rover: turnRight(rover) };
        case Cmd.F: {
            const newRover = moveForward(planet, rover);
            return hasHitObstacle(newRover)
                ? { kind: "Hit", rover: rover }
                : { kind: "Normal", rover: newRover }
                ;
        }
        case Cmd.B: {
            const newRover = moveBackward(planet, rover);
            return hasHitObstacle(newRover)
                ? { kind: "Hit", rover: rover }
                : { kind: "Normal", rover: newRover }
                ;
        }
    }
};

export const travel = (
    planet: Planet,
    rover: Rover,
    obstacles: Array<Obstacle>,
    cmds: Array<Cmd>,
): TravelOutcome => {
    let moveResult: TravelOutcome = { kind: "Normal", rover: { ...rover } };
    for (const cmd of cmds) {
        moveResult = move(planet, moveResult.rover, obstacles, cmd);
        if (moveResult.kind === "Hit") {
            break;
        }
    }
    return moveResult;
};
