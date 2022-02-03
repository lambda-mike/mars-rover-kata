# mars-rover-kata

## Installation

Use `nix-shell` directly or install `direnv`.

Inside nix-shell:

`pnpm install`

## Description

https://github.com/doubleloop-io/applied-fp-workshop-scala/blob/main/marsroverkata/TODO.md

Offline copy at: `description.md`

## Testing

`pnpm test`

`pnpm t -- --watch`

`pnpm exec jest --watch`

## Building

`pnpm run build`

Watch mode:

`pnpm run build -- -w`

## Running

`pnpm run app`

## Misc

`pnpm clean`

## Mob.sh

Edit `MOB_TIMER_ROOM` in `shell.nix` before you start mob session!

```sh
mob help

mob start 7 # 7 min
mob next
mob break 5
mob done # then commit and push as usual
```
