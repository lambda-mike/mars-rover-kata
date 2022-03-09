import * as Ref from "@effect-ts/core/Effect/Ref"
import * as A from "@effect-ts/core/Collections/Immutable/Array"
import * as O from "@effect-ts/core/Option"
import * as T from "@effect-ts/core/Effect"
import { Clock } from "@effect-ts/core/Effect/Clock"
import { pipe } from "@effect-ts/core/Function"
import { Has } from "@effect-ts/core/Has"
import {
    AppError,
    Cmd,
    InitialPositionError,
    move,
    Obstacle,
    parseCommands,
    parseObstacles,
    parsePlanet,
    parseRover,
    Planet,
    Rover,
} from "./domain";
import { Environment, readEnv } from "./environment";
import { Logger } from "./logger";
import { ReadFile, readFile } from "./readFile";
import {
    Console,
    clearConsole,
    readConsole,
    writeConsole,
} from "./console";
import { TravelOutcome } from "@app/sol09/domain"
import {
    ConsoleRenderer,
    render,
} from "./consoleRenderer"

type App = T.Effect<
    Has<Clock>
    & Has<Console>
    & Has<Environment>
    & Has<Logger>
    & Has<ReadFile>
    & Has<ConsoleRenderer>
    , AppError, void>;

const PROMPT =
    "\nPlease, enter commands for the Rover in 'F,B,R,L' format: ";

const LOOP_DELAY = 1000; //ms

const loop = (
    planet: Planet,
    obstacles: ReadonlyArray<Obstacle>,
    outcomeRef: Ref.Ref<TravelOutcome>,
) => T.gen(function*(_) {
    const logger = yield* _(Logger);
    const prevOutcome = yield* _(Ref.get(outcomeRef));

    yield* _(render({ planet, obstacles, outcome: prevOutcome }));

    const cmdsStr = yield* _(readConsole(PROMPT));
    const cmds = yield* _(parseCommands(cmdsStr));
    yield* _(logger.log(`Rover is executing commands: ${cmds}`));

    const executedCmds: Array<Cmd> = [];
    let outcome: TravelOutcome = prevOutcome;

    yield* _(render({ planet, obstacles, outcome }));
    yield* _(T.sleep(LOOP_DELAY));
    for (const cmd of cmds) {
        executedCmds.push(cmd);
        outcome = move(planet, outcome.rover, obstacles, cmd);
        yield* _(render({ planet, obstacles, outcome }));
        yield* _(writeConsole(
            `\nExecuting cmds: ${executedCmds.join(' ')}`));
        if (outcome.kind === "Hit") {
            break;
        }
        yield* _(T.sleep(LOOP_DELAY));
    }
    yield* _(Ref.update(() => outcome)(outcomeRef));
    if (outcome.kind === "Hit") {
        yield* _(writeConsole("\nMission aborted: collission detected!"));
    } else {
        yield* _(writeConsole("\nMission completed!"));
    }
    return outcome;
});

export const guardInitialPosition = (
    obstacles: ReadonlyArray<Obstacle>,
    rover: Rover,
): T.Effect<unknown, InitialPositionError, void> => pipe(
    obstacles,
    A.find((obstacle) =>
        obstacle.pos.x === rover.x && obstacle.pos.y === rover.y),
    T.whenCase(O.map(() => T.fail(new InitialPositionError()))),
);

export const app: App = pipe(
    T.gen(function*(_) {
        const env = yield* _(readEnv);
        const logger = yield* _(Logger);
        const { consoleM } = yield* _(Console);

        yield* _(clearConsole());
        yield* _(writeConsole("Welcome to Mars, Rover!\n"));

        const [planetStr, roverStr] = yield* _(pipe(
            readFile(env.PLANET_FILE),
            T.zip(readFile(env.ROVER_FILE)),
        ));
        const planetTuple = planetStr.split("\n");
        if (planetTuple.length < 2) {
            yield* _(T.fail({ kind: "MissingPlanetDataError" as const }));
        }
        const planet = yield* _(T.fromEither(() => parsePlanet(planetTuple[0])));
        yield* _(logger.log("Planet", planet));
        const obstacles = yield* _(T.fromEither(() => parseObstacles(planetTuple[1])));
        yield* _(logger.log("Obstacles", obstacles));
        const rover = yield* _(T.fromEither(() => parseRover(roverStr)));
        yield* _(logger.log("Rover", rover));

        yield* _(guardInitialPosition(obstacles, rover));

        const outcomeRef =
            yield* _(Ref.makeRef<TravelOutcome>({ kind: "Normal", rover }))

        return yield* _(pipe(
            loop(planet, obstacles, outcomeRef),
            T.catchAll((err) => T.gen(function*(_) {
                yield* _(logger.error("Error in loop:", err));
                yield* _(writeConsole("\nError occurred! Please, try again."));
                // Continue regardless
                return yield* _(T.succeed(null));
            })),
            T.zipLeft(readConsole("\nPress 'Enter' to start the next mission...")),
            T.forever,
            T.provideSomeManaged(consoleM),
        ));
    }),
    T.tapError((err) => pipe(
        T.service(Logger),
        T.chain((logger) => logger.error("Error detected:", err)),
    )),
);
