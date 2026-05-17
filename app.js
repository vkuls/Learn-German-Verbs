const STORAGE_KEY = "german-verb-trainer-progress-v1";
const DATA_STORAGE_KEY = "german-verb-trainer-data-v1";

const PRONOUNS = [
  { key: "ich", label: "ich", english: "I" },
  { key: "du", label: "du", english: "you (informal singular)" },
  { key: "er", label: "er / sie / es", english: "he / she / it" },
  { key: "wir", label: "wir", english: "we" },
  { key: "ihr", label: "ihr", english: "you (informal plural)" },
  { key: "sie", label: "sie / Sie", english: "they / you formal" }
];

const SEPARABLE_PREFIXES = [
  "ab", "an", "auf", "aus", "bei", "dar", "ein", "entgegen", "fest", "fort",
  "her", "hin", "los", "mit", "nach", "raus", "rein", "rueck", "zurueck",
  "statt", "teil", "um", "unter", "vor", "weg", "weiter", "wieder", "zu",
  "zurecht", "zusammen"
];

const IRREGULARS = {
  sein: { ich: "bin", du: "bist", er: "ist", wir: "sind", ihr: "seid", sie: "sind" },
  haben: { ich: "habe", du: "hast", er: "hat", wir: "haben", ihr: "habt", sie: "haben" },
  werden: { ich: "werde", du: "wirst", er: "wird", wir: "werden", ihr: "werdet", sie: "werden" },
  können: { ich: "kann", du: "kannst", er: "kann", wir: "können", ihr: "könnt", sie: "können" },
  muessen: { ich: "muss", du: "musst", er: "muss", wir: "müssen", ihr: "müsst", sie: "müssen" },
  duerfen: { ich: "darf", du: "darfst", er: "darf", wir: "dürfen", ihr: "dürft", sie: "dürfen" },
  sollen: { ich: "soll", du: "sollst", er: "soll", wir: "sollen", ihr: "sollt", sie: "sollen" },
  wollen: { ich: "will", du: "willst", er: "will", wir: "wollen", ihr: "wollt", sie: "wollen" },
  moegen: { ich: "mag", du: "magst", er: "mag", wir: "mögen", ihr: "mögt", sie: "mögen" },
  wissen: { ich: "weiß", du: "weißt", er: "weiß", wir: "wissen", ihr: "wisst", sie: "wissen" },
  tun: { ich: "tue", du: "tust", er: "tut", wir: "tun", ihr: "tut", sie: "tun" },
  geben: { ich: "gebe", du: "gibst", er: "gibt", wir: "geben", ihr: "gebt", sie: "geben" },
  nehmen: { ich: "nehme", du: "nimmst", er: "nimmt", wir: "nehmen", ihr: "nehmt", sie: "nehmen" },
  sprechen: { ich: "spreche", du: "sprichst", er: "spricht", wir: "sprechen", ihr: "sprecht", sie: "sprechen" },
  helfen: { ich: "helfe", du: "hilfst", er: "hilft", wir: "helfen", ihr: "helft", sie: "helfen" },
  sehen: { ich: "sehe", du: "siehst", er: "sieht", wir: "sehen", ihr: "seht", sie: "sehen" },
  lesen: { ich: "lese", du: "liest", er: "liest", wir: "lesen", ihr: "lest", sie: "lesen" },
  fahren: { ich: "fahre", du: "fährst", er: "fährt", wir: "fahren", ihr: "fahrt", sie: "fahren" },
  laufen: { ich: "laufe", du: "läufst", er: "läuft", wir: "laufen", ihr: "lauft", sie: "laufen" },
  schlafen: { ich: "schlafe", du: "schläfst", er: "schläft", wir: "schlafen", ihr: "schlaft", sie: "schlafen" },
  tragen: { ich: "trage", du: "trägst", er: "trägt", wir: "tragen", ihr: "tragt", sie: "tragen" },
  essen: { ich: "esse", du: "isst", er: "isst", wir: "essen", ihr: "esst", sie: "essen" },
  treffen: { ich: "treffe", du: "triffst", er: "trifft", wir: "treffen", ihr: "trefft", sie: "treffen" },
  vergessen: { ich: "vergesse", du: "vergisst", er: "vergisst", wir: "vergessen", ihr: "vergesst", sie: "vergessen" },
  geben: { ich: "gebe", du: "gibst", er: "gibt", wir: "geben", ihr: "gebt", sie: "geben" },
  halten: { ich: "halte", du: "hältst", er: "hält", wir: "halten", ihr: "haltet", sie: "halten" },
  stoßen: { ich: "stoße", du: "stößt", er: "stößt", wir: "stoßen", ihr: "stoßt", sie: "stoßen" },
  lassen: { ich: "lasse", du: "lässt", er: "lässt", wir: "lassen", ihr: "lasst", sie: "lassen" },
  heißen: { ich: "heiße", du: "heißt", er: "heißt", wir: "heißen", ihr: "heißt", sie: "heißen" }
};

