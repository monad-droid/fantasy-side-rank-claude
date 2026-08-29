// Side panel UI: paste/parse rankings, render the board, live-sync drafted
// state written by the content script, allow manual toggles.

const { normalizeName } = DraftNames;

const els = {
  editor: document.getElementById('editor'),
  input: document.getElementById('rankingsInput'),
  parseStatus: document.getElementById('parseStatus'),
  tiersInput: document.getElementById('tiersInput'),
  loadTiersBtn: document.getElementById('loadTiersBtn'),
  clearTiersBtn: document.getElementById('clearTiersBtn'),
  tierStatus: document.getElementById('tierStatus'),
  targetsInput: document.getElementById('targetsInput'),
  loadTargetsBtn: document.getElementById('loadTargetsBtn'),
  clearTargetsBtn: document.getElementById('clearTargetsBtn'),
  targetStatus: document.getElementById('targetStatus'),
  editBtn: document.getElementById('editBtn'),
  resetBtn: document.getElementById('resetBtn'),
  loadBtn: document.getElementById('loadBtn'),
  cancelBtn: document.getElementById('cancelBtn'),
  posFilters: document.getElementById('posFilters'),
  showDrafted: document.getElementById('showDrafted'),
  counts: document.getElementById('counts'),
  list: document.getElementById('playerList'),
  emptyState: document.getElementById('emptyState'),
};

let rankings = [];
let drafted = {};
let tiers = {};
let targets = {};
let avoid = {};
let activePos = 'ALL';

// Matches lines like:
//   "1. Jahmyr Gibbs, RB, DET (RB1)"   (rank, name, pos, team, pos-rank)
//   "1. Bijan Robinson, ATL (RB1)"     (no position column)
//   "143. Houston Texans DST, HOU (DST1)"
//   "Josh Allen"
const LINE_RE =
  /^\s*(?:(\d+)[.):\-]?\s+)?([^,]+?)(?:\s*,\s*([A-Za-z/]{1,4}))?(?:\s*,\s*([A-Za-z]{2,4}))?\s*(?:\(([^)]+)\))?\s*$/;

const POS_TOKENS = new Set(['QB', 'RB', 'WR', 'TE', 'K', 'DST', 'D/ST', 'DEF', 'PK', 'FLEX']);

function canonicalPos(raw) {
  const p = String(raw || '').toUpperCase();
  if (p === 'D/ST' || p === 'DEF') return 'DST';
  if (p === 'PK') return 'K';
  return p;
}

// Tab-separated lines, e.g. "Jahmyr Gibbs\tDET\tRB" (optionally with a
// leading rank column and/or a positional-rank column in any order).
function parseTabLine(line) {
  const fields = line.split('\t').map((f) => f.trim()).filter(Boolean);
  if (fields.length < 2) return null;
  let rank = null;
  if (/^\d+[.)]?$/.test(fields[0])) rank = parseInt(fields.shift(), 10);
  const name = fields.shift();
  // Reject rank-like leftovers, but keep real names that start with a digit
  // ("49ers").
  if (!name || /^\d+[.)]?$/.test(name)) return null;

  let pos = '';
  let team = '';
  let posRank = '';
  for (const f of fields) {
    const canon = canonicalPos(f);
    if (POS_TOKENS.has(canon)) pos = canon;
    else if (/^(QB|RB|WR|TE|K|PK|DST|DEF)\d+$/i.test(f)) posRank = f.toUpperCase();
    else if (/^[A-Za-z]{2,4}$/.test(f) && !team) team = f.toUpperCase();
  }
  if (!pos && posRank) pos = canonicalPos(posRank.match(/^[A-Za-z]+/)[0]);
  return { rank, name, pos, team, posRank };
}

