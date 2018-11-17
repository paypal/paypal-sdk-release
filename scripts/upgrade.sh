#!/bin/bash

set -e;

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";
$DIR/validate.sh;

if [ -z "$1" ]; then
    read -r -p "Upgrade all modules? [y/N] " response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])+$ ]]
    then
        $(npm bin)/npm-check-updates --prod --upgrade
    else
        exit 1;
    fi
else
    if ! npm ls "$1"; then
        npm install --production --save --save-exact "$1"
    else
        $(npm bin)/npm-check-updates --prod --upgrade --filter="$1"
    fi;
fi;

rm -rf ./node_modules;
rm -rf ./package-lock.json;

$(which npm) install;
npm test;

if [ ! -f ./package-lock.json ]; then
    echo "Expected package-lock.json to be generated - are you using npm5+?"
    exit 1;
fi

git add package.json;
git add package-lock.json;

if [ -z "$1" ]; then
    git commit -m "Update version of all modules"
else
    git commit -m "Update version of $1"
fi;

git push;