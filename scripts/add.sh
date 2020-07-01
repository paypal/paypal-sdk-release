#!/bin/bash

set -e;

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";
$DIR/validate.sh;

if [ -z "$1" ]; then
    echo 'Must specify module to add';
    exit 1;
else
    npm run upgrade "$1";
fi;