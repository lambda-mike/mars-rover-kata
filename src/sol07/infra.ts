import * as fs from "node:fs"
import * as readline from "node:readline"
import * as process from "node:process"
import * as T from "@effect-ts/core/Effect"
import {
    ReadConsoleError,
    ReadFileError,
} from "./domain";

// TODO accept Logging Service replace console.log with service
export const readFile = (filename: string): T.IO<ReadFileError, string> =>
    T.tryCatchPromise(
        () => new Promise((resolve, reject) => {
            fs.readFile(filename, 'utf8', (err, data) => {
                if (err) {
                    //console.error("[readFile]", err, JSON.stringify(err));
                    return reject(err);
                }
                return resolve(data.trim());
            });
        }),
        // TODO log error
        (error): ReadFileError => ({
            kind: "ReadFileError",
            filename,
            error,
        }),
    );

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
