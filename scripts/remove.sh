#!/bin/bash

set -e;

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";
$DIR/validate.sh;

if [ -z "$1" ]; then
    echo "Please provide a module name to remove";
    exit 1;
else
    if ! npm ls "$1"; then
        echo "$1 is not currently a dependency";
        exit 1;
    else
        npm uninstall "$1"
    fi;
fi;

rm -rf ./node_modules;
$(which npm) install;
npm test;

if [ ! -f ./package-lock.json ]; then
    echo "Expected package-lock.json to be generated - are you using npm5+?"
    exit 1;
fi

git add package.json;
git add package-lock.json;

git commit -m "Remove $1"

git push;