const SAMPLE_OBJECTS = {
  sein: "heute ruhig",
  haben: "heute viel Zeit",
  werden: "mit jedem Tag besser",
  können: "jeden Tag ein bisschen mehr",
  müssen: "heute pünktlich sein",
  gehen: "jeden Morgen zur Arbeit",
  kommen: "heute etwas später",
  machen: "heute die Hausaufgaben",
  lernen: "jeden Abend Deutsch",
  sprechen: "im Unterricht Deutsch",
  essen: "am Abend zusammen",
  trinken: "am Morgen Kaffee",
  lesen: "jeden Tag einen kurzen Text",
  schreiben: "eine kleine Nachricht",
  wohnen: "in Berlin",
  arbeiten: "im Büro",
  spielen: "heute Fußball",
  fahren: "mit dem Zug nach Hause"
};

const state = {
  verbs: [],
  filtered: [],
  selectedId: null,
  filterText: "",
  status: "all",
  mode: "flashcards",
  progress: loadProgress()
};

const els = {};

document.addEventListener("DOMContentLoaded", () => {
  cacheElements();
  state.verbs = loadVerbData().map(enrichVerb);
  applyFilters();
  bindEvents();
  if (state.filtered.length > 0) {
    state.selectedId = state.filtered[0].id;
    render();
  } else {
    renderEmpty();
  }
});

function cacheElements() {
  els.heroStats = document.getElementById("hero-stats");
  els.search = document.getElementById("search");
  els.statusFilter = document.getElementById("status-filter");
  els.studyMode = document.getElementById("study-mode");
  els.verbList = document.getElementById("verb-list");
  els.emptyState = document.getElementById("empty-state");
  els.cardView = document.getElementById("card-view");
  els.prevVerb = document.getElementById("prev-verb");
  els.nextVerb = document.getElementById("next-verb");
  els.shuffleVerb = document.getElementById("shuffle-verb");
  els.verbWord = document.getElementById("verb-word");
  els.verbRank = document.getElementById("verb-rank");
  els.verbMeaning = document.getElementById("verb-meaning");
  els.verbTags = document.getElementById("verb-tags");
  els.conjugationGrid = document.getElementById("conjugation-grid");
  els.practiceList = document.getElementById("practice-list");
  els.notes = document.getElementById("notes");
  els.importData = document.getElementById("import-data");
  els.importButton = document.getElementById("import-button");
}

function bindEvents() {
  els.search.addEventListener("input", (event) => {
    state.filterText = event.target.value.trim().toLowerCase();
    applyFilters();
    render();
  });

  els.statusFilter.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-status]");
    if (!button) return;
    state.status = button.dataset.status;
    syncActiveButtons(els.statusFilter, "status", state.status);
    applyFilters();
    render();
  });

  els.studyMode.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-mode]");
    if (!button) return;
    state.mode = button.dataset.mode;
    syncActiveButtons(els.studyMode, "mode", state.mode);
    render();
  });

  els.verbList.addEventListener("click", (event) => {
    const item = event.target.closest(".verb-item");
    if (!item) return;
    state.selectedId = item.dataset.id;
    render();
  });

  document.querySelectorAll(".status-button").forEach((button) => {
    button.addEventListener("click", () => {
      const verb = getSelectedVerb();
      if (!verb) return;
      const current = state.progress[verb.id] || {};
      state.progress[verb.id] = { ...current, status: button.dataset.progress };
      saveProgress();
      applyFilters(false);
      render();
    });
  });

  els.notes.addEventListener("input", () => {
    const verb = getSelectedVerb();
    if (!verb) return;
    const current = state.progress[verb.id] || {};
    state.progress[verb.id] = { ...current, status: current.status || "learning", notes: els.notes.value };
    saveProgress();
    renderHeroStats();
  });

  els.prevVerb.addEventListener("click", () => stepVerb(-1));
  els.nextVerb.addEventListener("click", () => stepVerb(1));
  els.shuffleVerb.addEventListener("click", () => {
    if (!state.filtered.length) return;
    const next = state.filtered[Math.floor(Math.random() * state.filtered.length)];
    state.selectedId = next.id;
    render();
  });

  els.importButton.addEventListener("click", () => {
    const imported = parseVerbLines(els.importData.value);
    if (!imported.length) {
      alert("No valid tab-separated rows were found.");
      return;
    }
    localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(imported));
    state.verbs = imported.map(enrichVerb);
    applyFilters(false);
    render();
    els.importData.value = "";
  });
}

