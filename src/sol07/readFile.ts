import * as fs from "node:fs"
import * as T from "@effect-ts/core/Effect"
import { Has, tag } from "@effect-ts/core/Has"
import * as L from "@effect-ts/core/Effect/Layer"
import { pipe } from "@effect-ts/core"
import type { _A } from "@effect-ts/core/Utils"
import {
    ReadFileError,
} from "./domain";
import { Logger } from "./logger";

const mkReadFileLive = T.gen(function*(_) {
    const logger = yield* _(Logger);
    yield* _(logger.log("[readFile] make"));
    return {
        _tag: "ReadFile",
        readFile: (filename: string): T.Effect<Has<Logger>, ReadFileError, string> => T.gen(function*(_) {
            const logger = yield* _(Logger);
            return yield* _(pipe(
                T.tryCatchPromise<ReadFileError, string>(
                    () => new Promise((resolve, reject) => {
                        fs.readFile(filename, 'utf8', (err, data) => {
                            if (err) {
                                logger.error("[readFile]", err, JSON.stringify(err));
                                return reject(err);
                            }
                            return resolve(data.trim());
                        });
                    }),
                    (error): ReadFileError => ({
                        kind: "ReadFileError",
                        filename,
                        error,
                    }),
                ),
                T.tapBoth(
                    (err) => logger.error("[readFile]", err),
                    (x) => logger.log("[readFile]", x),
                ),
            ));
        }),
    };
});

export interface ReadFile extends _A<typeof mkReadFileLive> { }

export const ReadFile = tag<ReadFile>();

export const { readFile } = T.deriveLifted(ReadFile)(["readFile"], [], []);

export const ReadFileLive = L.fromEffect(ReadFile)(mkReadFileLive);
