# Termux Proot Distro — Development Environment Setup

## What Is This?

A **proot distro** lets you run a full Linux distribution (Ubuntu, Debian, etc.) inside Termux on Android using `proot` — a user-space implementation of `chroot`. This provides a standard Linux filesystem and toolchain for development that works where native Termux packages may not.

## Prerequisites

- Termux installed on Android
- Proot distro installed (`termux-install-proot-distro` or `proot-distro` package)
- At least 5GB free storage (for Node.js toolchain + node_modules)

## 1. Install a Proot Distro

```bash
# In Termux
pkg update && pkg upgrade -y
pkg install proot-distro -y

# Install Ubuntu (or Debian)
proot-distro install ubuntu
```

## 2. Enter the Distro

```bash
proot-distro login ubuntu
```

You are now in a full Ubuntu environment with `apt`, `bash`, standard Linux paths (`/usr`, `/home`, etc.).

## 3. Set Up Node.js & npm

### Option A: NodeSource Repository (Recommended)

```bash
# Inside the proot distro
apt update && apt install -y curl ca-certificates gnupg

# Install Node.js 26 LTS
curl -fsSL https://deb.nodesource.com/setup_26.x | bash -
apt install -y nodejs

# Verify
node --version   # v26.x.x
npm --version    # 11.x.x
```

### Option B: nvm (Alternative)

```bash
# Inside the proot distro
apt install -y curl git build-essential
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

source ~/.bashrc
nvm install 26
nvm use 26
```

## 4. Install Build Tools

```bash
# Required for native Node.js modules
apt install -y build-essential python3 pkg-config libssl-dev

# Optional: bun package manager
curl -fsSL https://bun.sh/install | bash
# Add to PATH: export BUN_INSTALL="$HOME/.bun" && export PATH="$BUN_INSTALL/bin:$PATH"
```

## 5. Mount / Workspace Access

The proot distro has its own filesystem. To access your project workspace:

### Option A: Bind Mount (Recommended)

```bash
# From Termux (not inside proot), start the distro with bind mount
proot-distro login ubuntu --bind /root/workspace:/root/workspace
```

### Option B: Symlink

```bash
# Inside proot distro, symlink to Termux storage
ln -s /data/data/com.termux/files/home/root/workspace /root/workspace
```

### Access the Project

```bash
cd /root/workspace/nextjsstore1/Nextjsfrontend/Nextjsfrontend
```

## 6. Install Project Dependencies

```bash
cd /root/workspace/nextjsstore1/Nextjsfrontend/Nextjsfrontend
npm install
```

> **Note**: `node_modules` is large (~620MB). Install inside the project directory, not globally.

## 7. Environment Variables

Create `.env` from the example:

```bash
cp .env.example .env
```

Edit `.env` as needed:
- `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
- `NEXT_PUBLIC_MEDUSA_BACKEND_URL` (leave blank for mock data)
- `PORT=3000`

## 8. Start the Dev Server

```bash
cd frontend
npx next dev --webpack
```

The server starts at `http://localhost:3000` (or `http://localhost:3001` if 3000 is in use).

> **Important**: Always use `--webpack` flag. Turbopack has known issues in proot distro environments.

## 9. Access from Android

The dev server binds to `0.0.0.0`. Access from your Android browser:

```
http://localhost:3000
```

Or find your device IP:
```bash
# In Termux (not proot)
ip addr show wlan0
# Access via http://<device-ip>:3000 from another device on same network
```

## Common Issues & Fixes

### Port 3000 Already in Use

```bash
# Kill the process on port 3000
fuser -k 3000/tcp
# Or from Termux
lsof -i :3000
kill <pid>
```

### npm install Fails with EACCES

```bash
# Inside proot distro — fix permissions
sudo chown -R $(whoami):$(whoami) ~/.npm
npm config set prefix ~/npm-global
export PATH=~/npm-global/bin:$PATH
```

### Tailwind CSS Errors

If you see `@import "tailwindcss"` errors:
- This project uses **Tailwind v3** (`tailwindcss@3.4.17`)
- Remove `@import "tailwindcss"` from CSS (v4 syntax)
- Use v3 directives: `@tailwind base; @tailwind components; @tailwind utilities;`

### Memory / Performance Issues

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
# Then run npm run dev
```

### Next.js Server Crashes on Exit

This is a proot + WebSocket issue. Use `--webpack` and avoid Turbopack:

```bash
cd frontend && npx next dev --webpack
```

### SSH / Git Authentication

Generate SSH keys inside the proot distro or use HTTPS with a Personal Access Token:

```bash
# HTTPS with PAT
git remote set-url origin https://<YOUR_PAT>@github.com/Faarhan01/Nextjsfrontend.git

# Or SSH (keys must be generated in Termux, not proot)
ssh-keygen -t ed25519 -C "your@email.com"
cat ~/.ssh/id_ed25519.pub
# Add to GitHub → Settings → SSH Keys
```

## File Layout in Proot Distro

```
/home/ubuntu/
├── .bashrc
├── .npmrc
├── workspace/                          # Symlinked or bind-mounted
│   └── nextjsstore1/
│       └── Nextjsfrontend/
│           └── Nextjsfrontend/
│               ├── frontend/           # Next.js app (dev server runs here)
│               ├── backend/            # Express/Medusa server
│               ├── node_modules/       # Installed via npm install
│               ├── package.json        # Root scripts
│               └── knowledgebase/      # Project docs
```

## Pro Tips

1. **Keep the dev server in Termux**: The proot distro handles builds, but keeping the server process in Termux avoids WebSocket issues.
2. **Use `tmux` or `screen`**: Prevent the server from dying when you close Termux:
   ```bash
   pkg install tmux
   tmux new -s dev
   cd frontend && npx next dev --webpack
   # Detach: Ctrl+B, then D
   # Reattach: tmux attach -t dev
   ```
3. **Sync with GitHub from Termux**: Use HTTPS PAT or SSH keys configured in Termux (not inside proot).
4. **Backup**: The workspace directory persists across proot distro reinstalls if it's bind-mounted or in shared storage.
