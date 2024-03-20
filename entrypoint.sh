#!/bin/sh

echo "Checking that NEXT_PUBLIC_MANGATSU_API_URL var exists"
test -n "$NEXT_PUBLIC_MANGATSU_API_URL"

find /mtsu-web/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_MANGATSU_API_URL#$NEXT_PUBLIC_MANGATSU_API_URL#g"

# Setting environment variables as with Next.js standalone it has to be done this way as the next.config.mjs is baked into the server.js.
## Whitelists Next.js image domain. 
sed -i "s/\"MANGATSU_IMAGE_HOSTNAME_PLACEHOLDER\"/process.env.NEXT_MANGATSU_IMAGE_HOSTNAME || \"localhost\"/" /mtsu-web/server.js

echo "Starting Mangatsu Web"
exec "$@"
