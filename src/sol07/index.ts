import * as process from "node:process"
import * as As from "@effect-ts/core/Async"
import { pipe } from "@effect-ts/core/Function"
import {
    Config,
} from "./domain";
import {
    getLogger,
    readConsole,
    readFile,
    writeConsole,
} from "./infra";
import { app } from "./app";

const main = (): Promise<void> => {
    const config: Config = {
        planetFile: "planet.txt",
        roverFile: "rover.txt",
    };
    const env = {
        getConfig: () => config,
        getLogger,
        readFile,
        readConsole,
        writeConsole,
    };
    return pipe(
        app,
        As.fold(
            (err) => console.error("Mission failed:", err),
            (_) => undefined,
        ),
        As.provideAll(env),
        As.runPromise,
    );
};

(async () => {
    try {
        await main();
    } catch (err) {
        console.error("Unexpected error captured:", err)
    } finally {
        process.exit(0);
    }
})()
