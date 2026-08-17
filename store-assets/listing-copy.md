# Chrome Web Store Listing — Fantasy Draft Rank Tracker

Copy/paste the sections below into the Developer Dashboard.

## Store listing tab

**Name:** Fantasy Draft Rank Tracker

**Short description** (fits the 132-char limit):

> Paste your fantasy football rankings and watch drafted players get crossed off automatically during your ESPN live draft.

**Category:** Sports

**Language:** English

**Detailed description:**

> Stop juggling a printout and a second screen on draft day. Fantasy Draft
> Rank Tracker keeps your personal player rankings in a side panel right next
> to your ESPN draft room — and crosses players off automatically as they get
> drafted.
>
> HOW IT WORKS
> 1. Paste your rankings — any list with one player per line works
>    (e.g. "1. Jahmyr Gibbs, RB, DET (RB1)"). A sample top-100 board is
>    preloaded so you can try it instantly.
> 2. Open your ESPN fantasy football draft room.
> 3. As picks come in, drafted players disappear from your board and your
>    next-best available player is highlighted.
>
> FEATURES
> • Live sync with your ESPN draft room — no clicking required
> • Works with snake, auction, mock and practice drafts
> • Position filters (QB / RB / WR / TE)
> • "Show drafted" mode to see the full board with picks struck through
> • Click any player to toggle drafted manually — you're always in control
> • Auto-resets your board when you enter a new draft room
> • Smart name matching handles suffixes (Jr., III), apostrophes and
>   abbreviated names, and never guesses when two players share a name
>
> PRIVACY
> Everything stays in your browser. Your rankings and draft state are stored
> locally, nothing is sent anywhere, and the extension only runs on
> fantasy.espn.com draft pages.
>
> Not affiliated with or endorsed by ESPN. ESPN is a trademark of ESPN, Inc.

## Graphic assets (files in this folder)

| Asset | File | Size |
|---|---|---|
| Store icon | `../extension/icons/icon128.png` | 128×128 |
| Screenshot 1 | `screenshot-1.png` | 1280×800 |
| Screenshot 2 | `screenshot-2.png` | 1280×800 |
| Screenshot 3 | `screenshot-3.png` | 1280×800 |
| Small promo tile | `promo-tile-small.png` | 440×280 |
| Marquee promo tile | `promo-tile-marquee.png` | 1400×560 |

## Privacy tab

**Single purpose description:**

> Displays the user's own fantasy football player rankings in a side panel
> and automatically marks players as drafted by reading the ESPN fantasy
> football draft room page the user has open.

**Permission justifications:**

- `storage` — Saves the user's pasted rankings and per-draft drafted/available
  state locally so the list persists between sessions. No data leaves the
  device.
- `sidePanel` — The extension's entire UI is a side panel showing the
  ranking board next to the draft room.
- Host permission `https://fantasy.espn.com/*` — A content script reads the
  draft room page (pick history, draft board, rosters) to detect which
  players have been drafted. It only reads; it never modifies the page or
  interacts with the user's ESPN account.

**Data usage disclosures:** check **none** of the data-collection boxes —
the extension does not collect, transmit, sell, or share any user data.

**Privacy policy URL:**

> https://github.com/monad-droid/fantasy-side-rank-claude/blob/claude/espn-draft-tracker-extension-gtwj3b/PRIVACY.md

(Update this to the default-branch URL if the branch is merged.)

## Distribution tab

- Visibility: Public
- Distribution: Free
