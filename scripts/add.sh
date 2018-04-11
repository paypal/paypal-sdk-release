#!/bin/bash

set -e;

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";

if [ -z "$1" ]; then
    echo 'Must specify module to add';
    exit 1;
else
    $DIR/upgrade.sh "$1";
fi;