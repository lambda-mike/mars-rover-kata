import { pipe } from "@effect-ts/system/Function"

import { makeAssociative } from "@effect-ts/core/Associative"
import * as R from "@effect-ts/core/Collections/Immutable/Dictionary"
import * as E from "@effect-ts/core/Either"

test("example 04", () => {
    // const ValidationApplicative = E.getValidationApplicative(
    //     makeAssociative<string>((l, r) => `(${l})(${r})`)
    // )

    // const ValidationAssociative = E.getValidationAssociative(
    //     makeAssociative<Array<string>>((l, r) => [...l, ...r]),
    //     makeAssociative<Array<string>>((l, r) => [...l, ...r]),
    // )
    // const ValidationApplicative = E.getValidationApplicative(
    //     ValidationAssociative
    // )

    const ValidationApplicative = E.getValidationApplicative(
        makeAssociative<Array<string>>((l, r) => [...l, ...r])
    )

    const traverse = R.forEachF(ValidationApplicative)

    const result = pipe(
        { a: 0, b: 7, c: 8 },
        traverse((n) => (n > 3 ? E.left(["bad" + n]) : E.right(n)))
    )

    console.log(result)
})
