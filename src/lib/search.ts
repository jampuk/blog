type PagefindMeta = Record<string, string | undefined>;

type PagefindResult = {
  data: () => Promise<{
    url: string;
    meta?: PagefindMeta;
    excerpt: string;
  }>;
};

type Pagefind = {
  search: (query: string) => Promise<{ results: PagefindResult[] }>;
};

export type SearchResult = {
  url: string;
  title: string;
  date: string;
  excerpt: string;
};

const PAGEFIND_PATH = "/pagefind/pagefind.js";
const ROW_LIMIT = 12;
const DEBOUNCE_MS = 130;

let loadPromise: Promise<Pagefind | null> | null = null;

export function loadSearch(): Promise<Pagefind | null> {
  loadPromise ??= (async () => {
    try {
      const pfPath = PAGEFIND_PATH;
      const pf = (await import(/* @vite-ignore */ pfPath)) as unknown as Pagefind;
      await pf.search("");
      return pf;
    } catch {
      loadPromise = Promise.resolve(null);
      return null;
    }
  })();
  return loadPromise;
}

export async function searchPosts(
  query: string,
): Promise<{ available: boolean; results: SearchResult[] }> {
  const pf = await loadSearch();
  if (!pf || !query.trim()) return { available: false, results: [] };
  const res = await pf.search(query);
  const results = await Promise.all(
    res.results.slice(0, ROW_LIMIT).map(async (r) => {
      const d = await r.data();
      return {
        url: d.url,
        title: d.meta?.title?.trim() || "Untitled note",
        date: d.meta?.date?.trim() || "",
        excerpt: d.excerpt || "",
      };
    }),
  );
  return { available: true, results };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function resultRow(result: SearchResult): string {
  const head = result.date
    ? `<p class="note-meta">${escapeHtml(result.date)}</p>`
    : "";
  return `<a class="ledger-row block px-4 py-5 group" href="${escapeHtml(result.url)}">
    ${head}
    <h3 class="font-heading font-semibold text-on-surface group-hover:text-tertiary transition-colors">${escapeHtml(result.title)}</h3>
    <p class="text-sm text-on-surface-variant leading-relaxed mt-1 search-excerpt">${result.excerpt}</p>
  </a>`;
}

const PROMPT_HTML =
  '<p class="text-sm text-on-surface-variant leading-relaxed">Type to search every published note. Matches are highlighted.</p>';
const SEARCHING_HTML =
  '<p class="note-meta">// Searching</p><p class="text-sm text-on-surface-variant leading-relaxed mt-2">Looking through the notes index...</p>';

function unavailableHtml(): string {
  return `<p class="note-meta">// Search index not built</p>
    <p class="text-sm text-on-surface-variant leading-relaxed mt-2">
      The search index ships with the static build. Run <code class="font-mono text-tertiary">npm run build</code>
      then <code class="font-mono text-tertiary">npm run preview</code> to see search working.
    </p>`;
}

export interface SearchUiOptions {
  syncUrl?: boolean;
}

export function createSearchUI(
  input: HTMLInputElement,
  output: HTMLElement,
  options: SearchUiOptions = {},
): void {
  let runId = 0;
  let timer = 0;

  const show = (html: string, ledger = false): void => {
    output.classList.toggle("ledger-list", ledger);
    output.innerHTML = html;
  };

  const applyQueryState = (query: string): void => {
    if (options.syncUrl) {
      history.replaceState(
        {},
        "",
        query ? `?q=${encodeURIComponent(query)}` : window.location.pathname,
      );
    }
  };

  const run = async (): Promise<void> => {
    const query = input.value.trim();
    const id = ++runId;
    applyQueryState(query);
    if (!query) {
      show(PROMPT_HTML);
      return;
    }
    show(SEARCHING_HTML);
    const { available, results } = await searchPosts(query);
    if (id !== runId) return;
    if (!available) {
      show(unavailableHtml());
      return;
    }
    if (results.length === 0) {
      show('<p class="text-sm text-on-surface-variant leading-relaxed">No notes matched.</p>');
      return;
    }
    show(
      `<p class="sr-only" aria-live="polite">${results.length} note${results.length === 1 ? "" : "s"} found</p>${results.map(resultRow).join("")}`,
      true,
    );
  };

  input.addEventListener("input", () => {
    clearTimeout(timer);
    timer = window.setTimeout(run, DEBOUNCE_MS);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const first = output.querySelector<HTMLAnchorElement>("a.ledger-row");
    if (first) first.click();
  });

  const loadQuery = options.syncUrl
    ? new URLSearchParams(window.location.search).get("q")?.trim() || ""
    : "";
  if (loadQuery) input.value = loadQuery;
  run();
}
