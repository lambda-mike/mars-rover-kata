import * as process from "node:process"
import * as As from "@effect-ts/core/Async"
import { pipe } from "@effect-ts/core/Function"
import {
    readConsole,
    readFile,
    getLogger,
} from "./infra";
import {
    Config,
    Environment,
    Logger,
} from "./domain";

// TODO Write unit tests for the app - should be able to mock what we want and test errors, etc.
const app = As.gen(function*(_) {
    const config = yield* _(As.access((env: Environment) => env.getConfig()));
    const planetStr = yield* _(readFile(config.planetFile));
    const roverStr = yield* _(readFile(config.roverFile));

    const logger = yield* _(As.access((env: Environment) => env.getLogger()));

    // TODO remove after debugging
    yield* _(logger.log("[DBG]", planetStr, roverStr));

    // TODO split planet
    // TODO parse planet
    // TODO parse obstacles
    // TODO parse rover

    yield* _(logger.log("Welcome to Mars, Rover!"));
    const cmds = yield* _(readConsole("Please, enter commands for the Rover in 'F,B,R,L' format: "));

    // TODO travel
    // TODO return outcome

    // TODO remove after debugging
    yield* _(logger.log(`Rover is executing commands: ${cmds}`));
});

// TODO move to index.ts ???
const main = (): Promise<void> => {
    const config: Config = {
        planetFile: "planet.txt",
        roverFile: "rover.txt",
    };
    const env = {
        getConfig: () => config,
        getLogger,
    };
    const logger = getLogger();
    return pipe(
        app,
        As.foldM(
            (err) => logger.error("Mission failed:", err),
            // TODO print final position of the Rover
            () => logger.log("Mission completed!"),
        ),
        As.catchAll(
            (err) => logger.error("Captured unexpected error:", err)
        ),
        As.provideAll(env),
        // TODO replace with runPromiseExit
        As.runPromise,
    );
};

(async () => {
    try {
        await main();
    } catch (err) {
        console.error("Unexpected error captured: ", err)
    } finally {
        process.exit(0);
    }
})()
