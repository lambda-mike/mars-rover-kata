import * as As from "@effect-ts/core/Async"
import { pipe } from "@effect-ts/core/Function"
import {
    AppError,
    Environment,
    parseCommands,
    parseObstacles,
    parsePlanet,
    parseRover,
    travel,
    TravelOutcome,
} from "./domain";

type App = As.Async<Environment, AppError, TravelOutcome>;

export const app: App = As.gen(function*(_) {
    const config = yield* _(As.access((env: Environment) => env.getConfig()));
    const logger = yield* _(As.access((env: Environment) => env.getLogger()));
    const readFile = yield* _(As.access((env: Environment) => env.readFile));
    const readConsole = yield* _(As.access((env: Environment) => env.readConsole));
    const writeConsole = yield* _(As.access((env: Environment) => env.writeConsole));

    yield* _(writeConsole("Welcome to Mars, Rover!"));

    const [planetStr, roverStr] = yield* _(pipe(
        readFile(config.planetFile),
        As.zip(readFile(config.roverFile)),
    ));
    const planetTuple = planetStr.split("\n");
    if (planetTuple.length < 2) {
        yield* _(As.fail(new Error("Planet tuple input has less than 2 inputs!")));
    }
    const planet = yield* _(As.fromEither(parsePlanet(planetTuple[0])));
    yield* _(logger.log("Planet", planet));
    const obstacles = yield* _(As.fromEither(parseObstacles(planetTuple[1])));
    yield* _(logger.log("Obstacles", obstacles));

    const rover = yield* _(As.fromEither(parseRover(roverStr)));
    yield* _(logger.log("Rover", rover));

    const cmdsStr = yield* _(readConsole("Please, enter commands for the Rover in 'F,B,R,L' format: "));
    const cmds = yield* _(parseCommands(cmdsStr));
    yield* _(logger.log(`Rover is executing commands: ${cmds}`));

    return yield* _(As.succeed(travel(planet, rover, obstacles, cmds)));
});
