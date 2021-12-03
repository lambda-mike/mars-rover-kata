import * as L from "@effect-ts/core/Effect/Layer"
import * as M from "@effect-ts/core/Effect/Managed"
import * as T from "@effect-ts/core/Effect"
import * as process from "node:process"
import * as readline from "node:readline"
import type { _A } from "@effect-ts/core/Utils"
import { tag } from "@effect-ts/core/Has"
import { pipe } from "@effect-ts/core"
import {
    ReadConsoleError,
} from "./domain";

// TODO add subtypes: acquire error
// TODO add proper logger service
const consoleM = M.make(
    (rl: readline.Interface) => T.succeedWith(() => {
        console.log("[DBG] close");
        rl.close();
    })
)(T.tryCatch(() => {
    console.log("[DBG] acquire");
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })
},
    (error): ReadConsoleError => ({
        kind: "ReadConsoleError",
        error,
    })));

// TODO add proper logger service
export const mkConsoleLive = M.succeedWith(() => ({
    _tag: "Console" as const,
    readConsole:
        (prompt: string) => pipe(
            consoleM,
            M.chain((rl) => T.toManaged(
                T.tryCatchPromise<ReadConsoleError, string>(
                    () => new Promise((resolve, reject) => {
                        rl.question(prompt, (answer: string) => {
                            // fatal error simulation
                            console.log("[DBG] answer", answer);
                            if (answer.includes('X')) reject('X');
                            return resolve(answer);
                        });
                    }),
                    (err): ReadConsoleError => ({
                        kind: "ReadConsoleError",
                        error: err,
                    }),
                ),
            )),
        ),
}));

export interface Console extends _A<typeof mkConsoleLive> { }

export const Console = tag<Console>();

export const ConsoleLive = L.fromManaged(Console)(mkConsoleLive);