function enrichVerb(raw) {
  return {
    ...raw,
    id: String(raw.rank),
    normalizedWord: normalize(raw.word),
    normalizedMeaning: normalize(raw.meaning),
    tokens: raw.meaning.split(",").slice(0, 4).map((item) => item.trim()).filter(Boolean)
  };
}

function applyFilters(keepSelection = true) {
  state.filtered = state.verbs.filter((verb) => {
    const progress = state.progress[verb.id]?.status || "new";
    const textMatch = !state.filterText ||
      verb.normalizedWord.includes(normalize(state.filterText)) ||
      verb.normalizedMeaning.includes(normalize(state.filterText));
    const statusMatch = state.status === "all" || progress === state.status;
    return textMatch && statusMatch;
  });

  if (!keepSelection || !state.filtered.some((verb) => verb.id === state.selectedId)) {
    state.selectedId = state.filtered[0]?.id || null;
  }
}

function render() {
  renderHeroStats();
  renderVerbList();

  if (!state.filtered.length) {
    renderEmpty();
    return;
  }

  els.emptyState.classList.add("hidden");
  els.cardView.classList.remove("hidden");

  const verb = getSelectedVerb();
  if (!verb) return;

  const progress = state.progress[verb.id] || {};
  const conjugations = conjugateVerb(verb.word);
  const noteValue = progress.notes || "";

  els.verbWord.textContent = verb.word;
  els.verbRank.textContent = `Rank ${verb.rank} in your imported list`;
  els.verbMeaning.textContent = verb.meaning;
  els.notes.value = noteValue;

  els.verbTags.innerHTML = [
    `<span class="chip">${(progress.status || "new").toUpperCase()}</span>`,
    `<span class="chip">${conjugations.meta.label}</span>`,
    ...verb.tokens.slice(0, 3).map((token) => `<span class="chip">${escapeHtml(token)}</span>`)
  ].join("");

  els.conjugationGrid.innerHTML = PRONOUNS.map((pronoun) => `
    <div class="conjugation-item">
      <strong>${pronoun.label}</strong>
      <div>${escapeHtml(conjugations.forms[pronoun.key])}</div>
    </div>
  `).join("");

  els.practiceList.innerHTML = PRONOUNS.map((pronoun) => `
    <div class="practice-item">
      <strong>${pronoun.label}</strong>
      <p>${escapeHtml(buildPracticeSentence(verb.word, conjugations.forms[pronoun.key], pronoun).prompt)}</p>
      <p class="muted">${escapeHtml(buildPracticeSentence(verb.word, conjugations.forms[pronoun.key], pronoun).answer)}</p>
    </div>
  `).join("");

  if (state.mode === "practice") {
    els.verbMeaning.textContent = "Try the sentence prompts first, then reveal the meaning by switching back to flashcards.";
  }

  document.querySelectorAll(".status-button").forEach((button) => {
    button.classList.toggle("is-active", (progress.status || "new") === button.dataset.progress);
  });
}

function renderEmpty() {
  renderHeroStats();
  renderVerbList();
  els.emptyState.classList.remove("hidden");
  els.cardView.classList.add("hidden");
}

function renderHeroStats() {
  const totals = {
    all: state.verbs.length,
    new: 0,
    learning: 0,
    mastered: 0
  };

  state.verbs.forEach((verb) => {
    const status = state.progress[verb.id]?.status || "new";
    totals[status] += 1;
  });

  const learned = totals.learning + totals.mastered;
  const percentage = totals.all ? Math.round((totals.mastered / totals.all) * 100) : 0;

  els.heroStats.innerHTML = `
    <div class="stat-card"><strong>${totals.all}</strong><span>Total verbs</span></div>
    <div class="stat-card"><strong>${learned}</strong><span>Started</span></div>
    <div class="stat-card"><strong>${totals.mastered}</strong><span>Mastered</span></div>
    <div class="stat-card"><strong>${percentage}%</strong><span>Mastery</span></div>
  `;
}

function renderVerbList() {
  els.verbList.innerHTML = state.filtered.map((verb) => {
    const status = state.progress[verb.id]?.status || "new";
    return `
      <div class="verb-item ${verb.id === state.selectedId ? "active" : ""}" data-id="${verb.id}">
        <strong>${escapeHtml(verb.word)}</strong>
        <p>${escapeHtml(status)} · ${escapeHtml(shorten(verb.meaning, 80))}</p>
      </div>
    `;
  }).join("");
}

