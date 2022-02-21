import * as L from "@effect-ts/core/Effect/Layer"
import * as M from "@effect-ts/core/Effect/Managed"
import * as T from "@effect-ts/core/Effect"
import type { _A } from "@effect-ts/core/Utils"
import { tag } from "@effect-ts/core/Has"
import {
    Obstacle,
    Planet,
    TravelOutcome,
    renderNav,
    renderPlanet,
    renderTravelOutcome,
    ColourPalette,
} from "./domain";
import {
    writeConsole,
    clearScreenDown,
    cursorTo,
} from "./console";
import { getPalette } from "./colourPalette";


const NAV_WIDTH = 5;
const MAP_LEFT_PAD = " ".repeat(NAV_WIDTH);

const render_ = (
    palette: ColourPalette,
) => (objects: {
    planet: Planet,
    obstacles: ReadonlyArray<Obstacle>,
    outcome: TravelOutcome,
}) => T.gen(function*(_) {
    const {
        planet,
        obstacles,
        outcome,
    } = objects;
    const renderPlanet_ = renderPlanet(planet, obstacles, MAP_LEFT_PAD, palette);
    // Next line after the greeting and empty line is x:0 y:2
    yield* _(cursorTo(0, 2));
    yield* _(clearScreenDown());
    yield* _(writeConsole(renderNav(outcome, palette)));
    yield* _(writeConsole(renderPlanet_(outcome)));
    yield* _(writeConsole(`\nRover position: ${renderTravelOutcome(outcome)}`));
});

export const mkConsoleRendererLive = M.gen(function*(_) {
    const palette = yield* _(getPalette);
    return {
        _tag: "ConsoleRenderer",
        render: render_(palette),
    } as const;
});

export interface ConsoleRenderer extends _A<typeof mkConsoleRendererLive> { }

export const ConsoleRenderer = tag<ConsoleRenderer>();

export const { render } = T.deriveLifted(ConsoleRenderer)(["render"], [], []);

export const ConsoleRendererLive = L.fromManaged(ConsoleRenderer)(mkConsoleRendererLive);
