#!/bin/bash

set -e;

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";
$DIR/validate.sh;

version="$1";
tag="active";
defenvs="test local stage sandbox production";

module=$(cat << EOF | node
    const PACKAGE = './package.json';
    let pkg = require(PACKAGE);
    console.log(pkg.name);
EOF);

node $(npm bin)/check-node-version --node='>=8' --npm='>=5.8';

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

read -r -p "Activate $module at version $version for env $envs? [y/N] " response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])+$ ]]
then
    read -p "NPM 2FA Code: " twofactorcode

    for env in $envs; do
        npm dist-tag add $module@$version "$tag-$env" --otp="$twofactorcode";
    done;
else
    exit 1;
fi