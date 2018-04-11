#!/bin/sh

set -e;

if ! git diff-files --quiet; then
    echo "Can not upgrade with unstaged uncommited changes";
    exit 1;
fi;

if ! git diff-index --quiet --cached HEAD; then
    echo "Can not upgrade with staged uncommited changes";
    exit 1;
fi;

if [ -z "$1" ]; then
    read -r -p "Upgrade all modules? [y/N] " response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])+$ ]]
    then
        npm run npm-check-updates
    else
        exit 0;
    fi
else
    if ! npm ls "$1"; then
        npm install --production --save --save-exact "$1"
    fi;

    npm run npm-check-updates -- --filter="$1"
fi;

rm package-lock.json;
rm -rf ./node_modules;
npm install;

if [ ! -f ./package-lock.json ]; then
    echo "Expected package-lock.json to be generated - are you using npm5+?"
    exit 1;
fi

npm test;

rm package-lock.json;
rm -rf ./node_modules;
npm install --production;

if [ ! -f ./package-lock.json ]; then
    echo "Expected package-lock.json to be generated - are you using npm5+?"
    exit 1;
fi

git add package.json;
git add package-lock.json;

echo 'this is where we would commit';

exit;

#if [ -z "$1" ]; then
#    git commit -m "Update version of $1"
#else
#    git commit -m "Update version of all modules"
#fi;