function parseRankings(text) {
  const players = [];
  const errors = [];
  const seen = new Set();

  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.includes('\t')) {
      const p = parseTabLine(line);
      if (!p) {
        errors.push(line);
        continue;
      }
      const norm = normalizeName(p.name);
      if (!norm || seen.has(norm)) continue;
      seen.add(norm);
      players.push({
        rank: p.rank || players.length + 1,
        name: p.name,
        pos: p.pos,
        team: p.team,
        posRank: p.posRank,
        norm,
      });
      continue;
    }

    const m = line.match(LINE_RE);
    if (!m || !m[2]) {
      errors.push(line);
      continue;
    }
    const name = m[2].trim();
    const norm = normalizeName(name);
    if (!norm || seen.has(norm)) continue;
    seen.add(norm);

    // The first comma field is a position ("RB") or, when the position column
    // is omitted, the team ("ATL"). Disambiguate via known position tokens.
    let pos = (m[3] || '').toUpperCase();
    let team = (m[4] || '').toUpperCase();
    if (pos && !POS_TOKENS.has(pos)) {
      if (!team) team = pos;
      pos = '';
    }
    pos = canonicalPos(pos);
    const posRank = m[5] || '';
    if (!pos && posRank) {
      const prefix = canonicalPos((posRank.match(/^([A-Za-z/]+)/) || [])[1]);
      if (POS_TOKENS.has(prefix) || prefix === 'DST' || prefix === 'K') pos = prefix;
    }

    players.push({
      rank: m[1] ? Number(m[1]) : players.length + 1,
      name,
      pos,
      team,
      posRank,
      norm,
    });
  }
  return { players, errors };
}

