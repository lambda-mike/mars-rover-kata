FROM nixos/nix:2.7.0

RUN nix-channel --update

WORKDIR /app

COPY nix/ /app/nix
COPY shell.nix /app/
COPY package.json /app/
COPY pnpm-lock.yaml /app/
COPY tsconfig.json /app/
COPY jest.config.js /app/
COPY test.sh /app/

RUN nix-shell --run 'pnpm install'

CMD ["/app/test.sh"]
