import * as process from "node:process"
import * as T from "@effect-ts/core/Effect"
import { pipe } from "@effect-ts/core/Function"
import { EnvironmentLive } from "./environment";
import { app } from "./app";
import { LoggerLive, SilentLoggerLive } from "./logger";
import { ReadFileLive } from "./readFile";
import { ConsoleLive } from "./console";
import { ConsoleRendererLive } from "./consoleRenderer";
import { ColourPaletteServiceLive } from "./colourPalette";

const LayerLive =
    EnvironmentLive["+++"](
        LoggerLive[">+>"](
            //SilentLoggerLive[">+>"](
            ReadFileLive)["+++"](ConsoleLive)
        ["+++"](ColourPaletteServiceLive[">=>"](ConsoleRendererLive)));

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
        console.log("Unexpected error captured:", err)
    } finally {
        process.exit(0);
    }
})()
