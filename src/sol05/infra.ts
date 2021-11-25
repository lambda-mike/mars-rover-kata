import * as fs from "node:fs"
import * as path from "node:path"
import * as readline from "node:readline"
import * as process from "node:process"
import * as A from "@effect-ts/core/Collections/Immutable/Array"
import * as As from "@effect-ts/core/Async"
import * as E from "@effect-ts/core/Either"
import { makeAssociative } from "@effect-ts/core/Associative"
import { pipe, flow } from "@effect-ts/core/Function"
import {
    ReadConsoleError,
    ReadFileError,
} from "@app/sol04/domain";

// TODO accept Logging Service replace console.log with service
export const readFile = (filename: string): As.IO<ReadFileError, string> =>
    As.promise(
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

// TODO wrap in Managed so it will close the resource automatically
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    // history: ["\n"],
    // terminal: true,
    // removeHistoryDuplicates: true,
});

export const readConsole =
    (prompt: string): As.IO<ReadConsoleError, string> =>
        As.promise(
            () => new Promise((resolve, reject) => {
                rl.question(prompt, (answer: string) => {
                    if (answer.includes('X')) reject('X');
                    rl.close();
                    return resolve(answer);
                });
            }),
            (err): ReadConsoleError => ({
                kind: "ReadConsoleError",
                error: err,
            }));
//const rl = readline.createInterface(process.stdin);

// TODO add infra object

const log =
    (...args: unknown[]): As.UIO<void> =>
        As.succeedWith(() => console.log(...args));

const error =
    (...args: unknown[]): As.UIO<void> =>
        As.succeedWith(() => console.error(...args));

export const logger = {
    log,
    error,
}
