import * as L from "@effect-ts/core/Effect/Layer"
import * as M from "@effect-ts/core/Effect/Managed"
import * as T from "@effect-ts/core/Effect"
import * as process from "node:process"
import * as readline from "node:readline"
import type { _A } from "@effect-ts/core/Utils"
import { Has, tag } from "@effect-ts/core/Has"
import { pipe } from "@effect-ts/core"
import {
    IReadline,
    ReadConsoleError,
} from "./domain";
import { Logger } from "./logger";


const consoleM: M.Managed<
    Has<Logger>,
    ReadConsoleError,
    IReadline
> = M.gen(function*(_) {
    const logger = yield* _(Logger);
    return yield* _(M.make(
        ({ readLine }: IReadline) => pipe(
            T.gen(function*(_) {
                yield* _(logger.log("[DBG] close"));
                readLine.close();
                return;
            }),
            // result is ignored by M.make
            T.result,
        )
    )(pipe(
        logger.log("[DBG] acquire"),
        T.andThen(
            T.tryCatch(() => {
                // Uncomment to test defects handling
                //throw "test";
                return {
                    readLine: readline.createInterface({
                        input: process.stdin,
                        output: process.stdout,
                    }),
                };
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

// Just example how to use T.bracket
const useConsole =
    <R, E, A>(
        effect: T.Effect<R & IReadline, E, A>
    ): T.Effect<R, E | ReadConsoleError, A> =>
        T.bracket_(
            T.tryCatchPromise(async () => {
                return {
                    readLine:
                        readline.createInterface({
                            input: process.stdin,
                            output: process.stdout,
                        })
                };
            },
                (error): ReadConsoleError => ({
                    kind: "ReadConsoleError",
                    error: {
                        kind: "ReadConsoleCreateError",
                        error,
                    }
                    ,
                }),
            ),
            (rl) => pipe(
                effect,
                T.provide(rl),
            ),
            ({ readLine }) => T.succeedWith(() => readLine.close()),
        );

const _readConsole = (prompt: string) => pipe(
    T.accessM(({ readLine }: IReadline) => pipe(
        T.tryCatchPromise<ReadConsoleError, string>(
            () => new Promise((resolve, reject) => {
                readLine.question(prompt, (answer: string) => {
                    // error simulation
                    if (answer.includes('X')) reject('X');
                    // defect simulation but outside of app context
                    // due to being in callback
                    if (answer.includes('Q')) throw "Boom!"
                    return resolve(answer);
                });
            }),
            (error): ReadConsoleError => (
                {
                    kind: "ReadConsoleError",
                    error: {
                        kind: "ReadConsoleQuestionError",
                        error,
                    },
                }
            ),
        ),
        T.tap((answer) =>
            T.accessServiceM(Logger)((logger) =>
                logger.log("[DBG] answer", answer))),
    ))
);

export const mkConsoleLive = M.succeedWith(() => ({
    _tag: "Console" as const,
    consoleM,
    useConsole,
    readConsole: _readConsole,
    writeConsole:
        (...xs: unknown[]) =>
            T.succeedWith(() => console.log(...xs)),
    clearConsole:
        () => T.succeedWith(() => console.clear()),
    clearScreenDown:
        () => T.promise(() => new Promise((resolve) => {
            process.stdout.clearScreenDown(() => resolve(undefined));
        })),
    cursorTo:
        (x: number, y?: number | undefined) => T.promise(() => new Promise((resolve) => {
            process.stdout.cursorTo(x, y, () => resolve(undefined));
        })),
    moveCursor:
        (dx: number, dy: number) => T.promise(() => new Promise((resolve) => {
            process.stdout.moveCursor(dx, dy, () => resolve(undefined));
        })),
}));

export interface Console extends _A<typeof mkConsoleLive> { }

export const Console = tag<Console>();

export const {
    readConsole,
    writeConsole,
    clearConsole,
    clearScreenDown,
    cursorTo,
    moveCursor,
} = T.deriveLifted(Console)([
    "readConsole",
    "writeConsole",
    "clearConsole",
    "clearScreenDown",
    "cursorTo",
    "moveCursor",
], [], []);

export const ConsoleLive = L.fromManaged(Console)(mkConsoleLive);
