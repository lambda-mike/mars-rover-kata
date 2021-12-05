import * as M from "@effect-ts/core/Effect/Managed"
import * as T from "@effect-ts/core/Effect"
import { pipe } from "@effect-ts/core/Function"
import { Has } from "@effect-ts/core/Has"
import {
    AppError,
    parseCommands,
    parseObstacles,
    parsePlanet,
    parseRover,
    renderTravelOutcome,
    travel,
    TravelOutcome,
} from "./domain";
import { Environment, readEnv } from "./environment";
import { Logger } from "./logger";
import { ReadFile, readFile } from "./readFile";
import { Console } from "./console";

type App = T.Effect<
    Has<Console>
    & Has<Environment>
    & Has<Logger>
    & Has<ReadFile>
    , AppError, TravelOutcome>;

export const app: App = pipe(
    T.gen(function*(_) {
        const env = yield* _(readEnv);
        const logger = yield* _(Logger);
        const { readConsole, writeConsole } = yield* _(Console);

        yield* _(writeConsole("Welcome to Mars, Rover!"));

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

        const prompt = "Please, enter commands for the Rover in 'F,B,R,L' format: ";
        const cmdsStr = yield* _(M.useNow(readConsole(prompt)));
        const cmds = yield* _(parseCommands(cmdsStr));
        yield* _(logger.log(`Rover is executing commands: ${cmds}`));

        const outcome =
            yield* _(T.succeed(travel(planet, rover, obstacles, cmds)));
        yield* _(writeConsole(`Rover position: ${renderTravelOutcome(outcome)}`));

        const finalMsg = outcome.kind === "Normal"
            ? "Mission completed!"
            : "Mission aborted!";
        yield* _(writeConsole(finalMsg));

        return outcome;
    }),
);
