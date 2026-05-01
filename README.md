# Mark M. — Personal Site

A combined résumé and AI-projects portfolio with a custom hero animation:
streams of source code drift down the screen and progressively decay into 1s and 0s.

## Live on GitHub Pages

The site is served from `main` at the repo root.

- **Settings → Pages → Branch:** `main`, folder `/ (root)`
- URL: `https://markmnyc.github.io/livecv/`

## Structure

```
index.html      Main page (hero, about, resume, projects, contact)
css/styles.css  Dark theme with neon accents, CSS variables for theming
js/main.js      Code → binary canvas animation + page UX
```

## Customization

- **Colors:** edit the `:root` variables at the top of `css/styles.css`
- **Animation source code:** edit the `SOURCE_LINES` array at the top of `js/main.js`
- **Resume / projects content:** edit `index.html` directly — no build step
