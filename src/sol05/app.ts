import * as process from "node:process"
import * as As from "@effect-ts/core/Async"
import { pipe } from "@effect-ts/core/Function"
import {
    readConsole,
    readFile,
    logger,
} from "./infra";
import {
    Environment,
} from "./domain";

const app = As.gen(function*(_) {
    const planetFile = yield* _(As.access((env: { planetFile: string }) => env.planetFile));
    const roverFile = yield* _(As.access((env: { roverFile: string }) => env.roverFile));

    const planetStr = yield* _(readFile(planetFile));
    const roverStr = yield* _(readFile(roverFile));

    // TODO remove after debugging
    yield* _(logger.log("[DBG]", planetStr, roverStr));

    yield* _(logger.log("Welcome to Mars, Rover!"));
    const cmds = yield* _(readConsole("Please, enter commands for the Rover in 'F,B,R,L' format: "));

    // TODO replace with travel and outputting the result
    yield* _(logger.log(`Rover is executing commands: ${cmds}`));
});

const main = (): Promise<void> => {
    const env: Environment = {
        planetFile: "planet.txt",
        roverFile: "rover.txt",
    };
    return pipe(
        app,
        As.foldM(
            (err) => logger.error("Mission failed:", err),
            () => logger.log("Mission completed!"),
        ),
        As.catchAll(
            (err) => logger.error("Unexpected captured error: ", err)
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
