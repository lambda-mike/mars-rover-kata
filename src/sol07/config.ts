import { tag } from "@effect-ts/core/Has"

export interface Config {
    readonly _tag: "Config";
    readonly planetFile: string;
    readonly roverFile: string;
}

export const Config = tag<Config>();
