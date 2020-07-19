#!/bin/bash

set -e;

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";
$DIR/validate.sh;

version="$1";
tag="active";
defenvs="test local stage sandbox production";

module=$(node --eval "
    const PACKAGE = './package.json';
    let pkg = require(PACKAGE);
    console.log(pkg.name);
")

if [ -z "$version" ]; then
    version=$(npm view $module version);
fi;

if [ -z "$2" ]; then
    envs="$defenvs"
else
    envs="$2"

    for env in $envs; do
        if [[ $env != "local" && $env != "stage" && $env != "sandbox" && $env != "production" && $env != "test" ]]; then
            echo "Invalid env: $envs"
            exit 1;
        fi;
    done;
fi;

read -p "NPM 2FA Code: " twofactorcode

for env in $envs; do
    npm dist-tag add $module@$version "$tag-$env" --otp="$twofactorcode";
done;

sleep 5;

npm run cdnify;
git add cdn;
git commit -m "Activate CDN packages";
git push;

# TODO:
# - Validate CDNX command available
# - Trigger CDN release
# - Automate CDN approval (as much as possible)