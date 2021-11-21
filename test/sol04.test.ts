import * as As from "@effect-ts/core/Async"
import * as E from "@effect-ts/core/Either"
import * as Ex from "@effect-ts/system/Exit"
import { Orientation } from "../src/sol01/api";
import * as Sol4 from "../src/sol04/domain";

describe("Mars Kata", () => {
  describe("Sol04", () => {
    describe("mkPlanet", () => {
      it("should create the planet given correct size", async () => {
        const w = 3;
        const h = 4;
        const mars = Sol4.mkPlanet(w, h);
        expect(mars).toStrictEqual(E.right({ width: w, height: h }));
      });
      it("should return error given incorrect size", async () => {
        const w = 0;
        const h = -3;
        const mars = Sol4.mkPlanet(w, h);
        expect(mars).toStrictEqual(E.left(new Error("width and height must be positive numbers!")));
      });
    });
    describe("mkRover", () => {
      it("should create the rover given correct coordinates", async () => {
        const x = 1;
        const y = 2;
        const dir = Sol4.Orientation.N;
        const rover = Sol4.mkRover(x, y, dir);
        expect(rover).toStrictEqual(E.right({ x, y, orientation: dir }));
      });
      it("should return error given incorrect coordinates", async () => {
        const x = -1;
        const y = -2;
        const dir = Sol4.Orientation.N;
        const rover = Sol4.mkRover(x, y, dir);
        expect(rover).toStrictEqual(E.left(new Error("Coordinates must not be negative numbers!")));
      });
    });
    describe("turnLeft", () => {
      const x = 1;
      const y = 1;
      it("should head W if given N", async () => {
        const dir = Sol4.Orientation.N;
        const rover: Sol4.Rover = { x, y, orientation: dir };
        const result = Sol4.turnLeft(rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(Sol4.Orientation.W);
      });
      it("should head S if given W", async () => {
        const dir = Sol4.Orientation.W;
        const rover: Sol4.Rover = { x, y, orientation: dir };
        const result = Sol4.turnLeft(rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(Sol4.Orientation.S);
      });
      it("should head E if given S", async () => {
        const dir = Sol4.Orientation.S;
        const rover: Sol4.Rover = { x, y, orientation: dir };
        const result = Sol4.turnLeft(rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(Sol4.Orientation.E);
      });
      it("should head N if given E", async () => {
        const dir = Sol4.Orientation.E;
        const rover: Sol4.Rover = { x, y, orientation: dir };
        const result = Sol4.turnLeft(rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(Sol4.Orientation.N);
      });
    });
    describe("turnRight", () => {
      const x = 1;
      const y = 1;
      it("should head E if given N", async () => {
        const dir = Sol4.Orientation.N;
        const rover: Sol4.Rover = { x, y, orientation: dir };
        const result = Sol4.turnRight(rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(Sol4.Orientation.E);
      });
      it("should head S if given E", async () => {
        const dir = Sol4.Orientation.E;
        const rover: Sol4.Rover = { x, y, orientation: dir };
        const result = Sol4.turnRight(rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(Sol4.Orientation.S);
      });
      it("should head W if given S", async () => {
        const dir = Sol4.Orientation.S;
        const rover: Sol4.Rover = { x, y, orientation: dir };
        const result = Sol4.turnRight(rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(Sol4.Orientation.W);
      });
      it("should head N if given W", async () => {
        const dir = Sol4.Orientation.W;
        const rover: Sol4.Rover = { x, y, orientation: dir };
        const result = Sol4.turnRight(rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(Sol4.Orientation.N);
      });
    });
    describe("moveForward", () => {
      const mars: Sol4.Planet = { width: 3, height: 4 };
      const x = 1;
      const y = 1;
      it("should move forward in N dir", async () => {
        const dir = Sol4.Orientation.N;
        const rover: Sol4.Rover = { x, y, orientation: dir };
        const result = Sol4.moveForward(mars, rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y + 1);
        expect(result.orientation).toBe(dir);
      });
      it("should move forward in E dir", async () => {
        const dir = Sol4.Orientation.E;
        const rover: Sol4.Rover = { x, y, orientation: dir };
        const result = Sol4.moveForward(mars, rover);
        expect(result.x).toBe(x + 1);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(dir);
      });
      it("should move forward in S dir", async () => {
        const dir = Sol4.Orientation.S;
        const rover: Sol4.Rover = { x, y, orientation: dir };
        const result = Sol4.moveForward(mars, rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y - 1);
        expect(result.orientation).toBe(dir);
      });
      it("should move forward in W dir", async () => {
        const dir = Sol4.Orientation.W;
        const rover: Sol4.Rover = { x, y, orientation: dir };
        const result = Sol4.moveForward(mars, rover);
        expect(result.x).toBe(x - 1);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(dir);
      });
      it("should wrap when going in N dir", async () => {
        const dir = Sol4.Orientation.N;
        const rover: Sol4.Rover = { x, y: mars.height - 1, orientation: dir };
        const result = Sol4.moveForward(mars, rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(0);
        expect(result.orientation).toBe(dir);
      });
      it("should wrap when going in E dir", async () => {
        const dir = Sol4.Orientation.E;
        const rover: Sol4.Rover = { x: mars.width - 1, y, orientation: dir };
        const result = Sol4.moveForward(mars, rover);
        expect(result.x).toBe(0);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(dir);
      });
      it("should wrap when going in S dir", async () => {
        const dir = Sol4.Orientation.S;
        const rover: Sol4.Rover = { x, y: 0, orientation: dir };
        const result = Sol4.moveForward(mars, rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(mars.height - 1);
        expect(result.orientation).toBe(dir);
      });
      it("should wrap when going in W dir", async () => {
        const dir = Sol4.Orientation.W;
        const rover: Sol4.Rover = { x: 0, y, orientation: dir };
        const result = Sol4.moveForward(mars, rover);
        expect(result.x).toBe(mars.width - 1);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(dir);
      });
    });
    describe("moveBackward", () => {
      const mars: Sol4.Planet = { width: 3, height: 4 };
      const x = 1;
      const y = 1;
      it("should move backward in N dir", async () => {
        const dir = Sol4.Orientation.S;
        const rover: Sol4.Rover = { x, y, orientation: dir };
        const result = Sol4.moveBackward(mars, rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y + 1);
        expect(result.orientation).toBe(dir);
      });
      it("should move backward in E dir", async () => {
        const dir = Sol4.Orientation.W;
        const rover: Sol4.Rover = { x, y, orientation: dir };
        const result = Sol4.moveBackward(mars, rover);
        expect(result.x).toBe(x + 1);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(dir);
      });
      it("should move backward in S dir", async () => {
        const dir = Sol4.Orientation.N;
        const rover: Sol4.Rover = { x, y, orientation: dir };
        const result = Sol4.moveBackward(mars, rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y - 1);
        expect(result.orientation).toBe(dir);
      });
      it("should move backward in W dir", async () => {
        const dir = Sol4.Orientation.E;
        const rover: Sol4.Rover = { x, y, orientation: dir };
        const result = Sol4.moveBackward(mars, rover);
        expect(result.x).toBe(x - 1);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(dir);
      });
      it("should wrap when going in N dir", async () => {
        const dir = Sol4.Orientation.S;
        const rover: Sol4.Rover = { x, y: mars.height - 1, orientation: dir };
        const result = Sol4.moveBackward(mars, rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(0);
        expect(result.orientation).toBe(dir);
      });
      it("should wrap when going in E dir", async () => {
        const dir = Sol4.Orientation.W;
        const rover: Sol4.Rover = { x: mars.width - 1, y, orientation: dir };
        const result = Sol4.moveBackward(mars, rover);
        expect(result.x).toBe(0);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(dir);
      });
      it("should wrap when going in S dir", async () => {
        const dir = Sol4.Orientation.N;
        const rover: Sol4.Rover = { x, y: 0, orientation: dir };
        const result = Sol4.moveBackward(mars, rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(mars.height - 1);
        expect(result.orientation).toBe(dir);
      });
      it("should wrap when going in W dir", async () => {
        const dir = Sol4.Orientation.E;
        const rover: Sol4.Rover = { x: 0, y, orientation: dir };
        const result = Sol4.moveBackward(mars, rover);
        expect(result.x).toBe(mars.width - 1);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(dir);
      });
    });
    describe("move", () => {
      const mars: Sol4.Planet = { width: 3, height: 4 };
      const x = 1;
      const y = 1;
      const dir = Sol4.Orientation.N;
      const rover: Sol4.Rover = { x, y, orientation: dir };
      const obstacles: Array<Sol4.Obstacle> =
        [{ pos: { x: 2, y: 1 } }, { pos: { x: 3, y: 3 } }];
      it("should go forward", async () => {
        const result = Sol4.move(mars, rover, obstacles, Sol4.Cmd.F);
        expect(result.kind).toBe("Normal");
        expect(result.rover.x).toBe(x);
        expect(result.rover.y).toBe(y + 1);
        expect(result.rover.orientation).toBe(dir);
      });
      it("should go backward", async () => {
        const result = Sol4.move(mars, rover, obstacles, Sol4.Cmd.B);
        expect(result.kind).toBe("Normal");
        expect(result.rover.x).toBe(x);
        expect(result.rover.y).toBe(y - 1);
        expect(result.rover.orientation).toBe(dir);
      });
      it("should turn left", async () => {
        const result = Sol4.move(mars, rover, obstacles, Sol4.Cmd.L);
        expect(result.kind).toBe("Normal");
        expect(result.rover.x).toBe(x);
        expect(result.rover.y).toBe(y);
        expect(result.rover.orientation).toBe(Orientation.W);
      });
      it("should turn right", async () => {
        const result = Sol4.move(mars, rover, obstacles, Sol4.Cmd.R);
        expect(result.kind).toBe("Normal");
        expect(result.rover.x).toBe(x);
        expect(result.rover.y).toBe(y);
        expect(result.rover.orientation).toBe(Orientation.E);
      });
      it("should not hit obstacle when going forward", async () => {
        const orientation = Orientation.E;
        const result = Sol4.move(mars, { ...rover, orientation }, obstacles, Sol4.Cmd.F);
        expect(result.kind).toBe("Hit");
        expect(result.rover.x).toBe(x);
        expect(result.rover.y).toBe(y);
        expect(result.rover.orientation).toBe(orientation);
      });
      it("should not hit obstacle when going backwards", async () => {
        const orientation = Orientation.W;
        const result = Sol4.move(mars, { ...rover, orientation }, obstacles, Sol4.Cmd.B);
        expect(result.kind).toBe("Hit");
        expect(result.rover.x).toBe(x);
        expect(result.rover.y).toBe(y);
        expect(result.rover.orientation).toBe(orientation);
      });
    });
    describe("travel", () => {
      const mars: Sol4.Planet = { width: 3, height: 4 };
      const x = 1;
      const y = 1;
      const dir = Sol4.Orientation.N;
      const rover: Sol4.Rover = { x, y, orientation: dir };
      const obstacles: Array<Sol4.Obstacle> =
        [{ pos: { x: 2, y: 1 } }, { pos: { x: 2, y: 3 } }];
      it("should finish travel when did not hit obstacle", async () => {
        const cmds: Array<Sol4.Cmd> = [
          Sol4.Cmd.F,
          Sol4.Cmd.R,
          Sol4.Cmd.F,
          Sol4.Cmd.F,
          Sol4.Cmd.F,
          Sol4.Cmd.R,
          Sol4.Cmd.F,
          Sol4.Cmd.F,
          Sol4.Cmd.L,
        ];
        const result = Sol4.travel(mars, rover, obstacles, cmds);
        expect(result.kind).toBe("Normal");
        expect(result.rover.x).toBe(1);
        expect(result.rover.y).toBe(0);
        expect(result.rover.orientation).toBe(Sol4.Orientation.E);
      });
      it("should abort travel when hit obstacle", async () => {
        const cmds: Array<Sol4.Cmd> = [
          Sol4.Cmd.F,
          Sol4.Cmd.R,
          Sol4.Cmd.F,
          Sol4.Cmd.L,
          Sol4.Cmd.F,
          Sol4.Cmd.R,
          Sol4.Cmd.F,
          Sol4.Cmd.F,
          Sol4.Cmd.L,
        ];
        const result = Sol4.travel(mars, rover, obstacles, cmds);
        expect(result.kind).toBe("Hit");
        expect(result.rover.x).toBe(2);
        expect(result.rover.y).toBe(2);
        expect(result.rover.orientation).toBe(Sol4.Orientation.N);
      });
    });
    describe("parsePlanet", () => {
      it("should parse correct input", async () => {
        const result = Sol4.parsePlanet("5x4");
        expect(result).toStrictEqual(E.right({ width: 5, height: 4 }));
      });
      it("should return error given incorrect input", async () => {
        const errMsg = "Wrong numbers pair string format!";
        const result1 = Sol4.parsePlanet("ax4");
        expect(result1).toStrictEqual(E.left(new Error(errMsg)));
        const result2 = Sol4.parsePlanet("3xb");
        expect(result2).toStrictEqual(E.left(new Error(errMsg)));
        const result3 = Sol4.parsePlanet("3y8");
        expect(result3).toStrictEqual(E.left(new Error(errMsg)));
        const result4 = Sol4.parsePlanet("-3x8");
        expect(result4).toStrictEqual(E.left(new Error(errMsg)));
        const result5 = Sol4.parsePlanet("3x-8");
        expect(result5).toStrictEqual(E.left(new Error(errMsg)));
      });
    });
    describe("parseObstacle", () => {
      it("should parse correct input", async () => {
        const result = Sol4.parseObstacle("1,2");
        expect(result).toStrictEqual(E.right({ pos: { x: 1, y: 2 } }));
      });
      it("should return error given incorrect input", async () => {
        const errMsg = "Wrong numbers pair string format!";
        const result1 = Sol4.parseObstacle(",2");
        expect(result1).toStrictEqual(E.left(new Error(errMsg)));
        const result2 = Sol4.parseObstacle("3,");
        expect(result2).toStrictEqual(E.left(new Error(errMsg)));
        const result3 = Sol4.parseObstacle("a,3");
        expect(result3).toStrictEqual(E.left(new Error(errMsg)));
        const result4 = Sol4.parseObstacle("-2,3");
        expect(result4).toStrictEqual(E.left(new Error(errMsg)));
      });
    });
    describe("parseObstacles", () => {
      it("should parse correct input", async () => {
        const result = Sol4.parseObstacles("1,2 0,0 3,4");
        expect(result).toStrictEqual(E.right([{ pos: { x: 1, y: 2 } }, { pos: { x: 0, y: 0 } }, { pos: { x: 3, y: 4 } }]));
      });
      it("should return error given incorrect input", async () => {
        const errMsg = "Wrong numbers pair string format!";
        const result1 = Sol4.parseObstacles(",2 3,4");
        expect(result1).toStrictEqual(E.left([new Error(errMsg)]));
        const result2 = Sol4.parseObstacles("3, 3, 3");
        expect(result2).toStrictEqual(E.left([new Error(errMsg), new Error(errMsg), new Error(errMsg)]));
        const result3 = Sol4.parseObstacles("a,3 4,3");
        expect(result3).toStrictEqual(E.left([new Error(errMsg)]));
        const result4 = Sol4.parseObstacles("3,-3 4,3");
        expect(result4).toStrictEqual(E.left([new Error(errMsg)]));
      });
    });
    describe("parseOrientation", () => {
      it("should parse correct input", async () => {
        const n = Sol4.parseOrientation("N");
        expect(n).toStrictEqual(E.right(Sol4.Orientation.N));
        const e = Sol4.parseOrientation("E");
        expect(e).toStrictEqual(E.right(Sol4.Orientation.E));
        const s = Sol4.parseOrientation("S");
        expect(s).toStrictEqual(E.right(Sol4.Orientation.S));
        const w = Sol4.parseOrientation("W");
        expect(w).toStrictEqual(E.right(Sol4.Orientation.W));
      });
      it("should return error given incorrect input", async () => {
        const errMsg = "Wrong orientation string format!"
        const result1 = Sol4.parseOrientation("A");
        expect(result1).toStrictEqual(E.left(new Error(errMsg)));
        const result2 = Sol4.parseOrientation("3");
        expect(result2).toStrictEqual(E.left(new Error(errMsg)));
      });
    });
    describe("parseRover", () => {
      it("should parse correct input", async () => {
        const result = Sol4.parseRover("1,2:W");
        expect(result).toStrictEqual(E.right({ x: 1, y: 2, orientation: Sol4.Orientation.W }));
      });
      it("should return error given incorrect input", async () => {
        const result1 = Sol4.parseRover("1,2W");
        expect(result1).toStrictEqual(E.left(new Error("Wrong rover input string format!")));
        const result2 = Sol4.parseRover("1,2:A");
        expect(result2).toStrictEqual(E.left(new Error("Wrong orientation string format!")));
        const result3 = Sol4.parseRover("1.2:A");
        expect(result3).toStrictEqual(E.left(new Error("Wrong numbers pair string format!")));
      });
    });
    describe("renderTravelOutcome", () => {
      it("should return correct srting for the Normal outcome", async () => {
        const outcome: Sol4.TravelOutcome = { kind: "Normal", rover: { x: 3, y: 8, orientation: Sol4.Orientation.N } };
        const result = Sol4.renderTravelOutcome(outcome);
        expect(result).toStrictEqual("3:8:N");
      });
      it("should return correct srting for the Hit outcome", async () => {
        const outcome: Sol4.TravelOutcome = { kind: "Hit", rover: { x: 1, y: 7, orientation: Sol4.Orientation.E } };
        const result = Sol4.renderTravelOutcome(outcome);
        expect(result).toStrictEqual("O:1:7:E");
      });
    });
    // TODO test new fns,
    // TODO simulate errors, etc.
    describe("parseCommand", () => {
      it("properly parses forward cmd", async () => {
        const input = "F";
        const result = Sol4.parseCommand(input);
        expect(result).toStrictEqual(E.right(Sol4.Command.F));
      });
      it("properly parses backward cmd", async () => {
        const input = "B";
        const result = Sol4.parseCommand(input);
        expect(result).toStrictEqual(E.right(Sol4.Command.B));
      });
      it("properly parses turn left cmd", async () => {
        const input = "L";
        const result = Sol4.parseCommand(input);
        expect(result).toStrictEqual(E.right(Sol4.Command.L));
      });
      it("properly parses turn right cmd", async () => {
        const input = "R";
        const result = Sol4.parseCommand(input);
        expect(result).toStrictEqual(E.right(Sol4.Command.R));
      });
      it("returns error given invalid input", async () => {
        const input = "X";
        const result = Sol4.parseCommand(input);
        expect(result).toStrictEqual(E.left(new Error(`Unknown Command: ${input}`)));
      });
    });
    describe("parseCommands", () => {
      it("properly parses a few commands", async () => {
        const input = "F,B,L,R,F";
        const expected = [Sol4.Command.F, Sol4.Command.B, Sol4.Command.L, Sol4.Command.L, Sol4.Command.F];
        const result = Sol4.parseCommands(input);
        expect(result).toStrictEqual(E.right(expected));
      });
      it("returns error when fails to parse commands", async () => {
        const errMsg = (input: string) => `Could not parse commands: ${input}`;
        const input = "F,B,X,R,F";
        const result = Sol4.parseCommands(input);
        expect(result).toStrictEqual(E.left(new Error(errMsg(input))));
        const input2 = "F,BR,F";
        const result2 = Sol4.parseCommands(input2);
        expect(result2).toStrictEqual(E.left(new Error(errMsg(input2))));
        const input3 = "F,B,";
        const result3 = Sol4.parseCommands(input3);
        expect(result3).toStrictEqual(E.left(new Error(errMsg(input3))));
      });
    });
    describe("readFile", () => {
      it("properly reads existing file", async () => {
        const filename = "sol04in.txt";
        const result = await As.runPromiseExit(Sol4.readFile(filename));
        expect(result).toEqual(As.successExit("sol04 test 1 2 3"));
      });
      it("returns error when file does not exist", async () => {
        const filename = "sol04xx.txt";
        const result = await As.runPromiseExit(Sol4.readFile(filename));
        expect(result).toEqual(As.failExit("TODO"));
      });
    });
  });
});