// Parse a tier article/list: "Tier N: ..." headers set the current tier, and
// short "Player Name, TEAM" lines under them get that tier number. Everything
// else (prose paragraphs, photo captions) is ignored. Tier numbering restarts
// per position section, which is fine — each player belongs to one position.
const TIER_HEADER_RE = /^tier\s+(\d+)\b/i;
const TIER_PLAYER_RE = /^([A-Za-z][A-Za-z .'’’-]{1,39}?),\s*([A-Z]{2,4})\s*$/;
// Bare-name line ("Rome Odunze"). Junk short prose lines are harmless — a tier
// only shows for players actually on the board.
const TIER_BARE_NAME_RE = /^[A-Za-z][A-Za-z0-9 .'’-]{1,39}$/;

function parseTiers(text) {
  const tierMap = {};
  let current = null;
  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;
    const header = line.match(TIER_HEADER_RE);
    if (header) {
      current = Number(header[1]);
      continue;
    }
    if (current === null) continue;
    const m = line.match(TIER_PLAYER_RE);
    const name = m ? m[1] : TIER_BARE_NAME_RE.test(line) ? line : null;
    if (!name) continue;
    const norm = normalizeName(name);
    if (norm && !(norm in tierMap)) tierMap[norm] = current;
  }
  return tierMap;
}

// Parse a targets list: one player per line. Anything after a comma or tab
// ("DJ Moore, Buffalo Bills", "Rome Odunze\tCHI\tWR") is ignored, so article
// player-header lines paste straight in; long prose lines are skipped. Junk
// short lines are harmless — the indicator only shows for ranked players.
const TARGET_LINE_RE = /^([A-Za-z][A-Za-z0-9 .'’-]{1,39}?)(?:[,\t].*)?$/;

function parseTargets(text) {
  const targetMap = {};
  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.length > 60) continue;
    const m = line.match(TARGET_LINE_RE);
    if (!m) continue;
    const norm = normalizeName(m[1]);
    if (norm) targetMap[norm] = true;
  }
  return targetMap;
}

function posClass(pos) {
  return ['QB', 'RB', 'WR', 'TE', 'K', 'DST'].includes(pos) ? `pos-${pos}` : 'pos-other';
}

function render() {
  const showDrafted = els.showDrafted.checked;
  els.list.textContent = '';
  els.emptyState.classList.toggle('hidden', rankings.length > 0);

  let available = 0;
  let draftedCount = 0;
  let nextUpMarked = false;
  const frag = document.createDocumentFragment();

  for (const p of rankings) {
    const isDrafted = Boolean(drafted[p.norm]);
    if (isDrafted) draftedCount++;
    else available++;

    if (activePos !== 'ALL' && p.pos !== activePos) continue;
    if (isDrafted && !showDrafted) continue;

    const li = document.createElement('li');
    li.className = 'player' + (isDrafted ? ' drafted' : '');
    const isAvoid = Boolean(avoid[p.norm]);
    if (isAvoid) li.classList.add('avoid');
    if (!isDrafted && !isAvoid && !nextUpMarked) {
      li.classList.add('next-up');
      nextUpMarked = true;
    }
    li.dataset.norm = p.norm;
    li.title = isDrafted ? 'Click to mark available' : 'Click to mark drafted';

    const rank = document.createElement('span');
    rank.className = 'rank';
    rank.textContent = p.rank;

    const pos = document.createElement('span');
    pos.className = `pos ${posClass(p.pos)}`;
    pos.textContent = p.posRank || p.pos || '—';

    const name = document.createElement('span');
    name.className = 'name';
    name.textContent = p.name;

    const team = document.createElement('span');
    team.className = 'team';
    team.textContent = p.team;

    li.append(rank, pos, name);
    if (isAvoid) {
      const dnd = document.createElement('span');
      dnd.className = 'dnd';
      dnd.textContent = 'DND';
      dnd.title = 'On the do-not-draft list';
      li.append(dnd);
    }
    if (targets[p.norm]) {
      const target = document.createElement('span');
      target.className = 'target';
      target.textContent = '🎯';
      target.title = 'Draft target';
      li.append(target);
    }
    const tierNum = tiers[p.norm];
    if (tierNum) {
      const tier = document.createElement('span');
      tier.className = `tier tier-${Math.min(tierNum, 8)}`;
      tier.textContent = `T${tierNum}`;
      tier.title = `Tier ${tierNum} at ${p.pos || 'position'}`;
      li.append(tier);
    }
    li.append(team);
    frag.appendChild(li);
  }

  els.list.appendChild(frag);
  els.counts.textContent = rankings.length
    ? `${available} available · ${draftedCount} drafted`
    : '';
}

async function saveRankings(players, source = 'user') {
  rankings = players;
  await chrome.storage.local.set({
    rankings: players,
    rankingsSource: source,
    defaultsVersion: DEFAULT_RANKINGS_VERSION,
  });
}

async function toggleDrafted(norm) {
  const { drafted: stored = {} } = await chrome.storage.local.get('drafted');
  if (stored[norm]) delete stored[norm];
  else stored[norm] = true;
  drafted = stored;
  await chrome.storage.local.set({ drafted: stored });
  render();
}

// --- Events ---

els.editBtn.addEventListener('click', () => {
  els.input.value = rankings.length
    ? rankings
        .map((p) => {
          const posTeam = [p.pos, p.team].filter(Boolean).join(', ');
          const tail = p.posRank ? ` (${p.posRank})` : '';
          return `${p.rank}. ${p.name}${posTeam ? ', ' + posTeam : ''}${tail}`;
        })
        .join('\n')
    : DEFAULT_RANKINGS_TEXT;
  els.parseStatus.textContent = '';
  els.editor.classList.remove('hidden');
});

els.cancelBtn.addEventListener('click', () => els.editor.classList.add('hidden'));

els.loadBtn.addEventListener('click', async () => {
  const { players, errors } = parseRankings(els.input.value);
  if (players.length === 0) {
    els.parseStatus.textContent = 'No players found — check the format.';
    return;
  }
  await saveRankings(players);
  els.parseStatus.textContent = '';
  els.editor.classList.add('hidden');
  render();
  if (errors.length) {
    els.parseStatus.textContent = `Skipped ${errors.length} unparseable line(s).`;
  }
});

els.loadTiersBtn.addEventListener('click', async () => {
  const tierMap = parseTiers(els.tiersInput.value);
  const tierCount = Object.keys(tierMap).length;
  if (tierCount === 0) {
    els.tierStatus.textContent =
      'No tiers found — expected "Tier N:" headers with "Player Name, TEAM" lines below.';
    return;
  }
  tiers = tierMap;
  await chrome.storage.local.set({
    tiers: tierMap,
    tiersSource: 'user',
    tiersDefaultsVersion: DEFAULT_TIERS_VERSION,
  });
  const matched = rankings.filter((p) => tiers[p.norm]).length;
  els.tierStatus.textContent = `Loaded tiers for ${tierCount} players — ${matched} of your ${rankings.length} ranked players tagged.`;
  render();
});

els.clearTiersBtn.addEventListener('click', async () => {
  tiers = {};
  els.tiersInput.value = '';
  await chrome.storage.local.set({
    tiers: {},
    tiersSource: 'user',
    tiersDefaultsVersion: DEFAULT_TIERS_VERSION,
  });
  els.tierStatus.textContent = 'Tiers cleared.';
  render();
});

els.loadTargetsBtn.addEventListener('click', async () => {
  const targetMap = parseTargets(els.targetsInput.value);
  const count = Object.keys(targetMap).length;
  if (count === 0) {
    els.targetStatus.textContent = 'No player names found — one per line.';
    return;
  }
  targets = targetMap;
  await chrome.storage.local.set({
    targets: targetMap,
    targetsSource: 'user',
    targetsDefaultsVersion: DEFAULT_TARGETS_VERSION,
  });
  const matched = rankings.filter((p) => targets[p.norm]).length;
  els.targetStatus.textContent = `Loaded ${count} targets — ${matched} matched to your board.`;
  render();
});

els.clearTargetsBtn.addEventListener('click', async () => {
  targets = {};
  els.targetsInput.value = '';
  await chrome.storage.local.set({
    targets: {},
    targetsSource: 'user',
    targetsDefaultsVersion: DEFAULT_TARGETS_VERSION,
  });
  els.targetStatus.textContent = 'Targets cleared.';
  render();
});

els.resetBtn.addEventListener('click', async () => {
  if (!confirm('Mark all players as available again?')) return;
  drafted = {};
  await chrome.storage.local.set({ drafted: {} });
  render();
});

els.posFilters.addEventListener('click', (e) => {
  const btn = e.target.closest('.filter');
  if (!btn) return;
  activePos = btn.dataset.pos;
  for (const b of els.posFilters.querySelectorAll('.filter')) {
    b.classList.toggle('active', b === btn);
  }
  render();
});

els.showDrafted.addEventListener('change', () => {
  chrome.storage.local.set({ showDrafted: els.showDrafted.checked });
  render();
});

els.list.addEventListener('click', (e) => {
  const li = e.target.closest('.player');
  if (li) toggleDrafted(li.dataset.norm);
});

// Live updates from the content script (or another panel instance).
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') return;
  if (changes.drafted) drafted = changes.drafted.newValue || {};
  if (changes.rankings) rankings = changes.rankings.newValue || [];
  if (changes.tiers) tiers = changes.tiers.newValue || {};
  if (changes.targets) targets = changes.targets.newValue || {};
  if (changes.avoid) avoid = changes.avoid.newValue || {};
  if (changes.drafted || changes.rankings || changes.tiers || changes.targets || changes.avoid)
    render();
});

