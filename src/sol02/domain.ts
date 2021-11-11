export interface Planet {
    readonly width: number;
    readonly height: number;
}

export enum Orientation {
    "N",
    "E",
    "S",
    "W",
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

export declare const move: (planet: Planet, rover: Rover, cmd: Cmd) => TravelOutcome;
export declare const travel: (planet: Planet, rover: Rover, cmds: Array<Cmd>) => TravelOutcome;
