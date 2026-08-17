// Content script for the ESPN fantasy football draft room.
// Watches the page for drafted players (pick history, draft board, team
// rosters, pick announcements) and marks matching players from the user's
// rankings as drafted in chrome.storage.local.

(() => {
  const { normalizeName, nameRegex, initialLastKey } = self.DraftNames;

  // Only scan inside an actual draft room — team/league pages also show player
  // names in "roster"-classed containers and would cause false positives.
  // Checked per-scan (not once) because ESPN navigates client-side.
  const inDraftRoom = () => /\/draft\b/.test(location.pathname);

  // Containers that only ever show *drafted* players. Deliberately excludes
  // the available-players list so we never false-positive on it.
  const DRAFTED_CONTAINER_SELECTORS = [
    '[class*="pick-history" i]',
    '[class*="pickHistory"]',
    '[class*="draft-board" i]',
    '[class*="draftBoard"]',
    '[class*="pick-message" i]',
    '[class*="pickMessage"]',
    '[class*="drafted" i]',
    '[class*="roster" i]',
    '[class*="mySquad" i]',
    '[class*="my-squad" i]',
    '[class*="pick-area" i]',
    '[class*="pickArea"]',
  ].join(',');

  // Never scan containers for the pick queue / autopick UI — they show
  // players who are NOT drafted yet.
  const EXCLUDED_CONTAINER_RE = /undrafted|queue|autopick/i;
  // Drop text lines that reference a *suggested* pick, e.g.
  // "Your autopick would be: Ja'Marr Chase / Cincinnati Bengals WR".
  const EXCLUDED_LINE_RE = /autopick|auto-pick|on the clock|would be|queue/i;

  const SCAN_INTERVAL_MS = 3000;
  const MUTATION_DEBOUNCE_MS = 1000;

  /** @type {Array<{name: string, norm: string, re: RegExp, abbrevRe: RegExp|null}>} */
  let players = [];
  /** @type {Record<string, true>} drafted map keyed by normalized name */
  let drafted = {};
  let scanScheduled = false;
  let lastScanAt = 0;

  function buildMatchers(rankings) {
    // Count initial+last collisions ("J. Williams" could be several players);
    // only allow abbreviated matching when the key is unique in the list.
    const abbrevCounts = new Map();
    for (const p of rankings) {
      const key = initialLastKey(normalizeName(p.name));
      if (key) abbrevCounts.set(key, (abbrevCounts.get(key) || 0) + 1);
    }

    players = rankings.map((p) => {
      const norm = normalizeName(p.name);
      const abbrevKey = initialLastKey(norm);
      const abbrevUnique = abbrevKey && abbrevCounts.get(abbrevKey) === 1;

      // Defenses: a list entry like "Houston Texans DST" appears on ESPN as
      // "Texans D/ST" (normalized: "texans d st"). Match on the nickname.
      const altRes = [];
      const parts = norm.split(' ');
      if (parts.length >= 2 && parts[parts.length - 1] === 'dst') {
        const nickname = parts[parts.length - 2];
        altRes.push(nameRegex(`${nickname} d st`), nameRegex(`${nickname} dst`));
      }

      return {
        name: p.name,
        norm,
        re: nameRegex(norm),
        abbrevRe: abbrevUnique ? nameRegex(abbrevKey) : null,
        altRes,
      };
    });
  }

  function collectDraftedText() {
    const chunks = [];
    for (const el of document.querySelectorAll(DRAFTED_CONTAINER_SELECTORS)) {
      if (EXCLUDED_CONTAINER_RE.test(String(el.className))) continue;
      // Skip nested matches; parents already contain their text.
      if (el.parentElement && el.parentElement.closest(DRAFTED_CONTAINER_SELECTORS)) continue;
      const text = el.innerText;
      if (!text) continue;
      // Filter line-by-line so an excluded phrase nested inside a legit
      // container (like the on-the-clock banner) can't leak player names in.
      const lines = text.split('\n').filter((line) => !EXCLUDED_LINE_RE.test(line));
      if (lines.length) chunks.push(lines.join('\n'));
    }
    return normalizeName(chunks.join('\n'));
  }

  async function scan() {
    lastScanAt = Date.now();
    if (!inDraftRoom() || players.length === 0) return;

    const haystack = collectDraftedText();
    if (!haystack) return;

    const newlyDrafted = [];
    for (const p of players) {
      if (drafted[p.norm]) continue;
      if (
        p.re.test(haystack) ||
        (p.abbrevRe && p.abbrevRe.test(haystack)) ||
        p.altRes.some((re) => re.test(haystack))
      ) {
        newlyDrafted.push(p);
      }
    }
    if (newlyDrafted.length === 0) return;

    // Re-read before writing so we don't clobber manual toggles from the panel.
    const { drafted: stored = {} } = await chrome.storage.local.get('drafted');
    for (const p of newlyDrafted) stored[p.norm] = true;
    drafted = stored;
    await chrome.storage.local.set({ drafted: stored, lastAutoDetect: Date.now() });
    console.log(
      '[Draft Rank Tracker] marked drafted:',
      newlyDrafted.map((p) => p.name).join(', ')
    );
  }

  function scheduleScan() {
    if (scanScheduled) return;
    scanScheduled = true;
    setTimeout(() => {
      scanScheduled = false;
      scan();
    }, MUTATION_DEBOUNCE_MS);
  }

  // Auto-reset drafted marks when this is a *different* draft room than last
  // time (new mock, new league). Keyed on the draft-identifying URL params so
  // a refresh/reconnect of the same draft never wipes progress.
  async function maybeResetForNewDraft() {
    if (!inDraftRoom()) return;
    const params = new URLSearchParams(location.search);
    const draftKey =
      location.pathname +
      '|' +
      ['leagueId', 'seasonId', 'draftId'].map((k) => params.get(k) || '').join('|');
    const { draftKey: prevKey } = await chrome.storage.local.get('draftKey');
    if (prevKey === draftKey) return;

    const update = { draftKey };
    if (prevKey !== undefined) {
      update.drafted = {};
      drafted = {};
      console.log('[Draft Rank Tracker] new draft detected — reset drafted list');
    }
    await chrome.storage.local.set(update);
  }

  async function loadState() {
    await maybeResetForNewDraft();
    const { rankings = [], drafted: storedDrafted = {} } = await chrome.storage.local.get([
      'rankings',
      'drafted',
    ]);
    drafted = storedDrafted;
    buildMatchers(rankings);
    scheduleScan();
  }

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;
    if (changes.rankings) {
      buildMatchers(changes.rankings.newValue || []);
      scheduleScan();
    }
    if (changes.drafted) {
      drafted = changes.drafted.newValue || {};
    }
  });

  const observer = new MutationObserver(() => scheduleScan());
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  // Safety net in case a UI update slips past the observer.
  setInterval(() => {
    if (Date.now() - lastScanAt >= SCAN_INTERVAL_MS) scan();
  }, SCAN_INTERVAL_MS);

  loadState();
})();
