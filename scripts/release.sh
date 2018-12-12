#!/bin/bash

set -e;

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";
$DIR/validate.sh;

read -r -p "Release new version? [y/N] " response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])+$ ]]
then
    npm version patch;

    git push;
    git push --tags;
    npm run flatten;
    npm publish;
    git checkout package.json;
else
    exit 1;
fi
