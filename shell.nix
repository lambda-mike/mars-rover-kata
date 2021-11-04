let

  sources = import ./nix/sources.nix;

  nixpkgs = sources.nixpkgs;

  pkgs = import nixpkgs {};

  niv = (import sources.niv {}).niv;

in pkgs.mkShell rec {

  name = "Mars-Rover-Kata";

  buildInputs = [
    niv
    pkgs.nodejs-16_x
    pkgs.nodePackages.pnpm
  ];

}
