# Fantasy Draft Rank Tracker

A Chrome extension for ESPN fantasy football drafts. Paste your player rankings
into the extension's side panel, and as players get drafted in your ESPN draft
room they are automatically crossed off your list — so you always see the best
players still available.

## Install (load unpacked)

1. Open Chrome and go to `chrome://extensions`
2. Turn on **Developer mode** (top-right toggle)
3. Click **Load unpacked** and select the `extension/` folder from this repo
4. Pin the extension, then click its toolbar icon to open the side panel

## Use

1. Click the toolbar icon — the side panel opens with a sample ranking list
   preloaded. Click **Edit list** to paste your own, one player per line:

   ```
   1. Jahmyr Gibbs, RB, DET (RB1)
   2. Bijan Robinson, RB, ATL (RB2)
   3. Ja’Marr Chase, WR, CIN (WR1)
   ```

   Rank number, position, team, and the `(RB1)` positional rank are all
   optional — a bare player name per line works too.

2. Open your ESPN draft room (`fantasy.espn.com/football/draft...`). The
   extension watches the draft room (pick history, draft board, team rosters)
   and automatically marks players from your list as drafted. Drafted players
   disappear from the panel (flip on **Show drafted** to see them struck
   through instead).

3. The top remaining player is outlined in green as your "next up." Use the
   **QB / RB / WR / TE** chips to filter by position.

4. If auto-detection ever misses a pick, just click the player in the panel to
   toggle them drafted manually. **Reset draft** clears all drafted marks
   (e.g., after a mock draft).

## How it works

- **Side panel** (`sidepanel.html/js/css`) — parses and stores your rankings in
  `chrome.storage.local`, renders the live board, and updates instantly when
  the content script marks a player drafted.
- **Content script** (`content.js`) — runs only on ESPN draft-room pages. A
  `MutationObserver` (plus a 3s safety interval) scans containers that only
  ever show *drafted* players — pick history, the draft board, team rosters —
  and never the available-players list, so players aren't falsely marked.
- **Name matching** (`normalize.js`) — normalizes names on both sides so
  cosmetic differences don't break matches: curly vs straight apostrophes
  (`De’Von` / `De'Von`), periods (`A.J.`), suffixes (`Jr.`, `III`), casing,
  and diacritics. Abbreviated draft-board names like `J. Gibbs` also match,
  but only when the initial + last name is unambiguous within your list
  (`J. Williams` never guesses between Javonte and Jameson).

Everything is stored locally in your browser; nothing leaves your machine.

## Notes

- ESPN occasionally changes its draft-room markup. The content script uses
  broad, class-pattern-based selectors to be resilient, and the manual
  click-to-toggle fallback always works regardless.
- Works with snake and auction drafts, and mock drafts (hit **Reset draft**
  between mocks).
