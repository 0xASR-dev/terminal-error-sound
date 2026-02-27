import * as vscode from 'vscode';
import { exec, execFile } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

let lastPlayTime = 0;
let outputChannel: vscode.OutputChannel;

const soundFiles = [
  'fahh.mp3',
  'ah-shit-here-we-go-again.mp3',
  // Add more: 'god-damn-it.mp3', 'fuuuck.mp3', etc.
];

// Common error patterns in terminal output (used as fallback detection)
const ERROR_PATTERNS = [
  /\berror\b[\s:]/i,
  /\bERR!\b/,
  /\bfailed\b/i,
  /\bFATAL\b/,
  /\bcommand not found\b/i,
  /\bis not recognized\b/i,
  /\bTraceback\b/,
  /\bSyntaxError\b/,
  /\bTypeError\b/,
  /\bReferenceError\b/,
  /\bModuleNotFoundError\b/,
  /\bPermission denied\b/i,
  /\bENOENT\b/,
  /\bsegmentation fault\b/i,
];

function log(msg: string) {
  const timestamp = new Date().toLocaleTimeString();
  outputChannel.appendLine(`[${timestamp}] ${msg}`);
}

function playSoundFile(filePath: string) {
  // Verify the file exists first
  if (!fs.existsSync(filePath)) {
    log(`❌ Sound file NOT FOUND: ${filePath}`);
    return;
  }
  log(`🔊 Playing sound: ${filePath}`);

  const escaped = filePath.replace(/'/g, "''");
  if (process.platform === 'win32') {
    // Use WPF MediaPlayer (works with MP3) via PowerShell
    const ps = `
      Add-Type -AssemblyName presentationCore
      $player = New-Object System.Windows.Media.MediaPlayer
      $player.Open([Uri]'${escaped}')
      Start-Sleep -Milliseconds 300
      $player.Play()
      Start-Sleep -Seconds 5
      $player.Stop()
      $player.Close()
    `;
    execFile('powershell.exe', ['-NoProfile', '-NonInteractive', '-WindowStyle', 'Hidden', '-Command', ps], (err) => {
      if (err) {
        log(`⚠️ PowerShell MediaPlayer failed: ${err.message}. Trying WMPlayer fallback...`);
        // Fallback to WMPlayer COM object
        const psFallback = `
          try {
            $p = New-Object -ComObject WMPlayer.OCX.7;
          } catch {
            $p = New-Object -ComObject WMPlayer.OCX;
          }
          $p.URL = '${escaped}';
          $p.controls.play() | Out-Null;
          Start-Sleep -Seconds 4;
          $p.controls.stop() | Out-Null;
        `;
        execFile('powershell.exe', ['-NoProfile', '-NonInteractive', '-WindowStyle', 'Hidden', '-Command', psFallback], (err2) => {
          if (err2) {
            log(`⚠️ WMPlayer fallback also failed: ${err2.message}. Trying cmd start...`);
            execFile('cmd.exe', ['/c', 'start', '', filePath], (err3) => {
              if (err3) {
                log(`❌ All playback methods failed: ${err3.message}`);
              }
            });
          } else {
            log(`✅ Sound played via WMPlayer fallback`);
          }
        });
      } else {
        log(`✅ Sound played via PowerShell MediaPlayer`);
      }
    });
  } else if (process.platform === 'darwin') {
    exec(`afplay '${escaped}'`, (err) => {
      if (err) {
        log(`❌ afplay failed: ${err.message}`);
      }
    });
  } else {
    exec(`mpv --no-video '${escaped}' || ffplay -nodisp -autoexit '${escaped}' || aplay '${escaped}'`, (err) => {
      if (err) {
        log(`❌ Linux playback failed: ${err.message}`);
      }
    });
  }
}

function playRandomMemeSound(context: vscode.ExtensionContext, reason: string) {
  const config = vscode.workspace.getConfiguration('terminalMemeSounds');
  if (!config.get<boolean>('enabled')) {
    log(`⏸️ Sound skipped (disabled in settings). Trigger: ${reason}`);
    return;
  }

  const debounce = config.get<number>('debounceMs') || 2500;
  if (Date.now() - lastPlayTime < debounce) {
    log(`⏸️ Sound skipped (debounce ${debounce}ms). Trigger: ${reason}`);
    return;
  }
  lastPlayTime = Date.now();

  const randomFile = soundFiles[Math.floor(Math.random() * soundFiles.length)];
  const soundPath = path.join(context.extensionPath, 'media', 'sounds', randomFile);
  log(`🎯 Triggered by: ${reason} → Playing: ${randomFile}`);
  playSoundFile(soundPath);
}

function containsErrorPattern(text: string): RegExp | null {
  for (const pattern of ERROR_PATTERNS) {
    if (pattern.test(text)) {
      return pattern;
    }
  }
  return null;
}

export function activate(context: vscode.ExtensionContext) {
  // Create output channel for diagnostics
  outputChannel = vscode.window.createOutputChannel('Terminal Meme Sounds Log');
  context.subscriptions.push(outputChannel);

  log('🚀 Terminal Meme Error Sounds activating...');
  log(`Extension path: ${context.extensionPath}`);
  log(`Platform: ${process.platform}`);

  // Verify sound files exist
  const soundsDir = path.join(context.extensionPath, 'media', 'sounds');
  log(`Sounds directory: ${soundsDir}`);
  if (fs.existsSync(soundsDir)) {
    const files = fs.readdirSync(soundsDir);
    log(`Sound files found: ${files.join(', ')}`);
  } else {
    log(`❌ Sounds directory does NOT exist!`);
  }

  // Test command (Ctrl+Shift+P → "Terminal Meme Sounds: Test Random Sound")
  context.subscriptions.push(
    vscode.commands.registerCommand('terminalMemeSounds.test', () => {
      log('🧪 Test command triggered manually');
      playRandomMemeSound(context, 'Manual test command');
      vscode.window.showInformationMessage('🎵 Meme sound test fired!');
    })
  );

  // === Detection Method 1: Shell integration — exit code based ===
  log('Registering onDidEndTerminalShellExecution listener...');
  context.subscriptions.push(
    vscode.window.onDidEndTerminalShellExecution((event) => {
      const cmd = event.execution.commandLine?.value || '(unknown)';
      log(`📌 Shell execution ended: command="${cmd}", exitCode=${event.exitCode}`);
      if (event.exitCode !== undefined && event.exitCode !== 0) {
        playRandomMemeSound(context, `Shell execution failed: "${cmd}" (exit code: ${event.exitCode})`);
      }
    })
  );

  // === Detection Method 2: Shell integration — terminal output pattern matching ===
  log('Registering onDidStartTerminalShellExecution listener for output reading...');
  context.subscriptions.push(
    vscode.window.onDidStartTerminalShellExecution((event) => {
      const cmd = event.execution.commandLine?.value || '(unknown)';
      log(`▶️ Shell execution started: command="${cmd}"`);

      // Read the terminal output stream in background
      (async () => {
        try {
          const stream = event.execution.read();
          for await (const data of stream) {
            const matched = containsErrorPattern(data);
            if (matched) {
              const preview = data.substring(0, 80).replace(/\r?\n/g, '\\n');
              log(`📋 Output matched error pattern ${matched}: "${preview}..."`);
              playRandomMemeSound(context, `Terminal output matched pattern ${matched} in command "${cmd}"`);
            }
          }
        } catch (err) {
          log(`⚠️ Error reading terminal output stream: ${err}`);
        }
      })();
    })
  );

  // === Detection Method 3: Task process failures (npm test, build, etc.) ===
  context.subscriptions.push(
    vscode.tasks.onDidEndTaskProcess((e) => {
      log(`📌 Task ended: exitCode=${e.exitCode}`);
      if (e.exitCode && e.exitCode !== 0) {
        playRandomMemeSound(context, `Task failed (exit code: ${e.exitCode})`);
      }
    })
  );

  // === Detection Method 4: Terminal closed with non-zero exit ===
  context.subscriptions.push(
    vscode.window.onDidCloseTerminal((terminal) => {
      if (terminal.exitStatus && terminal.exitStatus.code && terminal.exitStatus.code !== 0) {
        log(`📌 Terminal closed with non-zero exit: code=${terminal.exitStatus.code}`);
        playRandomMemeSound(context, `Terminal closed with exit code: ${terminal.exitStatus.code}`);
      }
    })
  );

  log('🎉 Terminal Meme Error Sounds fully activated!');
  log('💡 Tip: To test, run a failing command like "fakecmd123" or use the test command (Ctrl+Shift+P → "Terminal Meme Sounds: Test Random Sound")');
  vscode.window.showInformationMessage('Terminal Meme Error Sounds is ready! Try a failing command or use the test command.');
}

export function deactivate() { }
