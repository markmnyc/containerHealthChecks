# Static Website Template

A clean, responsive static website with hero, about, features, and contact sections.

## Live on GitHub Pages

1. Go to **Settings → Pages** in this repository
2. Under **Source**, select the branch `claude/setup-static-website-SE5bb` (or `main` once merged) and root folder `/`
3. Click **Save** — your site will be live at `https://markmnyc.github.io/containerhealthchecks/`

## Structure

```
index.html      Main page
css/styles.css  All styles (CSS variables for easy theming)
js/main.js      Nav toggle, contact form, footer year
```

## Customization

- Colors: edit the `:root` variables at the top of `css/styles.css`
- Content: edit `index.html` directly — no build step needed
