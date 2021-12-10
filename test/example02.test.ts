import * as E from "@effect-ts/core/Either"

test("example E.gen", () => {
    const fn = (x: number): E.Either<string, number> => {
        if (x > 3) {
            return E.left(`number ${x} is too big!`);
        }
        return E.right(x);
    };
    const input = 2;
    const result = E.gen(function*(_) {
        const x = yield* _(fn(input));
        const y = yield* _(fn(x + 1));
        return x + y;
    });
    //console.log(result);
    expect(result).toStrictEqual(E.right(5));
});
