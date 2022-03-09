import { Console } from "console";
import { tag } from "@effect-ts/core/Has"
import * as T from "@effect-ts/core/Effect"
import * as L from "@effect-ts/core/Effect/Layer"

export interface Logger {
    readonly _tag: "Logger";
    readonly error: (...args: unknown[]) => T.UIO<void>;
    readonly log: (...args: unknown[]) => T.UIO<void>;
    readonly warn: (...args: unknown[]) => T.UIO<void>;
    readonly debug: (...args: unknown[]) => T.UIO<void>;
}

export const Logger = tag<Logger>();
const consoleStderr = new Console(process.stderr, process.stderr);

const log =
    (...args: unknown[]): T.UIO<void> =>
        T.succeedWith(() => consoleStderr.log("[LOG]", ...args));

const error =
    (...args: unknown[]): T.UIO<void> =>
        T.succeedWith(() => consoleStderr.error("[ERR]", ...args));

const warn =
    (...args: unknown[]): T.UIO<void> =>
        T.succeedWith(() => consoleStderr.warn("[WARN]", ...args));

const debug =
    (...args: unknown[]): T.UIO<void> =>
        T.succeedWith(() => consoleStderr.debug("[DBG]", ...args));


export const LoggerLive = L.fromValue(Logger)({
    _tag: "Logger",
    log,
    error,
    warn,
    debug,
});

export const SilentLoggerLive = L.fromValue(Logger)({
    _tag: "Logger",
    log: () => T.succeed(undefined),
    error: () => T.succeed(undefined),
    warn: () => T.succeed(undefined),
    debug: () => T.succeed(undefined),
});
