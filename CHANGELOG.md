# Change Log

All notable changes to the "Terminal Meme Error Sounds" extension will be documented in this file.

## [1.0.0] - 2026-02-28

### Added
- Terminal output error pattern matching as fallback detection method
- Terminal close detection for non-zero exit codes
- Diagnostic logging via "Terminal Meme Sounds Log" output channel
- Troubleshooting section in README

### Fixed
- Exit code `undefined` handling in shell execution events
- Improved audio playback reliability on Windows (WPF MediaPlayer primary + WMPlayer COM fallback)

## [0.1.0] - Initial Release

### Added
- Random meme sound playback on terminal command failures
- Task process failure detection
- Configurable debounce/cooldown
- Enable/disable toggle
- Cross-platform audio (Windows, macOS, Linux)
- Test command via Command Palette