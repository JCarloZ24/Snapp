#!/usr/bin/env bash
set -euo pipefail
curl --fail --silent http://localhost:4000/api/health
printf '\n'
curl --fail --silent http://localhost:4000/api/agent/preview/web-001
printf '\n'
