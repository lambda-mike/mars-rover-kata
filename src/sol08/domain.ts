import * as A from "@effect-ts/core/Collections/Immutable/Array"
import * as E from "@effect-ts/core/Either"
import * as TP from "@effect-ts/core/Collections/Immutable/Tuple"
import { makeAssociative } from "@effect-ts/core/Associative"
import { pipe, flow } from "@effect-ts/core/Function"


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

export enum Cmd {
    F = "F",
    B = "B",
    L = "L",
    R = "R",
}

export interface Obstacle {
    pos: Pos;
}

export type TravelOutcome =
    | { kind: "Normal", rover: Rover }
    | { kind: "Hit", rover: Rover }
    ;

export interface ReadFileError {
    kind: "ReadFileError";
    filename: string;
    error: unknown;
};

export interface ParseCmdError {
    kind: "ParseCmdError";
    input: string;
}
export interface ParseCommandsError {
    kind: "ParseCommandsError";
    error: string;
    input: string;
}

export interface ReadConsoleError {
    kind: "ReadConsoleError";
    error:
    | ReadConsoleCreateError
    | ReadConsoleQuestionError
    ;
};

export interface ReadConsoleCreateError {
    kind: "ReadConsoleCreateError";
    error: unknown;
};

export interface ReadConsoleQuestionError {
    kind: "ReadConsoleQuestionError";
    error: unknown;
};

export interface PlanetConstructionError {
    kind: "PlanetConstructionError";
    msg: string;
};

export interface RoverCosntructionError {
    kind: "RoverCosntructionError";
    msg: string;
};

export interface ParseNumPairError {
    kind: "ParseNumPairError",
    error:
    | "WrongInputStringError"
    | "WrongNumbersCountError"
    | "UnknownError"
    ;
}

export interface NegativeSizeError {
    kind: "NegativeSizeError";
}

export interface NegativeCoordinatesError {
    kind: "NegativeCoordinatesError";
}

export interface ParsePlanetError {
    kind: "ParsePlanetError";
    error:
    | ParseNumPairError
    | NegativeSizeError
    ;
}

export interface ParseObstacleError {
    kind: "ParseObstacleError";
    error: ParseNumPairError | NegativeCoordinatesError;
}

export interface ParseOrientationError {
    kind: "ParseOrientationError";
    input: string;
};

export interface ParseRoverError {
    kind: "ParseRoverError",
    error:
    | ParseNumPairError
    | ParseOrientationError
    | { kind: "InputError" }
    ;
}

// Planet tuple input has less than 2 inputs!
export interface MissingPlanetDataError {
    kind: "MissingPlanetDataError";
}

export interface EnvironmentError {
    kind: "EnvironmentError";
    error: MissingVarEnvironmentError | EmptyVarEnvironmentError;
    name: string;
}

export interface MissingVarEnvironmentError {
    kind: "MissingVarEnvironmentError";
    error: unknown;
}

export interface EmptyVarEnvironmentError {
    kind: "EmptyVarEnvironmentError";
}

export type AppError =
    | MissingPlanetDataError
    | ParseCmdError
    | ParseCommandsError
    | ParseNumPairError
    | ParsePlanetError
    | ParseRoverError
    | PlanetConstructionError
    | ReadConsoleError
    | ReadFileError
    | ReadonlyArray<ParseObstacleError>
    | RoverCosntructionError
    | Array<EnvironmentError>
    ;

export const mkPlanet =
    (w: number, h: number): E.Either<PlanetConstructionError, Planet> =>
        w > 0 && h > 0
            ? E.right({ width: w, height: h })
            : E.left({
                kind: "PlanetConstructionError",
                msg: "width and height must be positive numbers!"
            });

