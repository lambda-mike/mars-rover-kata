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
            filename,
            error,
        }),
    );

export declare const readConsole: () => As.IO<Error, string>;
  //const rl = readline.createInterface(process.stdin);
