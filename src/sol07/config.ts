import * as L from "@effect-ts/core/Effect/Layer"
import * as M from "@effect-ts/core/Effect/Managed"
import { tag } from "@effect-ts/core/Has"
import type { _A } from "@effect-ts/core/Utils"

export const makeConfigLive = M.succeedWith(() => {
    return {
        _tag: "Config",
        planetFile: "planet.txt",
        roverFile: "rover.txt",
    };
});

export interface Config extends _A<typeof makeConfigLive> { }

export const Config = tag<Config>();

export const ConfigLive = L.fromManaged(Config)(makeConfigLive);
