import * as E from "@effect-ts/core/Either"
import { Orientation } from "../src/sol01/api";
import * as Sol3 from "../src/sol03/domain";

describe("Mars Kata", () => {
  describe("Sol03", () => {
    describe("mkPlanet", () => {
      it("should create the planet given correct size", async () => {
        const w = 3;
        const h = 4;
        const mars = Sol3.mkPlanet(w, h);
        expect(mars).toStrictEqual(E.right({ width: w, height: h }));
      });
      it("should return error given incorrect size", async () => {
        const w = 0;
        const h = -3;
        const mars = Sol3.mkPlanet(w, h);
        expect(mars).toStrictEqual(E.left(new Error("width and height must be positive numbers!")));
      });
    });
    describe("mkRover", () => {
      it("should create the rover given correct coordinates", async () => {
        const x = 1;
        const y = 2;
        const dir = Sol3.Orientation.N;
        const rover = Sol3.mkRover(x, y, dir);
        expect(rover).toStrictEqual(E.right({ x, y, orientation: dir }));
      });
      it("should return error given incorrect coordinates", async () => {
        const x = -1;
        const y = -2;
        const dir = Sol3.Orientation.N;
        const rover = Sol3.mkRover(x, y, dir);
        expect(rover).toStrictEqual(E.left(new Error("Coordinates must not be negative numbers!")));
      });
    });
    describe("turnLeft", () => {
      const x = 1;
      const y = 1;
      it("should head W if given N", async () => {
        const dir = Sol3.Orientation.N;
        const rover: Sol3.Rover = { x, y, orientation: dir };
        const result = Sol3.turnLeft(rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(Sol3.Orientation.W);
      });
      it("should head S if given W", async () => {
        const dir = Sol3.Orientation.W;
        const rover: Sol3.Rover = { x, y, orientation: dir };
        const result = Sol3.turnLeft(rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(Sol3.Orientation.S);
      });
      it("should head E if given S", async () => {
        const dir = Sol3.Orientation.S;
        const rover: Sol3.Rover = { x, y, orientation: dir };
        const result = Sol3.turnLeft(rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(Sol3.Orientation.E);
      });
      it("should head N if given E", async () => {
        const dir = Sol3.Orientation.E;
        const rover: Sol3.Rover = { x, y, orientation: dir };
        const result = Sol3.turnLeft(rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(Sol3.Orientation.N);
      });
    });
    describe("turnRight", () => {
      const x = 1;
      const y = 1;
      it("should head E if given N", async () => {
        const dir = Sol3.Orientation.N;
        const rover: Sol3.Rover = { x, y, orientation: dir };
        const result = Sol3.turnRight(rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(Sol3.Orientation.E);
      });
      it("should head S if given E", async () => {
        const dir = Sol3.Orientation.E;
        const rover: Sol3.Rover = { x, y, orientation: dir };
        const result = Sol3.turnRight(rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(Sol3.Orientation.S);
      });
      it("should head W if given S", async () => {
        const dir = Sol3.Orientation.S;
        const rover: Sol3.Rover = { x, y, orientation: dir };
        const result = Sol3.turnRight(rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(Sol3.Orientation.W);
      });
      it("should head N if given W", async () => {
        const dir = Sol3.Orientation.W;
        const rover: Sol3.Rover = { x, y, orientation: dir };
        const result = Sol3.turnRight(rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(Sol3.Orientation.N);
      });
    });
    describe("moveForward", () => {
      const mars: Sol3.Planet = { width: 3, height: 4 };
      const x = 1;
      const y = 1;
      it("should move forward in N dir", async () => {
        const dir = Sol3.Orientation.N;
        const rover: Sol3.Rover = { x, y, orientation: dir };
        const result = Sol3.moveForward(mars, rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y + 1);
        expect(result.orientation).toBe(dir);
      });
      it("should move forward in E dir", async () => {
        const dir = Sol3.Orientation.E;
        const rover: Sol3.Rover = { x, y, orientation: dir };
        const result = Sol3.moveForward(mars, rover);
        expect(result.x).toBe(x + 1);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(dir);
      });
      it("should move forward in S dir", async () => {
        const dir = Sol3.Orientation.S;
        const rover: Sol3.Rover = { x, y, orientation: dir };
        const result = Sol3.moveForward(mars, rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y - 1);
        expect(result.orientation).toBe(dir);
      });
      it("should move forward in W dir", async () => {
        const dir = Sol3.Orientation.W;
        const rover: Sol3.Rover = { x, y, orientation: dir };
        const result = Sol3.moveForward(mars, rover);
        expect(result.x).toBe(x - 1);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(dir);
      });
      it("should wrap when going in N dir", async () => {
        const dir = Sol3.Orientation.N;
        const rover: Sol3.Rover = { x, y: mars.height - 1, orientation: dir };
        const result = Sol3.moveForward(mars, rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(0);
        expect(result.orientation).toBe(dir);
      });
      it("should wrap when going in E dir", async () => {
        const dir = Sol3.Orientation.E;
        const rover: Sol3.Rover = { x: mars.width - 1, y, orientation: dir };
        const result = Sol3.moveForward(mars, rover);
        expect(result.x).toBe(0);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(dir);
      });
      it("should wrap when going in S dir", async () => {
        const dir = Sol3.Orientation.S;
        const rover: Sol3.Rover = { x, y: 0, orientation: dir };
        const result = Sol3.moveForward(mars, rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(mars.height - 1);
        expect(result.orientation).toBe(dir);
      });
      it("should wrap when going in W dir", async () => {
        const dir = Sol3.Orientation.W;
        const rover: Sol3.Rover = { x: 0, y, orientation: dir };
        const result = Sol3.moveForward(mars, rover);
        expect(result.x).toBe(mars.width - 1);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(dir);
      });
    });
    describe("moveBackward", () => {
      const mars: Sol3.Planet = { width: 3, height: 4 };
      const x = 1;
      const y = 1;
      it("should move backward in N dir", async () => {
        const dir = Sol3.Orientation.S;
        const rover: Sol3.Rover = { x, y, orientation: dir };
        const result = Sol3.moveBackward(mars, rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y + 1);
        expect(result.orientation).toBe(dir);
      });
      it("should move backward in E dir", async () => {
        const dir = Sol3.Orientation.W;
        const rover: Sol3.Rover = { x, y, orientation: dir };
        const result = Sol3.moveBackward(mars, rover);
        expect(result.x).toBe(x + 1);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(dir);
      });
      it("should move backward in S dir", async () => {
        const dir = Sol3.Orientation.N;
        const rover: Sol3.Rover = { x, y, orientation: dir };
        const result = Sol3.moveBackward(mars, rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y - 1);
        expect(result.orientation).toBe(dir);
      });
      it("should move backward in W dir", async () => {
        const dir = Sol3.Orientation.E;
        const rover: Sol3.Rover = { x, y, orientation: dir };
        const result = Sol3.moveBackward(mars, rover);
        expect(result.x).toBe(x - 1);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(dir);
      });
      it("should wrap when going in N dir", async () => {
        const dir = Sol3.Orientation.S;
        const rover: Sol3.Rover = { x, y: mars.height - 1, orientation: dir };
        const result = Sol3.moveBackward(mars, rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(0);
        expect(result.orientation).toBe(dir);
      });
      it("should wrap when going in E dir", async () => {
        const dir = Sol3.Orientation.W;
        const rover: Sol3.Rover = { x: mars.width - 1, y, orientation: dir };
        const result = Sol3.moveBackward(mars, rover);
        expect(result.x).toBe(0);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(dir);
      });
      it("should wrap when going in S dir", async () => {
        const dir = Sol3.Orientation.N;
        const rover: Sol3.Rover = { x, y: 0, orientation: dir };
        const result = Sol3.moveBackward(mars, rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(mars.height - 1);
        expect(result.orientation).toBe(dir);
      });
      it("should wrap when going in W dir", async () => {
        const dir = Sol3.Orientation.E;
        const rover: Sol3.Rover = { x: 0, y, orientation: dir };
        const result = Sol3.moveBackward(mars, rover);
        expect(result.x).toBe(mars.width - 1);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(dir);
      });
    });
    describe("move", () => {
      const mars: Sol3.Planet = { width: 3, height: 4 };
      const x = 1;
      const y = 1;
      const dir = Sol3.Orientation.N;
      const rover: Sol3.Rover = { x, y, orientation: dir };
      const obstacles: Array<Sol3.Obstacle> =
        [{ pos: { x: 2, y: 1 } }, { pos: { x: 3, y: 3 } }];
      it("should go forward", async () => {
        const result = Sol3.move(mars, rover, obstacles, Sol3.Cmd.F);
        expect(result.kind).toBe("Normal");
        expect(result.rover.x).toBe(x);
        expect(result.rover.y).toBe(y + 1);
        expect(result.rover.orientation).toBe(dir);
      });
      it("should go backward", async () => {
        const result = Sol3.move(mars, rover, obstacles, Sol3.Cmd.B);
        expect(result.kind).toBe("Normal");
        expect(result.rover.x).toBe(x);
        expect(result.rover.y).toBe(y - 1);
        expect(result.rover.orientation).toBe(dir);
      });
      it("should turn left", async () => {
        const result = Sol3.move(mars, rover, obstacles, Sol3.Cmd.L);
        expect(result.kind).toBe("Normal");
        expect(result.rover.x).toBe(x);
        expect(result.rover.y).toBe(y);
        expect(result.rover.orientation).toBe(Orientation.W);
      });
      it("should turn right", async () => {
        const result = Sol3.move(mars, rover, obstacles, Sol3.Cmd.R);
        expect(result.kind).toBe("Normal");
        expect(result.rover.x).toBe(x);
        expect(result.rover.y).toBe(y);
        expect(result.rover.orientation).toBe(Orientation.E);
      });
      it("should not hit obstacle when going forward", async () => {
        const orientation = Orientation.E;
        const result = Sol3.move(mars, { ...rover, orientation }, obstacles, Sol3.Cmd.F);
        expect(result.kind).toBe("Hit");
        expect(result.rover.x).toBe(x);
        expect(result.rover.y).toBe(y);
        expect(result.rover.orientation).toBe(orientation);
      });
      it("should not hit obstacle when going backwards", async () => {
        const orientation = Orientation.W;
        const result = Sol3.move(mars, { ...rover, orientation }, obstacles, Sol3.Cmd.B);
        expect(result.kind).toBe("Hit");
        expect(result.rover.x).toBe(x);
        expect(result.rover.y).toBe(y);
        expect(result.rover.orientation).toBe(orientation);
      });
    });
    describe("travel", () => {
      const mars: Sol3.Planet = { width: 3, height: 4 };
      const x = 1;
      const y = 1;
      const dir = Sol3.Orientation.N;
      const rover: Sol3.Rover = { x, y, orientation: dir };
      const obstacles: Array<Sol3.Obstacle> =
        [{ pos: { x: 2, y: 1 } }, { pos: { x: 2, y: 3 } }];
      it("should finish travel when did not hit obstacle", async () => {
        const cmds: Array<Sol3.Cmd> = [
          Sol3.Cmd.F,
          Sol3.Cmd.R,
          Sol3.Cmd.F,
          Sol3.Cmd.F,
          Sol3.Cmd.F,
          Sol3.Cmd.R,
          Sol3.Cmd.F,
          Sol3.Cmd.F,
          Sol3.Cmd.L,
        ];
        const result = Sol3.travel(mars, rover, obstacles, cmds);
        expect(result.kind).toBe("Normal");
        expect(result.rover.x).toBe(1);
        expect(result.rover.y).toBe(0);
        expect(result.rover.orientation).toBe(Sol3.Orientation.E);
      });
      it("should abort travel when hit obstacle", async () => {
        const cmds: Array<Sol3.Cmd> = [
          Sol3.Cmd.F,
          Sol3.Cmd.R,
          Sol3.Cmd.F,
          Sol3.Cmd.L,
          Sol3.Cmd.F,
          Sol3.Cmd.R,
          Sol3.Cmd.F,
          Sol3.Cmd.F,
          Sol3.Cmd.L,
        ];
        const result = Sol3.travel(mars, rover, obstacles, cmds);
        expect(result.kind).toBe("Hit");
        expect(result.rover.x).toBe(2);
        expect(result.rover.y).toBe(2);
        expect(result.rover.orientation).toBe(Sol3.Orientation.N);
      });
    });
  });
});
