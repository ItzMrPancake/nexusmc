# NexusMC Network - Local Persistence & Client-Authoritative Storage Implementation Plan

## Overview & Completed Architecture
1. **100% Client-Authoritative LocalStorage Persistence (`src/utils/localStore.ts`)**:
   - `loadStoreItems()` / `saveStoreItems()`: Ranks, Crate Keys, and Boosters are committed directly to browser `localStorage`.
   - `loadStaffMembers()` / `saveStaffMembers()`: Staff roster changes persist with zero backend network delay.
   - `loadBlogPosts()` / `saveBlogPosts()`: Articles and patch notes save directly to `localStorage`.
   - `loadServerConfig()` / `saveServerConfig()`: Global webstore URLs and server settings are stored permanently.
   - Added optional background fire-and-forget sync to the server for mirroring, which never blocks the user UI or throws errors.

2. **Rank Editor & Perk Formatting**:
   - Store categories restricted to **Ranks**, **Crate Keys**, and **Boosters** (no currencies).
   - Perk lines automatically format each line into an included feature bullet with a checkmark icon.
   - Included a "Reset Defaults" option in the Store Item Editor modal for quick recovery if desired.
   - Immediate success notification confirms permanent local saving.

3. **Confidential In-Code SHA-256 Encrypted Authentication**:
   - Uses Web Crypto API (`crypto.subtle.digest('SHA-256')`) to match the encrypted hash (`44dc9c103da1ca79d903af1f578da230fa53a10efffaca3bcfd9c9b43b39f38a`).
   - Pure client-authoritative authentication: no database connection or backend response required to unlock editing.
   - Zero plaintext passwords in the UI or codebase.

4. **Live Server Integration**:
   - Server IP: `nexusmc.ultramc.co`.
   - Real-time player ping scanner active in the hero and status cards.
   - Featured gamemodes: **Custom Dungeons** and **Survival SMP** (no bedwars or skyblock).
