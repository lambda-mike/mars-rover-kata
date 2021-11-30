import * as T from "@effect-ts/core/Effect"
import { pipe } from "@effect-ts/core/Function"
import { Has } from "@effect-ts/core/Has"
import {
    AppError,
    Environment,
    parseCommands,
    parseObstacles,
    parsePlanet,
    parseRover,
    renderTravelOutcome,
    travel,
    TravelOutcome,
} from "./domain";
import {
    Config,
} from "./config";

type App = T.Effect<Environment & Has<Config>, AppError, TravelOutcome>;

export const app: App = pipe(
    T.gen(function*(_) {
        const config = yield* _(Config);
        const logger = yield* _(T.access((env: Environment) => env.getLogger()));
        const readFile = yield* _(T.access((env: Environment) => env.readFile));
        const readConsole = yield* _(T.access((env: Environment) => env.readConsole));
        const writeConsole = yield* _(T.access((env: Environment) => env.writeConsole));

        yield* _(writeConsole("Welcome to Mars, Rover!"));

        const [planetStr, roverStr] = yield* _(pipe(
            readFile(config.planetFile),
            T.zip(readFile(config.roverFile)),
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

        const cmdsStr = yield* _(readConsole("Please, enter commands for the Rover in 'F,B,R,L' format: "));
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
