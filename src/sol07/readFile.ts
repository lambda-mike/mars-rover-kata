import * as fs from "node:fs"
import * as T from "@effect-ts/core/Effect"
import { tag } from "@effect-ts/core/Has"
import * as L from "@effect-ts/core/Effect/Layer"
import type { _A } from "@effect-ts/core/Utils"
import {
    ReadFileError,
} from "./domain";

// TODO can we use lambda gen? is it a thing?
const mkReadFileLive = T.gen(function*(_) {
    // TODO get logger here
    return {
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
    };
});

export interface ReadFile extends _A<typeof mkReadFileLive> { }

export const ReadFile = tag<ReadFile>();

export const { readFile } = T.deriveLifted(ReadFile)(["readFile"], [], []);

export const ReadFileLive = L.fromEffect(ReadFile)(mkReadFileLive);
