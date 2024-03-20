#!/bin/sh



echo "Checking NEXT_PUBLIC_MANGATSU_API_UR and NEXT_INTERNAL_MANGATSU_API_URL environmentals"
test -n "$NEXT_PUBLIC_MANGATSU_API_URL"
test -n "$NEXT_INTERNAL_MANGATSU_API_URL"

echo "Setting NEXT_PUBLIC_MANGATSU_API_UR and NEXT_INTERNAL_MANGATSU_API_URL environmentals"
find /mtsu-web/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_MANGATSU_API_URL#$NEXT_PUBLIC_MANGATSU_API_URL#g"
find /mtsu-web/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_INTERNAL_MANGATSU_API_URL#$NEXT_INTERNAL_MANGATSU_API_URL#g"

# Whitelisting Next.js image domain.
# When using Next.js standalone it has to be done this way as the next.config.mjs is baked into the server.js.
sed -i "s/\"MANGATSU_IMAGE_HOSTNAME_PLACEHOLDER\"/process.env.NEXT_MANGATSU_IMAGE_HOSTNAME || \"localhost\"/" /mtsu-web/server.js

echo "Starting Mangatsu Web"
exec "$@"
