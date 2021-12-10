import { tag } from "@effect-ts/core/Has"
import * as T from "@effect-ts/core/Effect"
import * as L from "@effect-ts/core/Effect/Layer"

export interface Logger {
    readonly _tag: "Logger";
    readonly error: (...args: unknown[]) => T.UIO<void>;
    readonly log: (...args: unknown[]) => T.UIO<void>;
    readonly warn: (...args: unknown[]) => T.UIO<void>;
}

export const Logger = tag<Logger>();

const log =
    (...args: unknown[]): T.UIO<void> =>
        T.succeedWith(() => console.log("[LOG]", ...args));

const error =
    (...args: unknown[]): T.UIO<void> =>
        T.succeedWith(() => console.error("[ERR]", ...args));

const warn =
    (...args: unknown[]): T.UIO<void> =>
        T.succeedWith(() => console.warn("[WARN]", ...args));

export const LoggerLive = L.pure(Logger)({
    _tag: "Logger",
    log,
    error,
    warn,
});

export const SilentLoggerLive = L.pure(Logger)({
    _tag: "Logger",
    log: () => T.succeed(undefined),
    error: () => T.succeed(undefined),
    warn: () => T.succeed(undefined),
});
