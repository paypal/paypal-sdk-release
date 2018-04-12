#!/bin/sh

set -e;

module="paypal-braintree-web-sdk";
version="$1";
tag="active";
defenvs="local stage sandbox production";

if [ -z "$version" ]; then
    version=$(npm view $module version);
fi;

read -r -p "Upgrade $module to $version? [y/N] " response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])+$ ]]
then


    if [ -z "$2" ]; then
        envs="$defenvs"
    else
        envs="$2"

        for env in $envs; do
            if [[ $env != "local" && $env != "stage" && $env != "standbox" && $env != "production" ]]; then
                echo "Invalid env: $envs"
                exit 1;
            fi;
        done;
    fi;

    for env in $envs; do
        npm dist-tag add $module@$version "$tag-$env";
    done;
fi