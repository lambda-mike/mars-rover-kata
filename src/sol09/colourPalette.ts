import * as L from "@effect-ts/core/Effect/Layer"
import * as M from "@effect-ts/core/Effect/Managed"
import * as T from "@effect-ts/core/Effect"
import type { _A } from "@effect-ts/core/Utils"
import { tag } from "@effect-ts/core/Has"
import {
    ColourPalette,
    emptyPalette,
} from "./domain";


const RESET = "\x1b[0m";
const RED = "\x1b[31m";
const BLUE = "\x1b[34m";
const YELLOW = "\x1b[33m";
const MAGENTA = "\x1b[35m";
const WHITE = "\x1b[37m";
const GREEN = "\x1b[32m";
const ORANGE = "\x1b[38;2;252;127;0m";

const getPalette_ = T.succeedWith((): ColourPalette => {
    return {
        resetCode: RESET,
        roverColour: YELLOW,
        roverHitColour: MAGENTA,
        obstacleColour: ORANGE,
        terrainColour: RED,
        navColour: GREEN,
    } as const;
});

export const mkColourPaletteServiceLive = M.succeedWith(() => ({
    _tag: "ColourPaletteService",
    getPalette: getPalette_,
} as const));

export interface ColourPaletteService extends _A<typeof mkColourPaletteServiceLive> { }

export const ColourPaletteService = tag<ColourPaletteService>();

export const { getPalette } = T.deriveLifted(ColourPaletteService)([], ["getPalette"], []);

export const ColourPaletteServiceLive =
    L.fromManaged(ColourPaletteService)(mkColourPaletteServiceLive);

export const mkEmptyColourPaletteServiceLive = M.succeedWith(() => ({
    _tag: "ColourPaletteService",
    getPalette: T.succeedWith(() => emptyPalette),
} as const));

export const EmptyColourPaletteServiceLive =
    L.fromManaged(ColourPaletteService)(mkEmptyColourPaletteServiceLive);
