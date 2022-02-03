{withSpeech ? false, makeWrapper, espeak-ng, buildGoPackage, fetchFromGitHub, lib, ...}:
buildGoPackage rec {
    pname = "mob.sh";
    version = "2.3.0";
    owner = "remotemobprogramming";
    repo = "mob";
    src = fetchFromGitHub {
      owner = owner;
      repo = repo;
      rev = "v${version}";
      sha256 = "03vpvm1krnn9l4q00bpxg2mlq3vy0z7nxvqb02yh6ccrf8y3rfxy";
    };

    buildInputs =
      if withSpeech then
        [ espeak-ng makeWrapper ]
      else
        [];

    goPackagePath = "github.com/${owner}/${repo}/";

    subPackages = [ "." ];

    meta = {
      description = "Remote mob programming tool";
      homepage = "https://mob.sh";
      license = lib.licenses.mit;
    };

    preFixup = if withSpeech then ''
wrapProgram "$out/bin/mob" --set MOB_VOICE_COMMAND "${espeak-ng.out}/bin/espeak"
'' else "";

}
