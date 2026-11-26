#!/bin/sh
# Lighter copies of the pictures shipped with the site (public/), made while
# the web image is built (see the "pictures" stage of the Dockerfile).
#
#   lighter-pictures <public dir> <output dir>
#
# Every JPEG or PNG heavier than 100 KB becomes at most 2048 pixels on its
# longer side, same name and format, written to the output directory only when
# that is lighter. Next to it goes a WebP copy (<name>.webp) when that is
# lighter still; Caddy hands it to the browsers that accept WebP, at the
# picture's own address. Nothing in public/ itself is changed.
set -eu

if [ "${1:-}" = "--one" ]; then
  out="$2"
  f="$3"
  rel="${f#./}"
  dest="$out/$rel"
  ext="${rel##*.}"
  tmp="$dest.lighter.$ext"
  mkdir -p "$(dirname "$dest")"
  case "$ext" in
    png | PNG)
      magick "${f}[0]" -resize '2048x2048>' -strip -define png:compression-level=9 "$tmp"
      ;;
    *)
      magick "${f}[0]" -auto-orient -resize '2048x2048>' -strip -interlace JPEG \
        -sampling-factor 4:2:0 -quality 82 "$tmp"
      ;;
  esac
  before=$(wc -c < "$f")
  served=$before
  if [ "$(wc -c < "$tmp")" -lt "$before" ]; then
    served=$(wc -c < "$tmp")
    mv "$tmp" "$dest"
  else
    rm -f "$tmp"
  fi
  magick "${f}[0]" -auto-orient -resize '2048x2048>' -strip -quality 80 "$dest.webp"
  [ "$(wc -c < "$dest.webp")" -lt "$served" ] || rm -f "$dest.webp"
  exit 0
fi

in="$1"
out="$2"
mkdir -p "$out"
cd "$in"
find . -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) -size +100k -print0 \
  | xargs -0 -r -n 1 -P "$(nproc)" sh "$0" --one "$out"
echo "lighter pictures: $(find "$out" -type f ! -name '*.webp' | wc -l) replaced, $(find "$out" -type f -name '*.webp' | wc -l) WebP copies, $(du -sk "$in" | cut -f1) KB in public/"
