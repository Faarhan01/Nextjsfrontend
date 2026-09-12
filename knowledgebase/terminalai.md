# Kilo Code CLI on Android / Termux

## Problem

`npm install -g @kilocode/cli` fails on Android/Termux with:

```
npm error code EBADPLATFORM
npm error notsup Unsupported platform for @kilocode/cli@7.6.2: wanted {"os":"darwin,linux,win32","cpu":"arm64,x64"} (current: {"os":"android","cpu":"arm64"})
```

The package's `os` field only allows `darwin,linux,win32`, but Termux reports `android` as the OS. Even with `--force`, the postinstall script fails because it tries to set up a binary and can't find the right platform-specific package.

## Solution: Download Pre-built Binary

Download the pre-built binary directly from GitHub releases:

```bash
# Download the linux-arm64 binary (matches Android/Termux architecture)
curl -L -o kilo.tar.gz "https://github.com/Kilo-Org/kilocode/releases/download/v7.6.2/kilo-linux-arm64.tar.gz"

# Extract it
tar xzf kilo.tar.gz

# Copy the binary to PATH
cp kilo /usr/local/bin/kilo
chmod +x /usr/local/bin/kilo

# Verify
kilo --version
```

## Alternative: Use the Official Installer

```bash
curl -fsSL https://kilo.ai/cli/install | bash
```

## Usage

```bash
# Launch interactive TUI
kilo

# Run a one-off task
kilo run "add input validation to the signup form"

# Manage authentication
kilo auth

# List available models
kilo models
```

## Notes

- The `kilo-linux-arm64.tar.gz` release asset is ~61 MB and includes the binary plus sandbox helpers (`bwrap`, `kilo-sandbox-seccomp`, etc.)
- Make sure `/usr/local/bin` is in your `PATH`
- If you need a specific version, replace `v7.6.2` in the URL with the desired tag
- Check releases at: https://github.com/Kilo-Org/kilocode/releases