#!/bin/sh
# get-scanner.sh — fetch the CSS anti-pattern scanner used by samanticlab-design.
#
# The scanner is the "impeccable" engine by Paul Bakaus, Apache License 2.0.
# https://github.com/pbakaus/impeccable — see NOTICE and LICENSE in this repo.
# We use it unmodified for its `detect` command only. Nothing else from
# impeccable is needed.
#
# Usage:  sh get-scanner.sh            (prints the path to the binary)
#         sh get-scanner.sh detect --no-config index.html   (runs it)
#
# Order: an existing copy in ~/.samanticlab/bin, then an existing impeccable
# cache (~/.impeccable/bin/<ver>/impeccable), then our own mirror, then the
# author's GitHub release. Pinned to one version so results stay repeatable.
set -eu

VERSION="0.1.5"
MIRROR_BASE="${SAMANTICLAB_SCANNER_MIRROR:-}"   # e.g. https://github.com/<you>/samanticlab-design/releases/download/scanner-v0.1.5
UPSTREAM_BASE="https://github.com/pbakaus/impeccable/releases/download/engine-v$VERSION"

case "$(uname -s 2>/dev/null || echo unknown)" in
  Darwin) os=darwin ;;
  Linux) os=linux ;;
  MINGW*|MSYS*|CYGWIN*|Windows_NT) os=windows ;;
  *) os=unknown ;;
esac
case "$(uname -m 2>/dev/null || echo unknown)" in
  arm64|aarch64) arch=arm64 ;;
  x86_64|amd64) arch=x64 ;;
  *) arch=unknown ;;
esac
exe=""; [ "$os" = windows ] && exe=".exe"

home="${HOME:-/tmp}"
dest_dir="$home/.samanticlab/bin"
dest="$dest_dir/impeccable$exe"

probe() { "$1" engine-probe 2>/dev/null | grep -q '^impeccable-engine'; }

# 1. Already fetched by us.
if [ -x "$dest" ] && probe "$dest"; then :
else
  # 2. Impeccable's own cache, if that skill was ever run here.
  cached="$home/.impeccable/bin/$VERSION/impeccable$exe"
  if [ -x "$cached" ] && probe "$cached"; then
    mkdir -p "$dest_dir" && cp "$cached" "$dest" && chmod +x "$dest"
  else
    # 3. Download: our mirror first, upstream second.
    asset="impeccable-$os-$arch$exe"
    mkdir -p "$dest_dir"
    tmp="$dest.part"
    ok=""
    for base in "$MIRROR_BASE" "$UPSTREAM_BASE"; do
      [ -z "$base" ] && continue
      url="$base/$asset"
      if command -v curl >/dev/null 2>&1; then
        curl -fsSL --retry 2 -o "$tmp" "$url" 2>/dev/null && ok=1
      elif command -v wget >/dev/null 2>&1; then
        wget -q -O "$tmp" "$url" 2>/dev/null && ok=1
      fi
      [ -n "$ok" ] && [ -s "$tmp" ] && break
      ok=""; rm -f "$tmp"
    done
    if [ -z "$ok" ]; then
      echo "get-scanner: could not download $asset. No network, or the release is gone." >&2
      echo "get-scanner: the skill can still check sections 2, 5 and 6 by hand; say so in the report." >&2
      exit 2
    fi
    mv "$tmp" "$dest" && chmod +x "$dest"
    if ! probe "$dest"; then
      rm -f "$dest"
      echo "get-scanner: downloaded file did not answer the engine probe; removed it." >&2
      exit 2
    fi
  fi
fi

if [ "$#" -eq 0 ]; then
  echo "$dest"
else
  exec "$dest" "$@"
fi
