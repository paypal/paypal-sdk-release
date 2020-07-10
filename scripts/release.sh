#!/bin/bash

set -e;

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";
$DIR/validate.sh;

if npm whoami &> /dev/null; then
    echo "npm username: $(npm whoami)"
else
    echo "You must be logged in to publish a release. Running 'npm login'"
    npm login
fi

USER_ROLE=$(npm org ls paypal "$(npm whoami)" --json)

PERMISSION=$(node --eval "
    let userRole = $USER_ROLE;
    console.log(userRole['$(npm whoami)']);
" "$USER_ROLE")

if [ ! "$PERMISSION" = "developer" ]; then
    echo "ERROR: You must be assigned the developer role in the npm paypal org to publish"
    exit 1;
fi

npm version patch;

git push;
git push --tags;
npm run flatten;
npm publish;
git checkout package.json;
