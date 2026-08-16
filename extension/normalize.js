// Shared name-normalization helpers.
// Loaded by both the content script (via manifest) and the side panel (via <script>).

const DraftNames = (() => {
  const SUFFIXES = new Set(['jr', 'sr', 'ii', 'iii', 'iv', 'v']);
  const DIACRITICS_RE = new RegExp('[\\u0300-\\u036f]', 'g');
  const APOSTROPHES_RE = new RegExp('[\\u2018\\u2019\\u02bc]', 'g');

  /**
   * Normalize a player name so that cosmetic differences never break a match:
   * curly vs straight apostrophes, periods, diacritics, "Jr."/"III" suffixes,
   * casing, and extra whitespace.
   *   "De’Von Achane"  -> "devon achane"
   *   "Kenneth Walker III"  -> "kenneth walker"
   *   "Amon-Ra St. Brown"   -> "amon-ra st brown"
   */
  function normalizeName(raw) {
    let s = String(raw || '')
      .normalize('NFD')
      .replace(DIACRITICS_RE, '') // strip diacritics
      .replace(APOSTROPHES_RE, "'") // curly -> straight apostrophe
      .toLowerCase()
      .replace(/['.]/g, '') // drop apostrophes and periods
      .replace(/[^a-z0-9\-\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const parts = s.split(' ');
    while (parts.length > 2 && SUFFIXES.has(parts[parts.length - 1])) {
      parts.pop();
    }
    return parts.join(' ');
  }

  function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /** Whole-word regex for a normalized name inside normalized page text. */
  function nameRegex(normName) {
    return new RegExp(`(?:^|[^a-z0-9])${escapeRegex(normName)}(?:[^a-z0-9]|$)`);
  }

  /**
   * "j gibbs" style key for abbreviated names ("J. Gibbs" on the draft board).
   * Returns null for names without at least first + last.
   */
  function initialLastKey(normName) {
    const parts = normName.split(' ');
    if (parts.length < 2) return null;
    return `${parts[0][0]} ${parts.slice(1).join(' ')}`;
  }

  return { normalizeName, nameRegex, initialLastKey, escapeRegex };
})();

// Make available to the content-script / page scope explicitly.
if (typeof self !== 'undefined') self.DraftNames = DraftNames;
