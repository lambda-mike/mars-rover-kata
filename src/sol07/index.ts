import * as process from "node:process"
import * as T from "@effect-ts/core/Effect"
import * as L from "@effect-ts/core/Effect/Layer"
import { pipe } from "@effect-ts/core/Function"
import {
    Config,
} from "./config";
import {
    readConsole,
    writeConsole,
} from "./infra";
import { app } from "./app";
import { LoggerLive } from "./logger";
import { ReadFileLive } from "./readFile";

const ConfigLive = L.pure(Config)({
    _tag: "Config",
    planetFile: "planet.txt",
    roverFile: "rover.txt",
} as const);

const LayerLive = ConfigLive["+++"](LoggerLive)["+++"](ReadFileLive);

const main = (): Promise<void> => {
    const env = {
        readConsole,
        writeConsole,
    };
    return pipe(
        app,
        T.fold(
            (err) => console.error("Mission failed:", err),
            (_) => undefined,
        ),
        T.provideSomeLayer(LayerLive),
        T.provideAll(env),
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
