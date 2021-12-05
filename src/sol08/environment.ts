import * as B from "@effect-ts/core/Boolean"
import * as L from "@effect-ts/core/Effect/Layer"
import * as S from "@effect-ts/core/String"
import * as T from "@effect-ts/core/Effect"
import * as process from "node:process"
import type { _A } from "@effect-ts/core/Utils"
import { flow, pipe } from "@effect-ts/core/Function"
import { tag } from "@effect-ts/core/Has"
import {
    EmptyVarEnvironmentError,
    EnvironmentError,
    MissingVarEnvironmentError,
} from "./domain";


const readEnvVar = (name: string) => pipe(
    T.tryCatch(
        () => process.env[name] ?? "",
        (error): MissingVarEnvironmentError => ({
            kind: "MissingVarEnvironmentError",
            error,
        }),
    ),
    T.filterOrFail(flow(S.isEmpty, B.not), (): EmptyVarEnvironmentError => ({
        kind: "EmptyVarEnvironmentError",
    })),
    T.mapError((error): EnvironmentError => ({
        kind: "EnvironmentError",
        error,
        name,
    })),
);

// TODO capture all elements in parallel, return list of errors (non empty?)
//T.getValidationApplicative()
const mkEnvironment = T.succeedWith(() => ({
    _tag: "Environment" as const,
    readEnv: pipe(
        T.do,
        T.bindAllPar(() => ({
            PLANET_FILE: readEnvVar("PLANET_FILE"),
            ROVER_FILE: readEnvVar("ROVER_FILE"),
        })),
    ),
}));

export interface Environment extends _A<typeof mkEnvironment> { }

export const Environment = tag<Environment>();

export const { readEnv } = T.deriveLifted(Environment)([], ["readEnv"], []);

export const EnvironmentLive = L.fromEffect(Environment)(mkEnvironment);
