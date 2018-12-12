#!/bin/bash

set -e;

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";
$DIR/validate.sh;

module="@paypal/sdk-release";
version="$1";
tag="active";
defenvs="test local stage sandbox production";

node $(npm bin)/check-node-version --node='>=8' --npm='>=5.8';

if [ -z "$version" ]; then
    version=$(npm view $module version);
fi;

if [ -z "$2" ]; then
    envs="$defenvs"
else
    envs="$2"

    for env in $envs; do
        if [[ $env != "local" && $env != "stage" && $env != "standbox" && $env != "production" && $env != "test" ]]; then
            echo "Invalid env: $envs"
            exit 1;
        fi;
    done;
fi;

read -r -p "Upgrade $module to $version for env $envs? [y/N] " response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])+$ ]]
then
    for env in $envs; do
        npm dist-tag add $module@$version "$tag-$env";
    done;
else
    exit 1;
fi