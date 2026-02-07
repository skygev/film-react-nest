#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
REPO_ROOT="$(dirname "$0")/../../.."
COLLECTION_PATH="${REPO_ROOT}/film.postman.json"
ENV_PATH="${REPO_ROOT}/film.postman.env.json"
WAIT_TIMEOUT="${WAIT_TIMEOUT:-60}"
WAIT_INTERVAL=2

echo "Using BASE_URL=${BASE_URL}"
echo "Collection file: ${COLLECTION_PATH}"

if [[ ! -f "${COLLECTION_PATH}" ]]; then
  echo "Collection file not found: ${COLLECTION_PATH}" >&2
  exit 1
fi

if command -v newman >/dev/null 2>&1; then
  echo "newman is already installed"
else
  echo "Installing newman..."
  npm install --silent --no-progress -g newman >/dev/null 2>&1 || {
    echo "Failed to install newman" >&2
    exit 1
  }
fi

WAIT_START=$(date +%s)
while true; do
  if curl --silent --max-time 1 "${BASE_URL}/api/afisha/films" >/dev/null; then
    echo "Backend is up"
    break
  fi
  NOW=$(date +%s)
  ELAPSED=$((NOW - WAIT_START))
  if [[ ${ELAPSED} -ge ${WAIT_TIMEOUT} ]]; then
    echo "Timeout waiting for backend at ${BASE_URL}" >&2
    exit 1
  fi
  sleep ${WAIT_INTERVAL}
done

if [[ -f "${ENV_PATH}" ]]; then
  newman run "${COLLECTION_PATH}" \
    --env-var "baseUrl=${BASE_URL}/api/afisha" \
    -e "${ENV_PATH}"
else
  newman run "${COLLECTION_PATH}" \
    --env-var "baseUrl=${BASE_URL}/api/afisha"
fi
