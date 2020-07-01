#!/bin/bash

set -e;

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";
$DIR/validate.sh;

if [ -z "$1" ]; then
    $(npm bin)/npm-check-updates --prod --upgrade
else
    if ! npm ls "$1"; then
        npm install --only=production --production --save --save-exact "$1"
        $DIR/prune.sh;
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

rm -rf ./node_modules;
rm -rf ./package-lock.json;

$(which npm) install --production;
$DIR/prune.sh;

git add package.json;
git add package-lock.json;

if [ -z "$1" ]; then
    git commit -m "Update version of all modules"
else
    git commit -m "Update version of $1"
fi;

git push;

rm -rf ./node_modules;
rm -rf ./package-lock.json;

$(which npm) install;

git checkout package-lock.json;