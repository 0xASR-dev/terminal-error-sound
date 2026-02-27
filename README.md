# 🔊 Terminal Meme Error Sounds

A VS Code extension that plays meme sounds (like "faah" or "ah shit, here we go again") whenever a terminal command fails. Because errors should at least be funny.

## Features

- 🎵 **Plays a random meme sound** on terminal command failure (non-zero exit code)
- 📋 **Smart error detection** — scans terminal output for error patterns as a fallback
- 🛠️ **Detects task failures** (e.g. `npm test`, `npm run build`) automatically
- 🎲 **Random sound selection** — picks a random clip each time
- ⏱️ **Debounce / cooldown** — prevents sound spam on rapid failures
- 🔇 **Enable/disable toggle** — turn it off without uninstalling
- 🖥️ **Cross-platform** — works on Windows, macOS, and Linux
- 🧪 **Test command** — try it anytime from the Command Palette
- 📊 **Diagnostic logs** — check the "Terminal Meme Sounds Log" output channel for troubleshooting

## How It Works

The extension uses **4 detection methods** to catch errors:

1. **Shell exit code detection** — via VS Code's shell integration API (`onDidEndTerminalShellExecution`) — triggers on non-zero exit codes
2. **Terminal output pattern matching** — via `onDidStartTerminalShellExecution` + `execution.read()` — scans output for error keywords like `error:`, `command not found`, `Traceback`, `SyntaxError`, etc.
3. **Task process failures** — via `onDidEndTaskProcess` — catches build task and test runner failures
4. **Terminal close detection** — via `onDidCloseTerminal` — catches non-zero exit when terminal is closed

When a failure is detected, it plays a random `.mp3` from `media/sounds/` using native OS audio (no webview needed).

## Installation

### From VS Code Marketplace
1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for **"Terminal Meme Error Sounds"**
4. Click **Install**

### From VSIX File
1. Download the `.vsix` file from [Releases](https://github.com/0xasr-dev/terminal-meme-error-sounds/releases)
2. Open VS Code → Extensions → `...` menu → **Install from VSIX...**

## Test Command

Open the Command Palette (`Ctrl+Shift+P`) and run:

> **Terminal Meme Sounds: Test Random Sound**

## Adding Custom Sounds

1. Drop `.mp3` files into the `media/sounds/` folder
2. Add the filename to the `soundFiles` array in `src/extension.ts`
3. Recompile with `npm run compile`

### Included Sounds

- `fahh.mp3`
- `ah-shit-here-we-go-again.mp3`

## Extension Settings

| Setting | Type | Default | Description |
|---|---|---|---|
| `terminalMemeSounds.enabled` | `boolean` | `true` | Enable/disable meme sounds |
| `terminalMemeSounds.debounceMs` | `number` | `2500` | Cooldown between sounds (ms) to prevent spam |

## Troubleshooting

If sounds aren't playing, check the diagnostic log:
1. Open the **Output** panel (`Ctrl+Shift+U`)
2. Select **"Terminal Meme Sounds Log"** from the dropdown
3. Look for error messages or missing sound files

## Requirements

- VS Code `1.93.0` or later
- **Windows**: PowerShell (pre-installed)
- **macOS**: `afplay` (pre-installed)
- **Linux**: `mpv`, `ffplay`, or `aplay`

## Release Notes

### 1.0.0

- Added terminal output error pattern matching (fallback detection)
- Added terminal close detection for non-zero exits
- Improved audio playback reliability on Windows (MediaPlayer + WMPlayer fallback)
- Added diagnostic logging via output channel
- Fixed exit code undefined handling

### 0.1.0

- Initial release
- Plays random meme sounds on terminal errors and task failures
- Configurable debounce and enable/disable settings
- Cross-platform audio playback (Windows, macOS, Linux)

---

**Enjoy your errors!** 🎵😂
