import * as E from "@effect-ts/core/Either"
import { pipe } from "@effect-ts/core/Function"

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

export const mkPlanet =
    (w: number, h: number): E.Either<Error, Planet> =>
        w > 0 && h > 0
            ? E.right({ width: w, height: h })
            : E.left(new Error("width and height must be positive numbers!"));

export const mkRover =
    (x: number, y: number, dir: Orientation): E.Either<Error, Rover> =>
        x >= 0 && y >= 0
            ? E.right({
                x,
                y,
                orientation: dir,
            })
            : E.left(new Error("Coordinates must not be negative numbers!"));

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

const parseNumPair = (sep: string) => (input: string): E.Either<Error, [number, number]> => {
    const regex = new RegExp(`^\\d+${sep}\\d+$`);
    if (!regex.test(input)) {
        return E.left(new Error("Wrong string format!"));
    }
    const nums = input.split(`${sep}`);
    if (nums.length !== 2) {
        return E.left(new Error("There should only be two numbers in the input string!"));
    }
    const [num1Str, num2Str] = nums;
    try {
        const num1 = parseInt(num1Str);
        const num2 = parseInt(num2Str);
        return E.right([num1, num2]);
    }
    catch (_) {
        console.error("[parseNumPair]", JSON.stringify(_));
        return E.left(new Error("parseInt failed!"));
    }
};

export const parsePlanet = (input: string): E.Either<Error, Planet> => pipe(
    input,
    parseNumPair("x"),
    E.chain(([width, height]) => {
        if (width <= 0 || height <= 0) {
            return E.left(new Error("Size of the planet must be positive!"));
        }
        return E.right({ width, height });
    }),
);

export const parseObstacle = (input: string): E.Either<Error, Obstacle> => E.left(new Error());
// export const parseObstacle = (input: string): E.Either<Error, Obstacle> => {}
export declare const parseObstacles: (input: string) => E.Either<Error, Array<Obstacle>>;
export declare const parseOrientation: (input: string) => E.Either<Error, Orientation>;
export declare const parseRover: (input: string) => E.Either<Error, Rover>;
export declare const renderTravelOutcome: (t: TravelOutcome) => string;
