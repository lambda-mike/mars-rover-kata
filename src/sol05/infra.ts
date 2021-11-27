import * as fs from "node:fs"
import * as readline from "node:readline"
import * as process from "node:process"
import * as As from "@effect-ts/core/Async"
import {
    Logger,
    ReadConsoleError,
    ReadFileError,
} from "@app/sol05/domain";

// TODO accept Logging Service replace console.log with service
export const readFile = (filename: string): As.IO<ReadFileError, string> =>
    As.promise(
        () => new Promise((resolve, reject) => {
            fs.readFile(filename, 'utf8', (err, data) => {
                if (err) {
                    //console.error("[readFile]", err, JSON.stringify(err));
                    reject(err);
                }
                resolve(data.trim());
            });
        }),
        // TODO log error
        (error): ReadFileError => ({
            kind: "ReadFileError",
            filename,
            error,
        }),
    );

// TODO wrap in Managed so it will close the resource automatically
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

export const readConsole =
    (prompt: string): As.IO<ReadConsoleError, string> =>
        As.promise(
            () => new Promise((resolve, reject) => {
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
    (s: string): As.UIO<void> =>
        As.succeedWith(() => console.log(s));

// TODO Write logs to stderr instead ?
const log =
    (...args: unknown[]): As.UIO<void> =>
        As.succeedWith(() => console.log("[LOG]", ...args));

const error =
    (...args: unknown[]): As.UIO<void> =>
        As.succeedWith(() => console.error("[ERR]", ...args));

const warn =
    (...args: unknown[]): As.UIO<void> =>
        As.succeedWith(() => console.warn("[WARN]", ...args));

export const getLogger = (): Logger => ({
    error,
    log,
    warn,
});
