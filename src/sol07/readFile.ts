import * as fs from "node:fs"
import * as T from "@effect-ts/core/Effect"
import { tag } from "@effect-ts/core/Has"
import * as L from "@effect-ts/core/Effect/Layer"
import {
    ReadFileError,
} from "./domain";

export interface ReadFile {
    _tag: "ReadFile";
    readFile: (filename: string) => T.IO<ReadFileError, string>;
}

export const ReadFile = tag<ReadFile>();

export const { readFile } = T.deriveLifted(ReadFile)(["readFile"], [], []);

// TODO rewrite to get logger service
export const ReadFileLive = L.pure(ReadFile)({
    _tag: "ReadFile",
    readFile: (filename: string): T.IO<ReadFileError, string> =>
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
        ),
});
