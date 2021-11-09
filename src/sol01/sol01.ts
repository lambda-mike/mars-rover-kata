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

export declare const turnLeft: (rover: Rover) => Rover
export declare const turnRight: (rover: Rover) => Rover
export declare const moveForward: (planet: Planet, rover: Rover) => Rover
export declare const moveBackward: (planet: Planet, rover: Rover) => Rover

export declare const mkPlanet: (w: number, h: number) => Planet
export declare const mkRover: (x: number, y: number, dir: Orientation) => Rover
