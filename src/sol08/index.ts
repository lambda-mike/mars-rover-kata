import * as process from "node:process"
import * as T from "@effect-ts/core/Effect"
import { pipe } from "@effect-ts/core/Function"
import { EnvironmentLive } from "./environment";
import { app } from "./app";
import { LoggerLive, SilentLoggerLive } from "./logger";
import { ReadFileLive } from "./readFile";
import { ConsoleLive } from "./console";

const LayerLive =
    EnvironmentLive["+++"](
        LoggerLive[">+>"](
            //SilentLoggerLive[">+>"](
            ReadFileLive)["+++"](ConsoleLive));

const main = (): Promise<void> => {
    return pipe(
        app,
        // TODO move logging error into the app? catch all bugs? and continue
        T.fold(
            (err) => console.error("Mission failed:", err),
            (_) => undefined,
        ),
        T.provideSomeLayer(LayerLive),
        T.runPromise,
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
