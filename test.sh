#!/usr/bin/env bash
set -euo pipefail

nix-shell --run 'pnpm test -- --watch'
