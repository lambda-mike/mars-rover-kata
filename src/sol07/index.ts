import * as process from "node:process"
import * as T from "@effect-ts/core/Effect"
import * as L from "@effect-ts/core/Effect/Layer"
import { pipe } from "@effect-ts/core/Function"
import {
    Config,
} from "./config";
import { app } from "./app";
import { LoggerLive, SilentLoggerLive } from "./logger";
import { ReadFileLive } from "./readFile";
import { ConsoleLive } from "./console";

const ConfigLive = L.fromValue(Config)({
    _tag: "Config",
    planetFile: "planet.txt",
    roverFile: "rover.txt",
} as const);

const LayerLive =
    ConfigLive["+++"](
        LoggerLive[">+>"](
            //SilentLoggerLive[">+>"](
            ReadFileLive)["+++"](ConsoleLive));

const main = (): Promise<void> => {
    return pipe(
        app,
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
