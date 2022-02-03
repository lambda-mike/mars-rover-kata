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

  shellHook = ''
    export MOB_TIMER_ROOM=you-team-name-goes-here
  '';

}
