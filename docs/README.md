# GitHub Pages Deployment

This folder contains the landing page for the Terminal Meme Error Sounds VSCode extension.

## Structure

```
docs/
├── assets/
│   ├── css/
│   │   └── style.css       # Retro-style CSS with animations
│   ├── js/
│   │   ├── memes.js        # Floating memes with gravity interaction
│   │   └── glitch.js       # Glitch effects and interactions
│   └── images/             # (Reserved for future assets)
├── favicon.svg             # Site favicon
└── index.html              # Main landing page
```

## Features

- 🎨 **Retro CRT aesthetic** with scanlines and glitch effects
- 🎭 **20+ floating meme emojis** with realistic physics (gravity, friction, bounce)
- 🖱️ **Mouse/touch gravity interaction** - memes are pulled toward your cursor
- 📱 **Fully responsive** design for all screen sizes
- ⚡ **Pure vanilla JavaScript** - no frameworks, fast load times
- 🌐 **GitHub Pages ready** - just enable Pages in repo settings

## Local Development

To test the landing page locally:

```bash
# Option 1: Python 3
cd docs
python3 -m http.server 8000

# Option 2: Node.js (with http-server)
npx http-server docs -p 8000

# Option 3: PHP
cd docs
php -S localhost:8000
```

Then open http://localhost:8000 in your browser.

## GitHub Pages Deployment

1. Go to your repository settings on GitHub
2. Navigate to **Pages** section (under "Code and automation")
3. Under **Source**, select:
   - **Branch**: `main` (or your default branch)
   - **Folder**: `/docs`
4. Click **Save**
5. Your site will be published at: `https://0xasr-dev.github.io/terminal-error-sound/`

It may take a few minutes for the site to go live after enabling Pages.

## Customization

### Adding More Meme Emojis

Edit `assets/js/memes.js` and add emojis to the `memeEmojis` array:

```javascript
this.memeEmojis = [
    '😱', '💀', '🤦', '🤷', // ... add more here
];
```

### Changing Colors

Edit `assets/css/style.css` and modify the CSS variables at the top:

```css
:root {
    --bg-primary: #0a0e27;
    --accent-cyan: #00f5ff;
    --accent-pink: #ff006e;
    /* ... more color variables */
}
```

### Adding Custom Content

Edit `index.html` to add new sections or modify existing content.

## Easter Egg

Press the **F** key on the landing page to add more floating memes! 🎉

## Notes

- This landing page is **completely separate** from the VSCode extension code
- The `docs/` folder is excluded from the extension package via `.vscodeignore`
- No build process needed - pure HTML/CSS/JS
- Works offline and doesn't require any external dependencies
