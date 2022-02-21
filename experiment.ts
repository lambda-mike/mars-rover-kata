console.clear();

console.log("Hello World!\n");

process.stdout.write("one, two three\n");
process.stdout.write("one, two three\n");

setTimeout(() => {
    process.stdout.cursorTo(0, 2);
    process.stdout.clearScreenDown(() => process.stdout.write("four, \x1b[33mfive\x1b[0m, six\n"));
}, 3000);

process.stdin.read()
