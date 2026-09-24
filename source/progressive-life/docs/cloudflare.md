# Cloudflare Deployment

progressive-life is deployed as a static/runtime View through Cloudflare in the current implementation.
GitHub remains the Canon and Cloudflare is the runtime/distribution layer.

GitHub → validate → build → deploy → Public View

R2 can hold voice/audio artifacts, D1 can hold current state, and Workers can provide API/interface. Providers remain replaceable.