export const mkRover =
    (x: number, y: number, dir: Orientation): E.Either<RoverCosntructionError, Rover> =>
        x >= 0 && y >= 0
            ? E.right({
                x,
                y,
                orientation: dir,
            })
            : E.left({
                kind: "RoverCosntructionError",
                msg: "Coordinates must not be negative numbers"
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

export const move = (
    planet: Planet,
    rover: Rover,
    obstacles: ReadonlyArray<Obstacle>,
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
    obstacles: ReadonlyArray<Obstacle>,
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

const parseNumPair = (sep: string) => (input: string): E.Either<ParseNumPairError, [number, number]> => {
    const regex = new RegExp(`^\\d+${sep}\\d+$`);
    if (!regex.test(input)) {
        return E.left({
            kind: "ParseNumPairError",
            error: "WrongInputStringError"
        });
    }
    const nums = input.split(`${sep}`);
    if (nums.length !== 2) {
        return E.left({
            kind: "ParseNumPairError",
            error: "WrongNumbersCountError",
        });
    }
    const [num1Str, num2Str] = nums;
    try {
        const num1 = parseInt(num1Str);
        const num2 = parseInt(num2Str);
        return E.right([num1, num2]);
    }
    catch (_) {
        console.error("[parseNumPair]", JSON.stringify(_));
        return E.left({
            kind: "ParseNumPairError",
            error:
                "UnknownError"
        });
    }
};

export const parsePlanet = (input: string): E.Either<ParsePlanetError, Planet> => pipe(
    input,
    parseNumPair("x"),
    E.chain(([width, height]) => {
        if (width <= 0 || height <= 0) {
            return E.left({
                kind: "NegativeSizeError" as const,
            });
        }
        return E.right({ width, height });
    }),
    E.mapLeft((error) => ({ error, kind: "ParsePlanetError" })),
);

export const parseObstacle = (input: string): E.Either<ParseObstacleError, Obstacle> => pipe(
    input,
    parseNumPair(","),
    E.chain(([x, y]) => {
        if (x < 0 || y < 0) {
            return E.left({ kind: "NegativeCoordinatesError" as const });
        }
        return E.right({ pos: { x, y } });
    }),
    E.mapLeft((error) => ({
        error,
        kind: "ParseObstacleError"
    })),
);

export const parseObstacles = (
    input: string
): E.Either<ReadonlyArray<ParseObstacleError>, ReadonlyArray<Obstacle>> => {
    const ValidationApplicative = E.getValidationApplicative(
        makeAssociative<Array<ParseObstacleError>>((l, r) => [...l, ...r]),
    );
    const traverse = A.forEachF(ValidationApplicative);
    return pipe(
        input.split(" "),
        traverse(flow(parseObstacle, E.mapLeft((e) => [e]))),
    );
};

export const parseOrientation = (
    input: string
): E.Either<ParseOrientationError, Orientation> => {
    switch (input) {
        case "N":
            return E.right(Orientation.N);
        case "E":
            return E.right(Orientation.E);
        case "S":
            return E.right(Orientation.S);
        case "W":
            return E.right(Orientation.W);
        default:
            return E.left({ kind: "ParseOrientationError", input })
    }
};

export const parseRoverClassic = (
    input: string
): E.Either<ParseRoverError, Rover> => {
    const posAndDirStr = input.split(":");
    if (posAndDirStr.length !== 2) {
        return E.left({
            kind: "ParseRoverError",
            error: { kind: "InputError" }
        });
    }
    const pos = parseNumPair(",")(posAndDirStr[0]);
    const orientation = parseOrientation(posAndDirStr[1]);
    return pipe(
        pos,
        E.zip(orientation),
        E.bimap(
            (error) => ({
                kind: "ParseRoverError",
                error
            }),
            flow(
                TP.toNative,
                ([[x, y], orientation]) => ({ x, y, orientation }),
            ),
        ),
    );
};

// E.gen
export const parseRoverGen = (input: string): E.Either<ParseRoverError, Rover> => {
    const posAndDirStr = input.split(":");
    return pipe(
        E.gen(function*(_) {
            if (posAndDirStr.length !== 2) {
                yield* _(E.left(
                    { kind: "InputError" as const }
                ));
            }
            const [x, y] = yield* _(parseNumPair(",")(posAndDirStr[0]));
            const orientation = yield* _(parseOrientation(posAndDirStr[1]));
            return { x, y, orientation };
        }),
        E.mapLeft((error) => ({
            kind: "ParseRoverError",
            error
        })),
    );
};

// E.do
export const parseRoverDo = (input: string): E.Either<ParseRoverError, Rover> => {
    const posAndDirStr = input.split(":");
    return pipe(
        E.do,
        E.let("posAndDirTuple", () =>
            (posAndDirStr.length !== 2)
                ? E.left({ kind: "InputError" as const })
                : E.right([posAndDirStr[0], posAndDirStr[1]])
        ),
        E.let("pos", ({ posAndDirTuple }) =>
            parseNumPair(",")(posAndDirTuple[0])),
        E.let("orientation", ({ posAndDirTuple }) =>
            parseOrientation(posAndDirTuple[1])),
        E.map(({ pos, orientation }) =>
            ({ x: pos[0], y: pos[1], orientation })),
        E.mapLeft((error) => ({
            kind: "ParseRoverError",
            error
        })),
    );
};

export const parseRover = parseRoverGen;

export const renderTravelOutcome = (t: TravelOutcome): string => {
    const roverStr =
        `${t.rover.x}:${t.rover.y}:${t.rover.orientation}`;
    switch (t.kind) {
        case "Normal":
            return roverStr;
        case "Hit":
            return `O:${roverStr}`;
    }
};

export const parseCommand = (input: string): E.Either<ParseCmdError, Cmd> => {
    switch (input) {
        case "F":
            return E.right(Cmd.F);
        case "B":
            return E.right(Cmd.B);
        case "L":
            return E.right(Cmd.L);
        case "R":
            return E.right(Cmd.R);
        default:
            return E.left({ kind: "ParseCmdError", input });
    }
};

export const parseCommands = (input: string): E.Either<ParseCommandsError, Array<Cmd>> =>
    pipe(
        input.split(","),
        A.forEachF(E.Applicative)((x) => parseCommand(x.trim())),
        E.bimap(
            (err) => ({
                kind: "ParseCommandsError",
                error: err.input,
                input,
            }),
            (xs) => [...xs],
        ),
    );
