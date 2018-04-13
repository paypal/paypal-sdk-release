#!/bin/sh

set -e;

module="paypal-braintree-web-sdk";
version="$1";
tag="active";
defenvs="test local stage sandbox production";

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
fi