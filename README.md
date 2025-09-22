# Docsify Slide Presentation Plugin

A lightweight, zero-dependency Docsify plugin that lets you create inline slide decks inside any Markdown page using simple HTML comment markers.

- Lightweight, no external dependency
- Works inline in any Markdown page
- Keyboard support (Left/Right)

## Features

- Create slides using markers inside Markdown
- Navigation controls and keyboard support
- Works out of the box with Docsify
- Optional Mermaid.js integration (if present on the page)

## Markers

Use these markers in your Markdown to define slides:

- `<!-- slide:start -->` to begin a slide deck
- `<!-- slide:break -->` to split slides
- `<!-- slide:end -->` to finish the deck

Example:

```markdown
<!-- slide:start -->
# Product Onboarding

Welcome to the new slides component. Use the buttons or arrow keys to navigate.

- Lightweight, no external dependency
- Works inline in any Markdown page
- Keyboard support (Left/Right)

<!-- slide:break -->

## Step 1: Install
Nothing to install — it's already bundled. Just use the markers:

- `<!-- slide:start -->` to begin
- `<!-- slide:break -->` to split slides
- `<!-- slide:end -->` to finish

<!-- slide:break -->

## Step 2: Add Content
You can include lists, images, code, and diagrams.

```js
// Code runs fine inside slides
console.log('Hello Slides!');
```

<!-- slide:end -->
```

## Installation

You can use this plugin via CDN (script tag) or install it from npm for bundlers.

### Option A: CDN (recommended)

Add the plugin and CSS in your Docsify `index.html`:

```html
<!-- Docsify core -->
<script src="https://cdn.jsdelivr.net/npm/docsify@4"></script>

<!-- Slides plugin -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/docsify-slide-presentation/dist/slides.css">
<script src="https://cdn.jsdelivr.net/npm/docsify-slide-presentation/dist/slides.js"></script>
```

The plugin auto-registers itself with Docsify when loaded.

### Option B: npm (for bundlers)

```bash
npm install docsify-slide-presentation
# or
pnpm add docsify-slide-presentation
# or
yarn add docsify-slide-presentation
```

Then import the UMD build in your app (if you embed Docsify programmatically):

```js
import DocsifySlides from 'docsify-slide-presentation/dist/slides.umd.js';

if (window.$docsify) {
  window.$docsify.plugins = [DocsifySlides].concat(window.$docsify.plugins || []);
}
```

Or, if your bundler auto-exposes globals, you can also rely on the auto-install behavior of the UMD build (it will register itself if `window.$docsify` exists).

## Configuration

You can customize behavior via `$docsify.slidesOptions` (or `$docsify.slides`, both supported):

```html
<script>
  window.$docsify = {
    name: 'My Docs',
    // ...
    slidesOptions: {
      height: 420,       // number (px) - viewport height inside the slide deck
      overflow: 'auto',  // 'auto' | 'scroll' | 'clip' - fallback for both axes
      overflowX: 'auto', // optional per-axis overrides
      overflowY: 'auto'
    }
  };
</script>
```

Notes:
- `overflow: 'clip'` maps to `overflow: hidden` to avoid scrollbars.
- When changing slides, the viewport scroll position resets to top-left.
- Mermaid diagrams inside slides are automatically initialized if `window.mermaid` is present.

## Mermaid Support (optional)

If you include Mermaid on the page, the plugin will detect and render diagrams inside slides.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/docsify-slide-presentation/dist/slides.css">
<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/docsify-slide-presentation/dist/slides.js"></script>
```

You can write Mermaid as fenced code blocks with `language-mermaid` or as `<div class="mermaid">`.

## Example

A complete example is available in `examples/index.html`. You can open it using a static server. For a quick local test:

```bash
npx serve examples
```

Then visit the printed local URL and navigate the slides.

## Development

- Source files (source of truth): `src/slides.js`, `src/slides.css`
- Distributables: `dist/slides.js`, `dist/slides.css`, `dist/slides.umd.js`

Edit files under `src/` and then update/copy builds into `dist/` before publishing. If you prefer a build step, you can add Rollup or esbuild later.

## License

MIT. See `LICENSE`.
