import * as readline from "node:readline"
import * as process from "node:process"
import * as T from "@effect-ts/core/Effect"
import {
    ReadConsoleError,
} from "./domain";

// TODO try using Managed with release fn
export const readConsole =
    (prompt: string): T.IO<ReadConsoleError, string> =>
        T.tryCatchPromise(
            () => new Promise((resolve, reject) => {
                const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout,
                });
                rl.question(prompt, (answer: string) => {
                    // fatal error simulation
                    if (answer.includes('X')) reject('X');
                    rl.close();
                    return resolve(answer);
                });
            }),
            (err): ReadConsoleError => ({
                kind: "ReadConsoleError",
                error: err,
            }));

export const writeConsole =
    (s: string): T.UIO<void> =>
        T.succeedWith(() => console.log(s));
