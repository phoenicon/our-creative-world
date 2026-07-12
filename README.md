# 🌈 Our Creative World

A private creative-play web app for Bethan & Gwener: art gallery, weekly planner,
messages from Dad, wishes, twin mail, a sticker book, a calm space — and
**Twin Quest II**, a four-world pixel adventure game.

Built with Vite + React + TypeScript + Tailwind (originally exported from Lovable,
now self-hosted). All data lives in the browser's localStorage; there is no backend.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:8080
npm run build      # production build in dist/
```

## Twin Quest II (public/games/twin-quest.html)

A single self-contained HTML file — no build step, no dependencies.
Eight levels, unlocked in order, progress saved in localStorage:

1. 🌳 **The Greenwood** — feed the lonely dog, crate puzzle, Slime King
2. 💎 **Crystal Caves** — darkness + torch, mining, bats, 3 crystals power the lift
3. 🌊 **Flooded Ruins** — push crates into water to build bridges, magic boots, the Grumpy Frog
4. 🏰 **Slime King's Castle** — two keys, spike halls, a splitting boss, rescue the golden puppy
5. ❄️ **Frozen Peaks** — slippery ice physics, snowfall, the snowball-throwing Grumpy Yeti
6. 🌋 **Dragon's Volcano** — push crates into lava to make stone bridges, levers, a fire-breathing Baby Dragon
7. 🌙 **Moonlit Marsh** — foggy escort quest: find 3 lost bunnies and lead them home past the ghosts
8. 🌟 **Star Palace** — teleporter mazes and the Star Queen, whose stars you deflect with your sword

Beating a level awards a sticker in the app's Sticker Book (both read/write the
`ocw-stickers` localStorage key). Befriending the dog in level 1 makes it follow
you in every later world; rescuing the golden puppy in level 4 adds it to the
party too, and beating the Star Palace earns the heroes a permanent Rainbow Cape.

Testing shortcuts: `twin-quest.html?level=3` jumps straight into a level,
`?unlock=1` unlocks all levels on the map.

## Messages from Dad

[public/content/dad-messages.json](public/content/dad-messages.json) ships with the
site, so it reaches **every device** on the next deploy. To send a new message:
add an entry (unique `id`, `text`, `date`, optional `emoji`), commit, push —
the girls see it after the auto-deploy. Messages typed in the app itself stay
on that device only.

## Deployment

Pushing to `main` triggers two GitHub Actions workflows:

### GitHub Pages (always on)
`.github/workflows/deploy-pages.yml` builds with `VITE_BASE=/<repo>/` and
publishes to Pages. One-time setup: repo **Settings → Pages → Source =
"GitHub Actions"**.

### Hostinger (opt-in)
`.github/workflows/deploy-hostinger.yml` builds for the domain root and uploads
`dist/` over FTP. One-time setup in the repo's **Settings → Secrets and
variables → Actions**:

1. Secrets: `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` (from hPanel → FTP Accounts)
2. Variables: `DEPLOY_HOSTINGER` = `true` (this is the on/off switch);
   optionally `HOSTINGER_DIR` if the target isn't `public_html/`

`public/.htaccess` handles the React Router deep-link fallback on Hostinger;
the Pages workflow copies `index.html` to `404.html` for the same reason.
