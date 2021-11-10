import * as Sol1 from "../src/sol01/sol01"

describe("Mars Kata", () => {
  describe("Sol01", () => {
    describe("mkPlanet", () => {
      it("should create the planet", async () => {
        const w = 3;
        const h = 4;
        const mars = Sol1.mkPlanet(w, h);
        expect(mars.width).toBe(w);
        expect(mars.height).toBe(h);
      });
    });
    describe("mkRover", () => {
      it("should create the rover", async () => {
        const x = 1;
        const y = 2;
        const dir = Sol1.Orientation.N;
        const rover = Sol1.mkRover(x, y, dir);
        expect(rover.x).toBe(x);
        expect(rover.y).toBe(y);
        expect(rover.orientation).toBe(dir);
      });
    });
    describe("turnLeft", () => {
      const x = 1;
      const y = 1;
      it("should head W if given N", async () => {
        const dir = Sol1.Orientation.N;
        const rover = Sol1.mkRover(x, y, dir);
        const result = Sol1.turnLeft(rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(Sol1.Orientation.W);
      });
      it("should head S if given W", async () => {
        const dir = Sol1.Orientation.W;
        const rover = Sol1.mkRover(x, y, dir);
        const result = Sol1.turnLeft(rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(Sol1.Orientation.S);
      });
      it("should head E if given S", async () => {
        const dir = Sol1.Orientation.S;
        const rover = Sol1.mkRover(x, y, dir);
        const result = Sol1.turnLeft(rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(Sol1.Orientation.E);
      });
      it("should head N if given E", async () => {
        const dir = Sol1.Orientation.E;
        const rover = Sol1.mkRover(x, y, dir);
        const result = Sol1.turnLeft(rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(Sol1.Orientation.N);
      });
    });
    describe("turnRight", () => {
      const x = 1;
      const y = 1;
      it("should head E if given N", async () => {
        const dir = Sol1.Orientation.N;
        const rover = Sol1.mkRover(x, y, dir);
        const result = Sol1.turnRight(rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(Sol1.Orientation.E);
      });
      it("should head S if given E", async () => {
        const dir = Sol1.Orientation.E;
        const rover = Sol1.mkRover(x, y, dir);
        const result = Sol1.turnRight(rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(Sol1.Orientation.S);
      });
      it("should head W if given S", async () => {
        const dir = Sol1.Orientation.S;
        const rover = Sol1.mkRover(x, y, dir);
        const result = Sol1.turnRight(rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(Sol1.Orientation.W);
      });
      it("should head N if given W", async () => {
        const dir = Sol1.Orientation.W;
        const rover = Sol1.mkRover(x, y, dir);
        const result = Sol1.turnRight(rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(Sol1.Orientation.N);
      });
    });
    describe("moveForward", () => {
      const mars = Sol1.mkPlanet(3, 4);
      const x = 1;
      const y = 1;
      it("should move forward in N dir", async () => {
        const dir = Sol1.Orientation.N;
        const rover = Sol1.mkRover(x, y, dir);
        const result = Sol1.moveForward(mars, rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y + 1);
        expect(result.orientation).toBe(dir);
      });
      it("should move forward in E dir", async () => {
        const dir = Sol1.Orientation.E;
        const rover = Sol1.mkRover(x, y, dir);
        const result = Sol1.moveForward(mars, rover);
        expect(result.x).toBe(x + 1);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(dir);
      });
      it("should move forward in S dir", async () => {
        const dir = Sol1.Orientation.S;
        const rover = Sol1.mkRover(x, y, dir);
        const result = Sol1.moveForward(mars, rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y - 1);
        expect(result.orientation).toBe(dir);
      });
      it("should move forward in W dir", async () => {
        const dir = Sol1.Orientation.W;
        const rover = Sol1.mkRover(x, y, dir);
        const result = Sol1.moveForward(mars, rover);
        expect(result.x).toBe(x - 1);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(dir);
      });
      it("should wrap when going in N dir", async () => {
        const dir = Sol1.Orientation.N;
        const rover = Sol1.mkRover(x, mars.height - 1, dir);
        const result = Sol1.moveForward(mars, rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(0);
        expect(result.orientation).toBe(dir);
      });
      it("should wrap when going in E dir", async () => {
        const dir = Sol1.Orientation.E;
        const rover = Sol1.mkRover(mars.width - 1, y, dir);
        const result = Sol1.moveForward(mars, rover);
        expect(result.x).toBe(0);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(dir);
      });
      it("should wrap when going in S dir", async () => {
        const dir = Sol1.Orientation.S;
        const rover = Sol1.mkRover(x, 0, dir);
        const result = Sol1.moveForward(mars, rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(mars.height - 1);
        expect(result.orientation).toBe(dir);
      });
      it("should wrap when going in W dir", async () => {
        const dir = Sol1.Orientation.W;
        const rover = Sol1.mkRover(0, y, dir);
        const result = Sol1.moveForward(mars, rover);
        expect(result.x).toBe(mars.width - 1);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(dir);
      });
    });
    describe("moveBackward", () => {
      const mars = Sol1.mkPlanet(3, 4);
      const x = 1;
      const y = 1;
      it("should move backward in N dir", async () => {
        const dir = Sol1.Orientation.S;
        const rover = Sol1.mkRover(x, y, dir);
        const result = Sol1.moveBackward(mars, rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y + 1);
        expect(result.orientation).toBe(dir);
      });
      it("should move backward in E dir", async () => {
        const dir = Sol1.Orientation.W;
        const rover = Sol1.mkRover(x, y, dir);
        const result = Sol1.moveBackward(mars, rover);
        expect(result.x).toBe(x + 1);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(dir);
      });
      it("should move backward in S dir", async () => {
        const dir = Sol1.Orientation.N;
        const rover = Sol1.mkRover(x, y, dir);
        const result = Sol1.moveBackward(mars, rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(y - 1);
        expect(result.orientation).toBe(dir);
      });
      it("should move backward in W dir", async () => {
        const dir = Sol1.Orientation.E;
        const rover = Sol1.mkRover(x, y, dir);
        const result = Sol1.moveBackward(mars, rover);
        expect(result.x).toBe(x - 1);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(dir);
      });
      it("should wrap when going in N dir", async () => {
        const dir = Sol1.Orientation.S;
        const rover = Sol1.mkRover(x, mars.height - 1, dir);
        const result = Sol1.moveBackward(mars, rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(0);
        expect(result.orientation).toBe(dir);
      });
      it("should wrap when going in E dir", async () => {
        const dir = Sol1.Orientation.W;
        const rover = Sol1.mkRover(mars.width - 1, y, dir);
        const result = Sol1.moveBackward(mars, rover);
        expect(result.x).toBe(0);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(dir);
      });
      it("should wrap when going in S dir", async () => {
        const dir = Sol1.Orientation.N;
        const rover = Sol1.mkRover(x, 0, dir);
        const result = Sol1.moveBackward(mars, rover);
        expect(result.x).toBe(x);
        expect(result.y).toBe(mars.height - 1);
        expect(result.orientation).toBe(dir);
      });
      it("should wrap when going in W dir", async () => {
        const dir = Sol1.Orientation.E;
        const rover = Sol1.mkRover(0, y, dir);
        const result = Sol1.moveBackward(mars, rover);
        expect(result.x).toBe(mars.width - 1);
        expect(result.y).toBe(y);
        expect(result.orientation).toBe(dir);
      });
    });
  });
});
