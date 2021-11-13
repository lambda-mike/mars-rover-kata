import { Orientation } from "../src/sol01/api";
import * as Sol2 from "../src/sol02/domain";

describe("Mars Kata", () => {
  describe("Sol02", () => {
    describe("mkPlanet", () => {
      it("should create the planet", async () => {
        const w = 3;
        const h = 4;
        const mars = Sol2.mkPlanet(w, h);
        expect(mars.width).toBe(w);
        expect(mars.height).toBe(h);
      });
    });
    describe("mkRover", () => {
      it("should create the rover", async () => {
        const x = 1;
        const y = 2;
        const dir = Sol2.Orientation.N;
        const rover = Sol2.mkRover(x, y, dir);
        expect(rover.x).toBe(x);
        expect(rover.y).toBe(y);
        expect(rover.orientation).toBe(dir);
      });
    });
    describe("turnLeft", () => {
      const x = 1;
      const y = 1;
      it("should head W if given N", async () => {
        const dir = Sol2.Orientation.N;
        const rover = Sol2.mkRover(x, y, dir);
        const result = Sol2.turnLeft(rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(Sol2.Orientation.W);
      });
      it("should head S if given W", async () => {
        const dir = Sol2.Orientation.W;
        const rover = Sol2.mkRover(x, y, dir);
        const result = Sol2.turnLeft(rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(Sol2.Orientation.S);
      });
      it("should head E if given S", async () => {
        const dir = Sol2.Orientation.S;
        const rover = Sol2.mkRover(x, y, dir);
        const result = Sol2.turnLeft(rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(Sol2.Orientation.E);
      });
      it("should head N if given E", async () => {
        const dir = Sol2.Orientation.E;
        const rover = Sol2.mkRover(x, y, dir);
        const result = Sol2.turnLeft(rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(Sol2.Orientation.N);
      });
    });
    describe("turnRight", () => {
      const x = 1;
      const y = 1;
      it("should head E if given N", async () => {
        const dir = Sol2.Orientation.N;
        const rover = Sol2.mkRover(x, y, dir);
        const result = Sol2.turnRight(rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(Sol2.Orientation.E);
      });
      it("should head S if given E", async () => {
        const dir = Sol2.Orientation.E;
        const rover = Sol2.mkRover(x, y, dir);
        const result = Sol2.turnRight(rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(Sol2.Orientation.S);
      });
      it("should head W if given S", async () => {
        const dir = Sol2.Orientation.S;
        const rover = Sol2.mkRover(x, y, dir);
        const result = Sol2.turnRight(rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(Sol2.Orientation.W);
      });
      it("should head N if given W", async () => {
        const dir = Sol2.Orientation.W;
        const rover = Sol2.mkRover(x, y, dir);
        const result = Sol2.turnRight(rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(Sol2.Orientation.N);
      });
    });
    describe("moveForward", () => {
      const mars = Sol2.mkPlanet(3, 4);
      const x = 1;
      const y = 1;
      it("should move forward in N dir", async () => {
        const dir = Sol2.Orientation.N;
        const rover = Sol2.mkRover(x, y, dir);
        const result = Sol2.moveForward(mars, rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y + 1);
        expect(result.orientation).toBe(dir);
      });
      it("should move forward in E dir", async () => {
        const dir = Sol2.Orientation.E;
        const rover = Sol2.mkRover(x, y, dir);
        const result = Sol2.moveForward(mars, rover);
        expect(result.x).toBe(x + 1);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(dir);
      });
      it("should move forward in S dir", async () => {
        const dir = Sol2.Orientation.S;
        const rover = Sol2.mkRover(x, y, dir);
        const result = Sol2.moveForward(mars, rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y - 1);
        expect(result.orientation).toBe(dir);
      });
      it("should move forward in W dir", async () => {
        const dir = Sol2.Orientation.W;
        const rover = Sol2.mkRover(x, y, dir);
        const result = Sol2.moveForward(mars, rover);
        expect(result.x).toBe(x - 1);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(dir);
      });
      it("should wrap when going in N dir", async () => {
        const dir = Sol2.Orientation.N;
        const rover = Sol2.mkRover(x, mars.height - 1, dir);
        const result = Sol2.moveForward(mars, rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(0);
        expect(result.orientation).toBe(dir);
      });
      it("should wrap when going in E dir", async () => {
        const dir = Sol2.Orientation.E;
        const rover = Sol2.mkRover(mars.width - 1, y, dir);
        const result = Sol2.moveForward(mars, rover);
        expect(result.x).toBe(0);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(dir);
      });
      it("should wrap when going in S dir", async () => {
        const dir = Sol2.Orientation.S;
        const rover = Sol2.mkRover(x, 0, dir);
        const result = Sol2.moveForward(mars, rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(mars.height - 1);
        expect(result.orientation).toBe(dir);
      });
      it("should wrap when going in W dir", async () => {
        const dir = Sol2.Orientation.W;
        const rover = Sol2.mkRover(0, y, dir);
        const result = Sol2.moveForward(mars, rover);
        expect(result.x).toBe(mars.width - 1);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(dir);
      });
    });
    describe("moveBackward", () => {
      const mars = Sol2.mkPlanet(3, 4);
      const x = 1;
      const y = 1;
      it("should move backward in N dir", async () => {
        const dir = Sol2.Orientation.S;
        const rover = Sol2.mkRover(x, y, dir);
        const result = Sol2.moveBackward(mars, rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y + 1);
        expect(result.orientation).toBe(dir);
      });
      it("should move backward in E dir", async () => {
        const dir = Sol2.Orientation.W;
        const rover = Sol2.mkRover(x, y, dir);
        const result = Sol2.moveBackward(mars, rover);
        expect(result.x).toBe(x + 1);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(dir);
      });
      it("should move backward in S dir", async () => {
        const dir = Sol2.Orientation.N;
        const rover = Sol2.mkRover(x, y, dir);
        const result = Sol2.moveBackward(mars, rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y - 1);
        expect(result.orientation).toBe(dir);
      });
      it("should move backward in W dir", async () => {
        const dir = Sol2.Orientation.E;
        const rover = Sol2.mkRover(x, y, dir);
        const result = Sol2.moveBackward(mars, rover);
        expect(result.x).toBe(x - 1);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(dir);
      });
      it("should wrap when going in N dir", async () => {
        const dir = Sol2.Orientation.S;
        const rover = Sol2.mkRover(x, mars.height - 1, dir);
        const result = Sol2.moveBackward(mars, rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(0);
        expect(result.orientation).toBe(dir);
      });
      it("should wrap when going in E dir", async () => {
        const dir = Sol2.Orientation.W;
        const rover = Sol2.mkRover(mars.width - 1, y, dir);
        const result = Sol2.moveBackward(mars, rover);
        expect(result.x).toBe(0);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(dir);
      });
      it("should wrap when going in S dir", async () => {
        const dir = Sol2.Orientation.N;
        const rover = Sol2.mkRover(x, 0, dir);
        const result = Sol2.moveBackward(mars, rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(mars.height - 1);
        expect(result.orientation).toBe(dir);
      });
      it("should wrap when going in W dir", async () => {
        const dir = Sol2.Orientation.E;
        const rover = Sol2.mkRover(0, y, dir);
        const result = Sol2.moveBackward(mars, rover);
        expect(result.x).toBe(mars.width - 1);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(dir);
      });
    });
    describe("move", () => {
      const mars = Sol2.mkPlanet(3, 4);
      const x = 1;
      const y = 1;
      const dir = Sol2.Orientation.N;
      const rover = Sol2.mkRover(x, y, dir);
      const obstacles: Array<Sol2.Obstacle> =
        [{ pos: { x: 2, y: 1 } }, { pos: { x: 3, y: 3 } }];
      it("should go forward", async () => {
        const result = Sol2.move(mars, rover, obstacles, Sol2.Cmd.F);
        expect(result.kind).toBe("Normal");
        expect(result.rover.x).toBe(x);
        expect(result.rover.y).toBe(y + 1);
        expect(result.rover.orientation).toBe(dir);
      });
      it("should go backward", async () => {
        const result = Sol2.move(mars, rover, obstacles, Sol2.Cmd.B);
        expect(result.kind).toBe("Normal");
        expect(result.rover.x).toBe(x);
        expect(result.rover.y).toBe(y - 1);
        expect(result.rover.orientation).toBe(dir);
      });
      it("should turn left", async () => {
        const result = Sol2.move(mars, rover, obstacles, Sol2.Cmd.L);
        expect(result.kind).toBe("Normal");
        expect(result.rover.x).toBe(x);
        expect(result.rover.y).toBe(y);
        expect(result.rover.orientation).toBe(Orientation.W);
      });
      it("should turn right", async () => {
        const result = Sol2.move(mars, rover, obstacles, Sol2.Cmd.R);
        expect(result.kind).toBe("Normal");
        expect(result.rover.x).toBe(x);
        expect(result.rover.y).toBe(y);
        expect(result.rover.orientation).toBe(Orientation.E);
      });
      it("should not hit obstacle when going forward", async () => {
        const orientation = Orientation.E;
        const result = Sol2.move(mars, { ...rover, orientation }, obstacles, Sol2.Cmd.F);
        expect(result.kind).toBe("Hit");
        expect(result.rover.x).toBe(x);
        expect(result.rover.y).toBe(y);
        expect(result.rover.orientation).toBe(orientation);
      });
      it("should not hit obstacle when going backwards", async () => {
        const orientation = Orientation.W;
        const result = Sol2.move(mars, { ...rover, orientation }, obstacles, Sol2.Cmd.B);
        expect(result.kind).toBe("Hit");
        expect(result.rover.x).toBe(x);
        expect(result.rover.y).toBe(y);
        expect(result.rover.orientation).toBe(orientation);
      });
    });
    describe("travel", () => {
      const mars = Sol2.mkPlanet(3, 4);
      const x = 1;
      const y = 1;
      const dir = Sol2.Orientation.N;
      const rover = Sol2.mkRover(x, y, dir);
      const obstacles: Array<Sol2.Obstacle> =
        [{ pos: { x: 2, y: 1 } }, { pos: { x: 2, y: 3 } }];
      it("should finish travel when did not hit obstacle", async () => {
        const cmds: Array<Sol2.Cmd> = [
          Sol2.Cmd.F,
          Sol2.Cmd.R,
          Sol2.Cmd.F,
          Sol2.Cmd.F,
          Sol2.Cmd.F,
          Sol2.Cmd.R,
          Sol2.Cmd.F,
          Sol2.Cmd.F,
          Sol2.Cmd.L,
        ];
        const result = Sol2.travel(mars, rover, obstacles, cmds);
        expect(result.kind).toBe("Normal");
        expect(result.rover.x).toBe(1);
        expect(result.rover.y).toBe(0);
        expect(result.rover.orientation).toBe(Sol2.Orientation.E);
      });
      it("should abort travel when hit obstacle", async () => {
        const cmds: Array<Sol2.Cmd> = [
          Sol2.Cmd.F,
          Sol2.Cmd.R,
          Sol2.Cmd.F,
          Sol2.Cmd.L,
          Sol2.Cmd.F,
          Sol2.Cmd.R,
          Sol2.Cmd.F,
          Sol2.Cmd.F,
          Sol2.Cmd.L,
        ];
        const result = Sol2.travel(mars, rover, obstacles, cmds);
        expect(result.kind).toBe("Hit");
        expect(result.rover.x).toBe(2);
        expect(result.rover.y).toBe(2);
        expect(result.rover.orientation).toBe(Sol2.Orientation.N);
      });
    });
  });
});
