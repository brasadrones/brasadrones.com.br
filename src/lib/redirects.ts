const SPREADSHEET_ID = "1Lv_eUhEMGIFopC0FK4wXrl25ETOIMh_F9veHH_5kOco";
const TABS = ["contatos", "livestream"];
const CACHE_TTL_MS = 5 * 60 * 1000;

export interface RedirectEntry {
  id: string;
  target: string;
  source: string;
}

export type RedirectMap = Map<string, RedirectEntry>;

let cache: { map: RedirectMap; fetchedAt: number } | null = null;

function csvUrl(tab: string): string {
  return `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tab)}`;
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      if (row.length > 1 || row[0] !== "") rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

function pathFromOutput(output: string): string {
  let path: string;
  try {
    path = new URL(output).pathname;
  } catch {
    path = output;
  }
  if (!path.startsWith("/")) path = "/" + path;
  path = path.replace(/\/+$/, "");
  return path || "/";
}

async function fetchTab(tab: string): Promise<[string, RedirectEntry][]> {
  const res = await fetch(csvUrl(tab));
  if (!res.ok) {
    throw new Error(`Failed to fetch sheet tab "${tab}": ${res.status}`);
  }
  const text = await res.text();
  const rows = parseCsv(text);

  const entries: [string, RedirectEntry][] = [];
  for (const row of rows.slice(1)) {
    const [id, redirectUrl, output] = row.map((cell) => (cell ?? "").trim());
    if (!id || !redirectUrl || !output) continue;
    entries.push([pathFromOutput(output), { id, target: redirectUrl, source: tab }]);
  }
  return entries;
}

async function buildRedirectMap(): Promise<RedirectMap> {
  const map: RedirectMap = new Map();
  for (const tab of TABS) {
    for (const [path, entry] of await fetchTab(tab)) {
      map.set(path, entry);
    }
  }
  return map;
}

export async function getRedirects(
  { forceRefresh = false }: { forceRefresh?: boolean } = {}
): Promise<RedirectMap> {
  const now = Date.now();
  if (!forceRefresh && cache && now - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.map;
  }

  try {
    const map = await buildRedirectMap();
    cache = { map, fetchedAt: now };
    return map;
  } catch (err) {
    if (cache) return cache.map;
    throw err;
  }
}