// --- Init ---

(async function init() {
  const stored = await chrome.storage.local.get([
    'rankings',
    'drafted',
    'showDrafted',
    'rankingsSource',
    'defaultsVersion',
    'tiers',
    'tiersSource',
    'tiersDefaultsVersion',
    'targets',
    'targetsSource',
    'targetsDefaultsVersion',
    'avoid',
    'avoidDefaultsVersion',
  ]);
  drafted = stored.drafted || {};
  tiers = stored.tiers || {};
  targets = stored.targets || {};
  avoid = stored.avoid || {};

  // The do-not-draft list always tracks the bundled defaults (no import UI).
  if (stored.avoidDefaultsVersion !== DEFAULT_AVOID_VERSION) {
    avoid = {};
    for (const line of DEFAULT_AVOID_TEXT.split('\n')) {
      const norm = normalizeName(line.trim());
      if (norm) avoid[norm] = true;
    }
    await chrome.storage.local.set({ avoid, avoidDefaultsVersion: DEFAULT_AVOID_VERSION });
  }

  const targetsOutdated =
    stored.targetsSource !== 'user' && stored.targetsDefaultsVersion !== DEFAULT_TARGETS_VERSION;
  if (!stored.targets || targetsOutdated) {
    targets = parseTargets(DEFAULT_TARGETS_TEXT);
    await chrome.storage.local.set({
      targets,
      targetsSource: 'default',
      targetsDefaultsVersion: DEFAULT_TARGETS_VERSION,
    });
  }

  // First run, or the bundled default tiers changed and the user never loaded
  // custom tiers — preload the current defaults.
  const tiersOutdated =
    stored.tiersSource !== 'user' && stored.tiersDefaultsVersion !== DEFAULT_TIERS_VERSION;
  if (!stored.tiers || tiersOutdated) {
    tiers = parseTiers(DEFAULT_TIERS_TEXT);
    await chrome.storage.local.set({
      tiers,
      tiersSource: 'default',
      tiersDefaultsVersion: DEFAULT_TIERS_VERSION,
    });
  }
  els.showDrafted.checked = Boolean(stored.showDrafted);

  const hasRankings = stored.rankings && stored.rankings.length;
  const defaultsOutdated =
    stored.rankingsSource !== 'user' && stored.defaultsVersion !== DEFAULT_RANKINGS_VERSION;

  if (hasRankings && !defaultsOutdated) {
    rankings = stored.rankings;
  } else {
    // First run, or the bundled defaults changed and the user never loaded a
    // custom list — preload the current default rankings.
    const { players } = parseRankings(DEFAULT_RANKINGS_TEXT);
    await saveRankings(players, 'default');
  }
  render();
})();
