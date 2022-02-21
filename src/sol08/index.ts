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
        T.catchAllDefect((defect) => {
            console.error("Defect detected:", defect);
            return T.fail(defect);
        }),
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
