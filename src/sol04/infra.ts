import * as A from "@effect-ts/core/Collections/Immutable/Array"
import * as As from "@effect-ts/core/Async"
import * as E from "@effect-ts/core/Either"
import { makeAssociative } from "@effect-ts/core/Associative"
import { pipe, flow } from "@effect-ts/core/Function"
import {

} from "@app/sol04/domain";

export declare const readFile: (filename: string) => As.IO<Error, string>;
export declare const readConsole: () => As.IO<Error, string>;
