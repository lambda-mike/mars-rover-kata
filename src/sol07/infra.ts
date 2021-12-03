import * as T from "@effect-ts/core/Effect"

export const writeConsole =
    (s: string): T.UIO<void> =>
        T.succeedWith(() => console.log(s));
