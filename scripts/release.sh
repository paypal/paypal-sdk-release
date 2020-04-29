#!/bin/bash

set -e;

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";
$DIR/validate.sh;

npm version patch;

git push;
git push --tags;
npm run flatten;
npm publish;
git checkout package.json;
