# Valet — AI-native homelab homepage and dashboard. Deploy on Railway with one click.

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/Qb2-7b)

One-click Railway packaging of [Valet](https://github.com/askvalet/valet) (MIT): a homepage for your homelab with
widgets for Plex, Home Assistant, Sonarr/Radarr, Immich, Pi-hole, Uptime Kuma and more, plus a built-in assistant that
talks to any OpenAI-compatible model (Ollama, OpenRouter, OpenAI) or Anthropic.

This repo uses the official image `ghcr.io/askvalet/valet:0.6.1` unmodified, with a small start wrapper.

## What the template sets up
- One service on port 8080 (public HTTPS domain), health check `/healthz`.
- One volume at `/data`: `config/config.yaml` (your Valet config, edits apply live) and `data/` (accounts, uploads, icon cache).
- **Sign-in is on** (`auth.mode: local`). The owner account `admin` is created on first boot with the generated
  `VALET_ADMIN_PASSWORD` (see the service's Variables tab). Without sign-in Valet would be read-only.
- `allowedHosts` covers `*.up.railway.app` and Railway's health probe. Add your custom domain to it if you use one.

## Variables
| Variable | Default | Purpose |
|---|---|---|
| `VALET_ADMIN_PASSWORD` | generated | Password for the `admin` owner account, created on first boot only |
| `VALET_ADMIN_USER` | `admin` (baked) | Name of the first account |

## After deploy
1. Open the Railway domain and sign in as `admin` with `VALET_ADMIN_PASSWORD`.
2. Edit `/data/config/config.yaml` (Railway shell or the assistant's setup tools) to add integrations and a model.
   Put API keys in Railway variables and reference them as `${NAME}` in the config.
3. Change the password later from the page, or `node dist/server.js user passwd admin` in the Railway shell.

Changing `VALET_ADMIN_PASSWORD` after the first boot does not change an existing account.
