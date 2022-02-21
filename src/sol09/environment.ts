import { makeAssociative } from "@effect-ts/core/Associative"
import * as B from "@effect-ts/core/Boolean"
import * as DSL from "@effect-ts/core/Prelude/DSL"
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
        (error) => (new MissingVarEnvironmentError(error)),
    ),
    T.filterOrFail(
        flow(S.isEmpty, B.not),
        () => new EmptyVarEnvironmentError()
    ),
    T.mapError((error): Array<EnvironmentError> =>
        [new EnvironmentError(name, error)]),
);

const EnvErrorsAssoc =
    makeAssociative<Array<EnvironmentError>>((x, y) => [...x, ...y]);
const EnvErrorsValidationApplicative =
    T.getValidationApplicative(EnvErrorsAssoc);

const mkEnvironment = T.succeedWith(() => ({
    _tag: "Environment" as const,
    readEnv: pipe(
        {
            PLANET_FILE: readEnvVar("PLANET_FILE"),
            ROVER_FILE: readEnvVar("ROVER_FILE"),
        },
        DSL.structF(EnvErrorsValidationApplicative),
    ),
}));

// This returns only the first error
const mkEnvironmentSingleErr = T.succeedWith(() => ({
    _tag: "Environment" as const,
    readEnv: pipe(
        T.struct({
            PLANET_FILE: readEnvVar("PLANET_FILE"),
            ROVER_FILE: readEnvVar("ROVER_FILE"),
        }),
    ),
}));

export interface Environment extends _A<typeof mkEnvironment> { }

export const Environment = tag<Environment>();

export const { readEnv } = T.deriveLifted(Environment)([], ["readEnv"], []);

export const EnvironmentLive = L.fromEffect(Environment)(mkEnvironment);
