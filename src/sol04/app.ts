import * as readline from "node:readline"
import * as process from "node:process"
import * as As from "@effect-ts/core/Async"
import { pipe } from "@effect-ts/core/Function"
import {
    readConsole,
    readFile,
    logger,
} from "./infra";

const main = (): Promise<void> => pipe(
    As.gen(function*(_) {
        yield* _(logger.log("Welcome to Mars, Rover!"));
        const cmds = yield* _(readConsole("Please, enter commands for the Rover in 'F,B,R,L' format: "));
        yield* _(logger.log(`Rover is executing commands: ${cmds}`));
        // TODO program
    }),
    As.foldM(
        (err) => logger.error("Mission failed:", err),
        () => logger.log("Mission completed!"),
    ),
    As.runPromise,
);

(async () => {
    await main();
    process.exit(0);
})()


// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

// rl.question('What do you think of Node.js? ', (answer: string) => {
//     // TODO: Log the answer in a database
//     console.log(`Thank you for your valuable feedback: ${answer}`);

//     rl.close();
//     process.exit(0);
// });
