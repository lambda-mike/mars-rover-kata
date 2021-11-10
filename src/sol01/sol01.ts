export interface Planet {
    readonly width: number;
    readonly height: number;
}

export enum Orientation {
    "N",
    "E",
    "S",
    "W",
}

export interface Rover {
    readonly x: number;
    readonly y: number;
    readonly orientation: Orientation;
}

export const turnLeft = (rover: Rover): Rover => {
    switch (rover.orientation) {
        case Orientation.N:
            return { ...rover, orientation: Orientation.W };
        case Orientation.W:
            return { ...rover, orientation: Orientation.S };
        case Orientation.S:
            return { ...rover, orientation: Orientation.E };
        case Orientation.E:
            return { ...rover, orientation: Orientation.N };
    }
}

export declare const turnRight: (rover: Rover) => Rover
export declare const moveForward: (planet: Planet, rover: Rover) => Rover
export declare const moveBackward: (planet: Planet, rover: Rover) => Rover

export declare const mkPlanet: (w: number, h: number) => Planet
export declare const mkRover: (x: number, y: number, dir: Orientation) => Rover
