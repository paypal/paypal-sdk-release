#!/bin/sh

set -e;

module="paypal-braintree-web-sdk";
version="$1";
tag="active";

if [ -z "$version" ]; then
    version=$(npm view $module version);
fi;

read -r -p "Upgrade $module to $version? [y/N] " response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])+$ ]]
then
    npm dist-tag add $module@$version $tag;
fi