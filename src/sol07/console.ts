import * as L from "@effect-ts/core/Effect/Layer"
import * as M from "@effect-ts/core/Effect/Managed"
import * as T from "@effect-ts/core/Effect"
import * as process from "node:process"
import * as readline from "node:readline"
import type { _A } from "@effect-ts/core/Utils"
import { Has, tag } from "@effect-ts/core/Has"
import { pipe } from "@effect-ts/core"
import {
    ReadConsoleError,
} from "./domain";
import { Logger } from "./logger";

const consoleM: M.Managed<
    Has<Logger>,
    ReadConsoleError,
    readline.Interface
> = M.gen(function*(_) {
    const logger = yield* _(Logger);
    return yield* _(M.make(
        (rl: readline.Interface) => pipe(
            T.gen(function*(_) {
                yield* _(logger.log("[DBG] close"));
                rl.close();
                return;
            }),
            // result is ignored by M.make
            T.result,
        )
    )(pipe(
        logger.log("[DBG] acquire"),
        T.andThen(
            T.tryCatch(() => {
                return readline.createInterface({
                    input: process.stdin,
                    output: process.stdout,
                })
            },
                (error): ReadConsoleError => ({
                    kind: "ReadConsoleError",
                    error: {
                        kind: "ReadConsoleCreateError",
                        error,
                    }
                    ,
                }),
            )),
    )));
});

export const mkConsoleLive = M.succeedWith(() => ({
    _tag: "Console" as const,
    readConsole:
        (prompt: string) =>
            pipe(
                consoleM,
                M.chain((rl) => T.toManaged(pipe(
                    T.tryCatchPromise<ReadConsoleError, string>(
                        () => new Promise((resolve, reject) => {
                            rl.question(prompt, (answer: string) => {
                                // fatal error simulation
                                if (answer.includes('X')) reject('X');
                                return resolve(answer);
                            });
                        }),
                        (error): ReadConsoleError => (
                            {
                                kind: "ReadConsoleError",
                                error: {
                                    kind: "ReadConsoleQuestionError",
                                    error,
                                }
                                ,
                            }
                        ),
                    ),
                    T.tap((answer) =>
                        T.accessServiceM(Logger)((logger) =>
                            logger.log("[DBG] answer", answer))),
                ))),
            ),
    writeConsole:
        (...xs: unknown[]): T.UIO<void> =>
            T.succeedWith(() => console.log(...xs)),
}));

export interface Console extends _A<typeof mkConsoleLive> { }

export const Console = tag<Console>();

export const ConsoleLive = L.fromManaged(Console)(mkConsoleLive);