function getSelectedVerb() {
  return state.filtered.find((verb) => verb.id === state.selectedId) || null;
}

function stepVerb(direction) {
  if (!state.filtered.length) return;
  const currentIndex = Math.max(0, state.filtered.findIndex((verb) => verb.id === state.selectedId));
  const nextIndex = (currentIndex + direction + state.filtered.length) % state.filtered.length;
  state.selectedId = state.filtered[nextIndex].id;
  render();
}

function conjugateVerb(verb) {
  const normalized = normalize(verb);
  if (IRREGULARS[normalized]) {
    return { forms: IRREGULARS[normalized], meta: { label: "Irregular present tense" } };
  }

  const separated = splitSeparableVerb(verb);
  if (separated) {
    const base = conjugateVerb(separated.base);
    const forms = {};
    for (const pronoun of PRONOUNS) {
      forms[pronoun.key] = `${base.forms[pronoun.key]} ${separated.prefix}`;
    }
    return { forms, meta: { label: "Present tense with separable prefix" } };
  }

  const stem = getStem(verb);
  const endings = getEndings(stem);
  const forms = {
    ich: `${stem}${endings.ich}`,
    du: `${stem}${endings.du}`,
    er: `${stem}${endings.er}`,
    wir: verb,
    ihr: `${stem}${endings.ihr}`,
    sie: verb
  };

  return { forms, meta: { label: "Generated present tense" } };
}

function splitSeparableVerb(verb) {
  const normalized = normalize(verb);
  for (const prefix of SEPARABLE_PREFIXES) {
    if (normalized.startsWith(prefix) && normalized.length > prefix.length + 2) {
      const originalPrefix = verb.slice(0, prefix.length);
      const base = verb.slice(prefix.length);
      if (/^(be|emp|ent|er|ge|miss|ver|zer)/.test(base)) {
        continue;
      }
      return { prefix: originalPrefix, base };
    }
  }
  return null;
}

function getStem(verb) {
  if (verb.endsWith("ern")) return `${verb.slice(0, -3)}er`;
  if (verb.endsWith("eln")) return `${verb.slice(0, -3)}el`;
  if (verb.endsWith("en")) return verb.slice(0, -2);
  if (verb.endsWith("n")) return verb.slice(0, -1);
  return verb;
}

function getEndings(stem) {
  const endsWithSibilant = /(s|ß|x|z|tz)$/i.test(stem);
  const needsExtraE = /([dt]|[bcdfghjklmnpqrstvwxyz]m|[bcdfghjklmnpqrstvwxyz]n)$/i.test(stem);

  return {
    ich: "e",
    du: endsWithSibilant ? (needsExtraE ? "est" : "t") : (needsExtraE ? "est" : "st"),
    er: needsExtraE ? "et" : "t",
    ihr: needsExtraE ? "et" : "t"
  };
}

function buildPracticeSentence(infinitive, conjugated, pronoun) {
  const object = SAMPLE_OBJECTS[normalize(infinitive)] || "heute bewusst Deutsch";
  const englishHint = inflectEnglishHint(pronoun.english, infinitive, object);
  if (state.mode === "practice") {
    return {
      prompt: `${capitalize(pronoun.label.split(" ")[0])} ______ ${object}.`,
      answer: `${capitalize(pronoun.label.split(" ")[0])} ${conjugated} ${object}. (${englishHint})`
    };
  }
  return {
    prompt: `${capitalize(pronoun.label.split(" ")[0])} ${conjugated} ${object}.`,
    answer: englishHint
  };
}

function inflectEnglishHint(subject, infinitive, object) {
  return `${capitalize(subject)} ${infinitive.replace(/^to /, "")} ${object}.`;
}

function normalize(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u");
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function shorten(value, maxLength) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function syncActiveButtons(container, key, value) {
  container.querySelectorAll(`button[data-${key}]`).forEach((button) => {
    button.classList.toggle("is-active", button.dataset[key] === value);
  });
}

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
}

function loadVerbData() {
  try {
    const imported = JSON.parse(localStorage.getItem(DATA_STORAGE_KEY) || "null");
    if (Array.isArray(imported) && imported.length) {
      return imported;
    }
  } catch {
    // Ignore malformed saved data and fall back to bundled verbs.
  }
  return window.VERB_DATA || [];
}

function parseVerbLines(raw) {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => /\t/.test(line))
    .map((line) => {
      const parts = line.split("\t");
      return {
        rank: Number(parts[0].replace(/[^\d]/g, "")),
        word: (parts[1] || "").trim(),
        meaning: parts.slice(2).join("\t").trim()
      };
    })
    .filter((entry) => entry.rank && entry.word && entry.meaning);
}
