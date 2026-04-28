# POLLINATIONS (generation only)

This is ONLY for generating assets (text/image/audio/video).
Do NOT use this doc to choose the chat/coding model. That is handled by the editor.

## Base URL
https://gen.pollinations.ai

## Auth
Use the key from:
Antigravity/APIs/keys/.env  (POLLINATIONS_API_KEY)

Send the key as:
- Header: Authorization: Bearer <KEY>   (preferred)
OR
- Query:  ?key=<KEY>

## Endpoints
Text:
- GET /text/{prompt}

Image:
- GET /image/{prompt}

Audio (TTS / music):
- GET /audio/{text}

Video:
- GET /video/{prompt}

Optional (OpenAI-compatible chat endpoint exists):
- POST /v1/chat/completions
Do not use unless explicitly required.

## Allowed FREE generator models
IMAGE models:
- flux (default)
- zimage (fallback)
- klein (fallback)
- klein-large (fallback)
- gptimage (fallback)
- imagen-4 (alpha, last resort)
- grok-imagine (alpha, last resort)

AUDIO models:
- elevenlabs (default TTS)
- elevenmusic (music)
- whisper (audio_in, alpha)
- scribe (audio_in)

VIDEO models:
- seedance (default)
- grok-video (alpha, last resort)

## Capability notes (generators)
- image: returns an image URL that can be used in <img src="...">
- audio: returns an audio URL that can be used in <audio src="...">
- video: returns a video URL that can be used in <video src="...">
- alpha: may be unstable

## Default selection rules
- Image: use flux; if unusable, try zimage; then gptimage.
- Audio TTS: use elevenlabs.
- Video: use seedance; only use grok-video if seedance fails.
- Do not use alpha models unless non-alpha options failed.

## Common parameters (when supported)
Pass as query params:
- model=<model_id>
- width=<int>
- height=<int>
- seed=<int>

Recommended defaults:
- image width=1024 height=1024
- set seed only when you want repeatable results
