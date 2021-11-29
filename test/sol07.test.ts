import * as A from "@effect-ts/core/Collections/Immutable/Array"
import * as T from "@effect-ts/core/Effect"
import * as Ex from "@effect-ts/system/Exit"
import * as E from "@effect-ts/core/Either"
import { pipe } from "@effect-ts/core/Function"
import {
  Cmd,
  Config,
  Environment,
  Logger,
  Obstacle,
  Orientation,
  Planet,
  Rover,
  TravelOutcome,
  mkPlanet,
  mkRover,
  turnLeft,
  turnRight,
  move,
  moveForward,
  moveBackward,
  parseCommand,
  parseCommands,
  parseObstacle,
  parseObstacles,
  parseOrientation,
  parsePlanet,
  parseRover,
  parseRoverClassic,
  parseRoverDo,
  parseRoverGen,
  ReadFileError,
  renderTravelOutcome,
  travel,
} from "../src/sol07/domain";
import {
  readFile,
} from "../src/sol07/infra";
import { app } from "../src/sol07/app";

describe("Mars Kata", () => {
  describe("Sol01", () => {
    describe("mkPlanet", () => {
      it("should create the planet given correct size", async () => {
        const w = 3;
        const h = 4;
        const mars = mkPlanet(w, h);
        expect(mars).toStrictEqual(E.right({ width: w, height: h }));
      });
      it("should return error given incorrect size", async () => {
        const w = 0;
        const h = -3;
        const mars = mkPlanet(w, h);
        expect(mars).toStrictEqual(E.left({
          kind: "PlanetConstructionError",
          msg: "width and height must be positive numbers!",
        }));
      });
    });
    describe("mkRover", () => {
      it("should create the rover given correct coordinates", async () => {
        const x = 1;
        const y = 2;
        const dir = Orientation.N;
        const rover = mkRover(x, y, dir);
        expect(rover).toStrictEqual(E.right({ x, y, orientation: dir }));
      });
      it("should return error given incorrect coordinates", async () => {
        const x = -1;
        const y = -2;
        const dir = Orientation.N;
        const rover = mkRover(x, y, dir);
        expect(rover).toStrictEqual(E.left({
          kind: "RoverCosntructionError",
          msg: "Coordinates must not be negative numbers"
        }));
      });
    });
    describe("turnLeft", () => {
      const x = 1;
      const y = 1;
      it("should head W if given N", async () => {
        const dir = Orientation.N;
        const rover: Rover = { x, y, orientation: dir };
        const result = turnLeft(rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(Orientation.W);
      });
      it("should head S if given W", async () => {
        const dir = Orientation.W;
        const rover: Rover = { x, y, orientation: dir };
        const result = turnLeft(rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(Orientation.S);
      });
      it("should head E if given S", async () => {
        const dir = Orientation.S;
        const rover: Rover = { x, y, orientation: dir };
        const result = turnLeft(rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(Orientation.E);
      });
      it("should head N if given E", async () => {
        const dir = Orientation.E;
        const rover: Rover = { x, y, orientation: dir };
        const result = turnLeft(rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(Orientation.N);
      });
    });
    describe("turnRight", () => {
      const x = 1;
      const y = 1;
      it("should head E if given N", async () => {
        const dir = Orientation.N;
        const rover: Rover = { x, y, orientation: dir };
        const result = turnRight(rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(Orientation.E);
      });
      it("should head S if given E", async () => {
        const dir = Orientation.E;
        const rover: Rover = { x, y, orientation: dir };
        const result = turnRight(rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(Orientation.S);
      });
      it("should head W if given S", async () => {
        const dir = Orientation.S;
        const rover: Rover = { x, y, orientation: dir };
        const result = turnRight(rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(Orientation.W);
      });
      it("should head N if given W", async () => {
        const dir = Orientation.W;
        const rover: Rover = { x, y, orientation: dir };
        const result = turnRight(rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(Orientation.N);
      });
    });
    describe("moveForward", () => {
      const mars: Planet = { width: 3, height: 4 };
      const x = 1;
      const y = 1;
      it("should move forward in N dir", async () => {
        const dir = Orientation.N;
        const rover: Rover = { x, y, orientation: dir };
        const result = moveForward(mars, rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y + 1);
        expect(result.orientation).toBe(dir);
      });
      it("should move forward in E dir", async () => {
        const dir = Orientation.E;
        const rover: Rover = { x, y, orientation: dir };
        const result = moveForward(mars, rover);
        expect(result.x).toBe(x + 1);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(dir);
      });
      it("should move forward in S dir", async () => {
        const dir = Orientation.S;
        const rover: Rover = { x, y, orientation: dir };
        const result = moveForward(mars, rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y - 1);
        expect(result.orientation).toBe(dir);
      });
      it("should move forward in W dir", async () => {
        const dir = Orientation.W;
        const rover: Rover = { x, y, orientation: dir };
        const result = moveForward(mars, rover);
        expect(result.x).toBe(x - 1);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(dir);
      });
      it("should wrap when going in N dir", async () => {
        const dir = Orientation.N;
        const rover: Rover = { x, y: mars.height - 1, orientation: dir };
        const result = moveForward(mars, rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(0);
        expect(result.orientation).toBe(dir);
      });
      it("should wrap when going in E dir", async () => {
        const dir = Orientation.E;
        const rover: Rover = { x: mars.width - 1, y, orientation: dir };
        const result = moveForward(mars, rover);
        expect(result.x).toBe(0);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(dir);
      });
      it("should wrap when going in S dir", async () => {
        const dir = Orientation.S;
        const rover: Rover = { x, y: 0, orientation: dir };
        const result = moveForward(mars, rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(mars.height - 1);
        expect(result.orientation).toBe(dir);
      });
      it("should wrap when going in W dir", async () => {
        const dir = Orientation.W;
        const rover: Rover = { x: 0, y, orientation: dir };
        const result = moveForward(mars, rover);
        expect(result.x).toBe(mars.width - 1);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(dir);
      });
    });
    describe("moveBackward", () => {
      const mars: Planet = { width: 3, height: 4 };
      const x = 1;
      const y = 1;
      it("should move backward in N dir", async () => {
        const dir = Orientation.S;
        const rover: Rover = { x, y, orientation: dir };
        const result = moveBackward(mars, rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y + 1);
        expect(result.orientation).toBe(dir);
      });
      it("should move backward in E dir", async () => {
        const dir = Orientation.W;
        const rover: Rover = { x, y, orientation: dir };
        const result = moveBackward(mars, rover);
        expect(result.x).toBe(x + 1);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(dir);
      });
      it("should move backward in S dir", async () => {
        const dir = Orientation.N;
        const rover: Rover = { x, y, orientation: dir };
        const result = moveBackward(mars, rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y - 1);
        expect(result.orientation).toBe(dir);
      });
      it("should move backward in W dir", async () => {
        const dir = Orientation.E;
        const rover: Rover = { x, y, orientation: dir };
        const result = moveBackward(mars, rover);
        expect(result.x).toBe(x - 1);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(dir);
      });
      it("should wrap when going in N dir", async () => {
        const dir = Orientation.S;
        const rover: Rover = { x, y: mars.height - 1, orientation: dir };
        const result = moveBackward(mars, rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(0);
        expect(result.orientation).toBe(dir);
      });
      it("should wrap when going in E dir", async () => {
        const dir = Orientation.W;
        const rover: Rover = { x: mars.width - 1, y, orientation: dir };
        const result = moveBackward(mars, rover);
        expect(result.x).toBe(0);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(dir);
      });
      it("should wrap when going in S dir", async () => {
        const dir = Orientation.N;
        const rover: Rover = { x, y: 0, orientation: dir };
        const result = moveBackward(mars, rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(mars.height - 1);
        expect(result.orientation).toBe(dir);
      });
      it("should wrap when going in W dir", async () => {
        const dir = Orientation.E;
        const rover: Rover = { x: 0, y, orientation: dir };
        const result = moveBackward(mars, rover);
        expect(result.x).toBe(mars.width - 1);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(dir);
      });
    });
  });
  describe("Sol02", () => {
    describe("move", () => {
      const mars: Planet = { width: 3, height: 4 };
      const x = 1;
      const y = 1;
      const dir = Orientation.N;
      const rover: Rover = { x, y, orientation: dir };
      const obstacles: Array<Obstacle> =
        [{ pos: { x: 2, y: 1 } }, { pos: { x: 3, y: 3 } }];
      it("should go forward", async () => {
        const result = move(mars, rover, obstacles, Cmd.F);
        expect(result.kind).toBe("Normal");
        expect(result.rover.x).toBe(x);
        expect(result.rover.y).toBe(y + 1);
        expect(result.rover.orientation).toBe(dir);
      });
      it("should go backward", async () => {
        const result = move(mars, rover, obstacles, Cmd.B);
        expect(result.kind).toBe("Normal");
        expect(result.rover.x).toBe(x);
        expect(result.rover.y).toBe(y - 1);
        expect(result.rover.orientation).toBe(dir);
      });
      it("should turn left", async () => {
        const result = move(mars, rover, obstacles, Cmd.L);
        expect(result.kind).toBe("Normal");
        expect(result.rover.x).toBe(x);
        expect(result.rover.y).toBe(y);
        expect(result.rover.orientation).toBe(Orientation.W);
      });
      it("should turn right", async () => {
        const result = move(mars, rover, obstacles, Cmd.R);
        expect(result.kind).toBe("Normal");
        expect(result.rover.x).toBe(x);
        expect(result.rover.y).toBe(y);
        expect(result.rover.orientation).toBe(Orientation.E);
      });
      it("should not hit obstacle when going forward", async () => {
        const orientation = Orientation.E;
        const result = move(mars, { ...rover, orientation }, obstacles, Cmd.F);
        expect(result.kind).toBe("Hit");
        expect(result.rover.x).toBe(x);
        expect(result.rover.y).toBe(y);
        expect(result.rover.orientation).toBe(orientation);
      });
      it("should not hit obstacle when going backwards", async () => {
        const orientation = Orientation.W;
        const result = move(mars, { ...rover, orientation }, obstacles, Cmd.B);
        expect(result.kind).toBe("Hit");
        expect(result.rover.x).toBe(x);
        expect(result.rover.y).toBe(y);
        expect(result.rover.orientation).toBe(orientation);
      });
    });
    describe("travel", () => {
      const mars: Planet = { width: 3, height: 4 };
      const x = 1;
      const y = 1;
      const dir = Orientation.N;
      const rover: Rover = { x, y, orientation: dir };
      const obstacles: Array<Obstacle> =
        [{ pos: { x: 2, y: 1 } }, { pos: { x: 2, y: 3 } }];
      it("should finish travel when did not hit obstacle", async () => {
        const cmds: Array<Cmd> = [
          Cmd.F,
          Cmd.R,
          Cmd.F,
          Cmd.F,
          Cmd.F,
          Cmd.R,
          Cmd.F,
          Cmd.F,
          Cmd.L,
        ];
        const result = travel(mars, rover, obstacles, cmds);
        expect(result.kind).toBe("Normal");
        expect(result.rover.x).toBe(1);
        expect(result.rover.y).toBe(0);
        expect(result.rover.orientation).toBe(Orientation.E);
      });
      it("should abort travel when hit obstacle", async () => {
        const cmds: Array<Cmd> = [
          Cmd.F,
          Cmd.R,
          Cmd.F,
          Cmd.L,
          Cmd.F,
          Cmd.R,
          Cmd.F,
          Cmd.F,
          Cmd.L,
        ];
        const result = travel(mars, rover, obstacles, cmds);
        expect(result.kind).toBe("Hit");
        expect(result.rover.x).toBe(2);
        expect(result.rover.y).toBe(2);
        expect(result.rover.orientation).toBe(Orientation.N);
      });
    });
  });
  describe("Sol03", () => {
    const wrongInputStrErr = {
      error: {
        error: "WrongInputStringError",
        kind: "ParseNumPairError",
      },
      kind: "ParseObstacleError",
    };
    describe("parsePlanet", () => {
      it("should parse correct input", async () => {
        const result = parsePlanet("5x4");
        expect(result).toStrictEqual(E.right({ width: 5, height: 4 }));
      });
      it("should return error given incorrect input", async () => {
        const err = {
          kind: "ParsePlanetError",
          error: {
            kind: "ParseNumPairError",
            error: "WrongInputStringError"
          }
        };
        const result1 = parsePlanet("ax4");
        expect(result1).toStrictEqual(E.left(err));
        const result2 = parsePlanet("3xb");
        expect(result2).toStrictEqual(E.left(err));
        const result3 = parsePlanet("3y8");
        expect(result3).toStrictEqual(E.left(err));
        const result4 = parsePlanet("-3x8");
        expect(result4).toStrictEqual(E.left(err));
        const result5 = parsePlanet("3x-8");
        expect(result5).toStrictEqual(E.left(err));
      });
    });
    describe("parseObstacle", () => {
      it("should parse correct input", async () => {
        const result = parseObstacle("1,2");
        expect(result).toStrictEqual(E.right({ pos: { x: 1, y: 2 } }));
      });
      it("should return error given incorrect input", async () => {
        const result1 = parseObstacle(",2");
        expect(result1).toStrictEqual(E.left(wrongInputStrErr));
        const result2 = parseObstacle("3,");
        expect(result2).toStrictEqual(E.left(wrongInputStrErr));
        const result3 = parseObstacle("a,3");
        expect(result3).toStrictEqual(E.left(wrongInputStrErr));
        const result4 = parseObstacle("-2,3");
        expect(result4).toStrictEqual(E.left(wrongInputStrErr));
      });
    });
    describe("parseObstacles", () => {
      it("should parse correct input", async () => {
        const result = parseObstacles("1,2 0,0 3,4");
        expect(result).toStrictEqual(E.right([{ pos: { x: 1, y: 2 } }, { pos: { x: 0, y: 0 } }, { pos: { x: 3, y: 4 } }]));
      });
      it("should return error given incorrect input", async () => {
        const result1 = parseObstacles(",2 3,4");
        expect(result1).toStrictEqual(E.left([wrongInputStrErr]));
        const result2 = parseObstacles("3, 3, 3");
        expect(result2).toStrictEqual(E.left([wrongInputStrErr, wrongInputStrErr, wrongInputStrErr
        ]));
        const result3 = parseObstacles("a,3 4,3");
        expect(result3).toStrictEqual(E.left([wrongInputStrErr]));
        const result4 = parseObstacles("3,-3 4,3");
        expect(result4).toStrictEqual(E.left([wrongInputStrErr]));
      });
    });
    describe("parseOrientation", () => {
      it("should parse correct input", async () => {
        const n = parseOrientation("N");
        expect(n).toStrictEqual(E.right(Orientation.N));
        const e = parseOrientation("E");
        expect(e).toStrictEqual(E.right(Orientation.E));
        const s = parseOrientation("S");
        expect(s).toStrictEqual(E.right(Orientation.S));
        const w = parseOrientation("W");
        expect(w).toStrictEqual(E.right(Orientation.W));
      });
      it("should return error given incorrect input", async () => {
        const result1 = parseOrientation("A");
        expect(result1).toStrictEqual(E.left({
          kind: "ParseOrientationError",
          input: "A",
        }));
        const result2 = parseOrientation("3");
        expect(result2).toStrictEqual(E.left({
          kind: "ParseOrientationError",
          input: "3",
        }));
      });
    });
    describe("parseRover", () => {
      it("should parse correct input", async () => {
        const result = parseRover("1,2:W");
        expect(result).toStrictEqual(E.right({ x: 1, y: 2, orientation: Orientation.W }));
      });
      it("should return error given incorrect input", async () => {
        const result1 = parseRover("1,2W");
        expect(result1).toStrictEqual(E.left({
          kind: "ParseRoverError",
          error: {
            kind: "InputError"
          },
        }));
        const result2 = parseRover("1,2:A");
        expect(result2).toStrictEqual(E.left({
          kind: "ParseRoverError",
          error: {
            kind: "ParseOrientationError",
            input: "A",
          }
        }));
        const result3 = parseRover("1.2:A");
        expect(result3).toStrictEqual(E.left({
          kind: "ParseRoverError",
          error: {
            kind: "ParseNumPairError",
            error: "WrongInputStringError"
          }
        }));
      });
    });
    describe("parseRover benchmarks", () => {
      const n = 100000;
      const input = "1,2:W";
      it("parseRoverClassic", async () => {
        expect(pipe(
          A.replicate_(n, input),
          A.forEachF(E.Applicative)((x) => parseRoverClassic(x)),
          E.isRight,
        )).toBeTruthy();
      });
      it("parseRoverDo", async () => {
        expect(pipe(
          A.replicate_(n, input),
          A.forEachF(E.Applicative)((x) => parseRoverDo(x)),
          E.isRight,
        )).toBeTruthy();
      });
      it("parseRoverGen", async () => {
        expect(pipe(
          A.replicate_(n, input),
          A.forEachF(E.Applicative)((x) => parseRoverGen(x)),
          E.isRight,
        )).toBeTruthy();
      });
    });
    describe("renderTravelOutcome", () => {
      it("should return correct srting for the Normal outcome", async () => {
        const outcome: TravelOutcome = { kind: "Normal", rover: { x: 3, y: 8, orientation: Orientation.N } };
        const result = renderTravelOutcome(outcome);
        expect(result).toStrictEqual("3:8:N");
      });
      it("should return correct srting for the Hit outcome", async () => {
        const outcome: TravelOutcome = { kind: "Hit", rover: { x: 1, y: 7, orientation: Orientation.E } };
        const result = renderTravelOutcome(outcome);
        expect(result).toStrictEqual("O:1:7:E");
      });
    });
  });
  describe("Sol04", () => {
    describe("parseCommand", () => {
      it("properly parses forward cmd", async () => {
        const input = "F";
        const result = parseCommand(input);
        expect(result).toStrictEqual(E.right(Cmd.F));
      });
      it("properly parses backward cmd", async () => {
        const input = "B";
        const result = parseCommand(input);
        expect(result).toStrictEqual(E.right(Cmd.B));
      });
      it("properly parses turn left cmd", async () => {
        const input = "L";
        const result = parseCommand(input);
        expect(result).toStrictEqual(E.right(Cmd.L));
      });
      it("properly parses turn right cmd", async () => {
        const input = "R";
        const result = parseCommand(input);
        expect(result).toStrictEqual(E.right(Cmd.R));
      });
      it("returns error given invalid input", async () => {
        const input = "X";
        const result = parseCommand(input);
        expect(result).toEqual(E.left({ kind: "ParseCmdError", input }));
      });
    });
    describe("parseCommands", () => {
      it("properly parses a few commands", async () => {
        const input = "F,B,L,R,F";
        const expected = [Cmd.F, Cmd.B, Cmd.L, Cmd.R, Cmd.F];
        const result = parseCommands(input);
        expect(result).toStrictEqual(E.right(expected));
      });
      it("returns error when fails to parse commands", async () => {
        const input = "F,B,X,R,F";
        const result = parseCommands(input);
        expect(result).toEqual(E.left({
          kind: "ParseCommandsError",
          input,
          error: "X",
        }));
        const input2 = "F,BR,F";
        const result2 = parseCommands(input2);
        expect(result2).toEqual(E.left({
          kind: "ParseCommandsError",
          input: input2,
          error: "BR",
        }));
        const input3 = "F,B,";
        const result3 = parseCommands(input3);
        expect(result3).toEqual(E.left({
          kind: "ParseCommandsError",
          input: input3,
          error: "",
        }));
      });
    });
    describe("readFile", () => {
      it("properly reads existing file", async () => {
        const filename = "solIn.txt";
        const result = await T.runPromiseExit(readFile(filename));
        expect(result).toEqual(Ex.succeed("sol04 test 1 2 3"));
      });
      it("returns error when file does not exist", async () => {
        const filename = "solxx.txt";
        const result = await pipe(
          readFile(filename),
          T.mapError((e) => e.filename),
          T.runPromiseExit,
        );
        expect(result).toEqual(Ex.fail(filename));
      });
    });
  });
  describe("Sol05", () => {
    describe("app", () => {
      it("make proper calls for happy path", async () => {
        const cmds = "F,B,L,R,F";
        const config: Config = {
          planetFile: "planet.txt",
          roverFile: "rover.txt",
        };
        const logMock = {
          error: [] as unknown[],
          log: [] as unknown[],
          warn: [] as unknown[],
        };
        const consoleMock: Array<string> = [];
        const promptMock: Array<string> = [];

        const getLogger = (): Logger => ({
          error: jest.fn((...args: unknown[]) =>
            T.succeedWith(() => {
              logMock.error.push([...args]);
            })),
          log: jest.fn((...args: unknown[]) =>
            T.succeedWith(() => {
              logMock.log.push([...args]);
            })),
          warn: jest.fn((...args: unknown[]) =>
            T.succeedWith(() => {
              logMock.warn.push([...args]);
            })),
        });
        const readFileMock = jest.fn((filename: string) =>
          T.succeedWith(() =>
            filename === config.planetFile
              ? "5x4\n1,2 0,0 3,4"
              : "1,3:W"));
        const readConsole = jest.fn((prompt: string) =>
          T.succeedWith(() => {
            promptMock.push(prompt);
            return cmds;
          }));
        const writeConsole = jest.fn((s: string) => T.succeedWith(() => consoleMock.push(s)));
        const env: Environment = {
          getConfig: () => config,
          getLogger,
          readFile: readFileMock,
          readConsole,
          writeConsole,
        };

        const result = await pipe(
          app,
          T.provideAll(env),
          T.runPromise,
        );

        expect(result).toStrictEqual({
          kind: "Normal",
          rover: {
            orientation: "W",
            x: 0,
            y: 3,
          },
        });
        expect(consoleMock).toStrictEqual([
          "Welcome to Mars, Rover!",
          "Rover position: 0:3:W",
          "Mission completed!",
        ]);
        expect(promptMock).toStrictEqual(["Please, enter commands for the Rover in 'F,B,R,L' format: "]);
        expect(logMock).toStrictEqual({
          log: [
            ["Planet", { width: 5, height: 4 }],
            ["Obstacles", [{ pos: { x: 1, y: 2 } }, { pos: { x: 0, y: 0 } }, { pos: { x: 3, y: 4 } }]],
            ["Rover", { x: 1, y: 3, orientation: "W" }],
            ["Rover is executing commands: F,B,L,R,F"],
          ],
          error: [],
          warn: [],
        });
      });
      it("handles wrong planetFile error", async () => {
        const config: Config = {
          planetFile: "nope.txt",
          roverFile: "rover.txt",
        };
        const logMock = {
          error: [] as unknown[],
          log: [] as unknown[],
          warn: [] as unknown[],
        };
        const consoleMock: Array<string> = [];
        const promptMock: Array<string> = [];

        const getLogger = (): Logger => ({
          error: jest.fn((...args: unknown[]) =>
            T.succeedWith(() => {
              logMock.error.push([...args]);
            })),
          log: jest.fn((...args: unknown[]) =>
            T.succeedWith(() => {
              logMock.log.push([...args]);
            })),
          warn: jest.fn((...args: unknown[]) =>
            T.succeedWith(() => {
              logMock.warn.push([...args]);
            })),
        });
        const readFileErr = (filename: string): ReadFileError => ({
          kind: "ReadFileError",
          filename,
          error: null,
        });
        const readFileMock = jest.fn((f: string) =>
          T.fail(readFileErr(f)));
        const readConsole = jest.fn((prompt: string) =>
          T.succeedWith(() => {
            promptMock.push(prompt);
            return "";
          }));
        const writeConsole = jest.fn((s: string) => T.succeedWith(() => consoleMock.push(s)));
        const env: Environment = {
          getConfig: () => config,
          getLogger,
          readFile: readFileMock,
          readConsole,
          writeConsole,
        };

        const result = await pipe(
          app,
          T.provideAll(env),
          T.runPromiseExit,
        );

        expect(result).toStrictEqual(Ex.fail(readFileErr(config.planetFile)));
        expect(consoleMock).toStrictEqual(["Welcome to Mars, Rover!"]);
        expect(promptMock).toStrictEqual([]);
        expect(logMock).toStrictEqual({
          log: [],
          error: [],
          warn: [],
        });
      });
    });
  });
});
