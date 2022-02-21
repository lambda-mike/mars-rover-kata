import * as T from "@effect-ts/core/Effect"
import * as HM from "@effect-ts/core/Collections/Mutable/HashMap"
import * as O from "@effect-ts/core/Option"
import * as L from "@effect-ts/core/Effect/Layer"
import * as M from "@effect-ts/core/Effect/Managed"
import { pipe } from "@effect-ts/core/Function"
import { Has } from "@effect-ts/core/Has"
import {
    IReadline,
    ReadFileError,
} from "../src/sol09/domain";
import { Logger } from "../src/sol09/logger";
import { Console } from "../src/sol09/console";
import { ReadFile } from "../src/sol09/readFile";


export class TestLogger {
    readonly error: Array<unknown> = [];
    readonly log: Array<unknown> = [];
    readonly warn: Array<unknown> = [];
    readonly debug: Array<unknown> = [];
    readonly Live: L.Layer<unknown, never, Has<Logger>>;

    constructor() {
        this.Live = L.pure(Logger)({
          _tag: "Logger",
          error: jest.fn((...args: Array<unknown>) =>
            T.succeedWith(() => {
              this.error.push([...args]);
            })),
          log: jest.fn((...args: Array<unknown>) =>
            T.succeedWith(() => {
              this.log.push([...args]);
            })),
          warn: jest.fn((...args: Array<unknown>) =>
            T.succeedWith(() => {
              this.warn.push([...args]);
            })),
          debug: jest.fn((...args: Array<unknown>) =>
            T.succeedWith(() => {
              this.debug.push([...args]);
            })),
        } as const);
    }
}

export class TestConsole {
    public cmds: string = "";
    public readConsole = jest.fn();
    public cursorTo = jest.fn(() => T.succeed(null));
    public clearScreenDown = jest.fn(() => T.succeed(null));

    readonly promptMock: Array<string> = [];
    readonly consoleMock: Array<unknown> = [];
    readonly Live: L.Layer<unknown, never, Has<Console>>;

    constructor () {
        this.cmds = "";

        const consoleM =
            M.compose_(M.service(Logger), M.succeed<IReadline>(null as any));
        const useConsole = jest.fn();
        const writeConsole = jest.fn(
            (...xs: unknown[]) =>
                T.succeedWith(() => this.consoleMock.push(...xs)));
        const clearConsole = jest.fn(() => T.succeed(null));
        const moveCursor = jest.fn(() => T.succeed(null));

        this.Live = L.pure(Console)({
            _tag: "Console",
            consoleM,
            useConsole,
            readConsole: this.readConsole,
            writeConsole,
            clearConsole,
            clearScreenDown: this.clearScreenDown,
            cursorTo: this.cursorTo,
            moveCursor,
            });
    }
}

type FileName = string;
type Contents = string;
export class TestReadFile {
    public files: HM.HashMap<FileName, Contents> = HM.make();
    public readFileMock = jest.fn(
        (filename: string): T.Effect<unknown, ReadFileError, string> => pipe(
        HM.get_(this.files, filename),
        O.fold(
            () => { throw `File '${filename}' has not been mocked!` },
            T.succeed,
        ),
    ));
    readonly Live;

    constructor() {
        this.Live = L.pure(ReadFile)({
          _tag: "ReadFile",
          readFile: this.readFileMock,
        });
    }
}
