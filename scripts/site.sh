#!/bin/sh
# What the Deno tasks did, with ombryt:
#   scripts/site.sh build    build, and copy the site to /var/www/hexagon.56k.guru/_site
#   scripts/site.sh stage    copy _site to _stage
#   scripts/site.sh deploy   copy _stage to _prod
set -eu
cd "$(dirname "$0")/.."
www=/var/www/hexagon.56k.guru
case "${1:-}" in
  build) ombryt build --strict && rm -rf "$www/_site" && cp -R _site "$www/_site" ;;
  stage) rm -rf "$www/_stage" && cp -R "$www/_site" "$www/_stage" ;;
  deploy) rm -rf "$www/_prod" && cp -R "$www/_stage" "$www/_prod" ;;
  *) echo "usage: $0 build|stage|deploy" >&2; exit 1 ;;
esac
