// Side panel UI: paste/parse rankings, render the board, live-sync drafted
// state written by the content script, allow manual toggles.

const { normalizeName } = DraftNames;

const els = {
  editor: document.getElementById('editor'),
  input: document.getElementById('rankingsInput'),
  parseStatus: document.getElementById('parseStatus'),
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
let activePos = 'ALL';

// Matches lines like:
//   "1. Jahmyr Gibbs, RB, DET (RB1)"
//   "23) Jeremiyah Love, RB, ARZ"
//   "Brock Bowers, TE, LV (TE1)"
//   "Josh Allen"
const LINE_RE =
  /^\s*(?:(\d+)[.):\-]?\s+)?([^,]+?)(?:\s*,\s*([A-Za-z/]{1,4}))?(?:\s*,\s*([A-Za-z]{2,4}))?\s*(?:\(([^)]+)\))?\s*$/;

function parseRankings(text) {
  const players = [];
  const errors = [];
  const seen = new Set();

  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;
    const m = line.match(LINE_RE);
    if (!m || !m[2]) {
      errors.push(line);
      continue;
    }
    const name = m[2].trim();
    const norm = normalizeName(name);
    if (!norm || seen.has(norm)) continue;
    seen.add(norm);
    players.push({
      rank: m[1] ? Number(m[1]) : players.length + 1,
      name,
      pos: (m[3] || '').toUpperCase(),
      team: (m[4] || '').toUpperCase(),
      posRank: m[5] || '',
      norm,
    });
  }
  return { players, errors };
}

function posClass(pos) {
  return ['QB', 'RB', 'WR', 'TE'].includes(pos) ? `pos-${pos}` : 'pos-other';
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
    if (!isDrafted && !nextUpMarked) {
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

    li.append(rank, pos, name, team);
    frag.appendChild(li);
  }

  els.list.appendChild(frag);
  els.counts.textContent = rankings.length
    ? `${available} available · ${draftedCount} drafted`
    : '';
}

async function saveRankings(players) {
  rankings = players;
  await chrome.storage.local.set({ rankings: players });
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

els.showDrafted.addEventListener('change', render);

els.list.addEventListener('click', (e) => {
  const li = e.target.closest('.player');
  if (li) toggleDrafted(li.dataset.norm);
});

// Live updates from the content script (or another panel instance).
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') return;
  if (changes.drafted) drafted = changes.drafted.newValue || {};
  if (changes.rankings) rankings = changes.rankings.newValue || [];
  if (changes.drafted || changes.rankings) render();
});

// --- Init ---

(async function init() {
  const stored = await chrome.storage.local.get(['rankings', 'drafted']);
  drafted = stored.drafted || {};

  if (stored.rankings && stored.rankings.length) {
    rankings = stored.rankings;
  } else {
    // First run: preload the bundled default rankings.
    const { players } = parseRankings(DEFAULT_RANKINGS_TEXT);
    await saveRankings(players);
  }
  render();
})();
