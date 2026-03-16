# Republia Times — Remote Sync (JSONBin.io) Specification

## 1. Overview

Add remote persistence to the Article Editor via JSONBin.io. The editor can save/load the full article database to a cloud JSON bin, enabling cross-session and cross-machine editing without manual file export/import.

The game itself is unaffected — it still reads from `articleDatabase.ts` at build time. The remote bin is a convenience layer for the editor workflow.

---

## 2. Architecture

### 2.1 Data Flow

```
articleDatabase.ts ──(import)──> Editor (in-memory)
                                     │
                              ┌──────┼──────┐
                              ▼      ▼      ▼
                          JSONBin   JSON   TS file
                          (cloud)  (local) (clipboard)
```

### 2.2 JSONBin.io API

- **Base URL:** `https://api.jsonbin.io/v3`
- **Create bin:** `POST /b` with JSON body + headers
- **Read bin:** `GET /b/{binId}/latest`
- **Update bin:** `PUT /b/{binId}` with JSON body
- **Auth:** `X-Master-Key` header (secret API key)

### 2.3 What Gets Stored

The same JSON format as the local export:
```json
{
  "version": 1,
  "articles": [ ...ArticleData[] ]
}
```

### 2.4 Configuration

Bin ID and API key are stored in `localStorage` so the user configures them once per browser. A settings panel in the toolbar lets you enter/update them.

**Keys:**
- `republiatimes-editor-binId` — the JSONBin bin ID
- `republiatimes-editor-apiKey` — the JSONBin master key

---

## 3. User Flow

### 3.1 First-Time Setup

1. User creates a free JSONBin.io account (guided by instructions in the editor)
2. User copies their Master Key from the JSONBin dashboard
3. In the editor, user clicks "Cloud Settings" and pastes the API key
4. User clicks "Push to Cloud" — editor creates a new bin and saves the bin ID
5. Done — subsequent saves just update the existing bin

### 3.2 Ongoing Usage

- **Push:** Saves current editor state to the remote bin (full overwrite)
- **Pull:** Fetches the remote bin and replaces editor state
- **Auto-save:** Optional — save on every edit (debounced) or manual-only

### 3.3 Conflict Handling

None — last write wins. This is a single-user tool. If you pull after making local edits, you lose local changes (with a confirmation prompt).

---

## 4. UI Changes

### 4.1 Toolbar Additions

- **"Push to Cloud"** button — saves to JSONBin (disabled if no API key configured)
- **"Pull from Cloud"** button — loads from JSONBin (disabled if no bin ID)
- **Cloud status indicator** — shows "Synced" / "Local changes" / "Not configured"
- **"Cloud Settings"** button — opens a small config panel for API key + bin ID

### 4.2 Settings Panel

A simple overlay/dropdown with:
- API Key input (password field, stored in localStorage)
- Bin ID input (auto-populated on first push, editable for switching bins)
- "Test Connection" button
- Link to JSONBin.io signup page

---

## 5. Deliverables

- [ ] `src/editor/cloudSync.ts` — JSONBin API wrapper (push/pull/create)
- [ ] `src/editor/cloudConfig.ts` — localStorage config for API key + bin ID
- [ ] Updated `Toolbar.ts` — cloud buttons + settings panel
- [ ] Updated `EditorApp.ts` — wire cloud sync into state
- [ ] Guide user through JSONBin.io account creation
