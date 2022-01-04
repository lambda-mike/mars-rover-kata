let

  sources = import ./nix/sources.nix;

  nixpkgs = sources.nixpkgs;

  pkgs = import nixpkgs {};

  niv = (import sources.niv {}).niv;

  mob = pkgs.callPackage ./mob.nix {withSpeech = true;};

in pkgs.mkShell rec {

  name = "Mars-Rover-Kata";

  buildInputs = [
    mob
    niv
    pkgs.nodePackages.typescript-language-server
    pkgs.nodejs-16_x
    pkgs.nodePackages.pnpm
  ];
  # TODO add env var for mob timer

}
