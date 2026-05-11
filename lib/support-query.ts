import type { SupabaseClient } from "@supabase/supabase-js";

import { createServerSupabaseClient } from "@/lib/supabase";
import type { SupportRow } from "@/types/database";

/** Values stored in DB `supports.category` */
export const SUPPORT_CATEGORIES = ["用品", "食品", "妝髮", "其他"] as const;
export type SupportCategory = (typeof SUPPORT_CATEGORIES)[number];

/** 篩選用 hashtag：須與 DB `supports.tags` 字串一致；URL 只接受此白名單 */
export const FILTER_TAG_OPTIONS = [
  "免費",
  "無領取條件",
  "需填表單",
  "需出示門票",
  "需部分粉絲證明",
  "可另外寄送",
  "可代領",
] as const;

const FILTER_TAG_OPTION_SET = new Set<string>(FILTER_TAG_OPTIONS);

export type SortOption = "newest" | "oldest" | "popular" | "hidden";

export type AvailabilityFilter = "all" | "available" | "soldout";

export type SupportsListParams = Readonly<{
  q: string;
  category: SupportCategory | null;
  /** 多選：列出的標籤至少命中其一（`tags` 與陣列有交集） */
  tags: string[];
  availability: AvailabilityFilter;
  sort: SortOption;
}>;

const SORT_OPTIONS: SortOption[] = ["newest", "oldest", "popular", "hidden"];

export const DEFAULT_SUPPORTS_LIST_PARAMS: SupportsListParams = {
  q: "",
  category: null,
  tags: [],
  availability: "all",
  sort: "newest",
};

/** True when URL / form state differs from default-only (for empty-state copy). */
export function hasActiveListFilters(p: SupportsListParams): boolean {
  if (p.q.trim()) return true;
  if (p.category !== null) return true;
  if (p.tags.length > 0) return true;
  if (p.availability !== DEFAULT_SUPPORTS_LIST_PARAMS.availability) return true;
  if (p.sort !== DEFAULT_SUPPORTS_LIST_PARAMS.sort) return true;
  return false;
}

/** Supabase 端篩選（不含關鍵字 `q`）；用於區分「真的沒資料」與「篩太嚴／搜尋無命中」 */
export function hasUrlSqlFilters(p: SupportsListParams): boolean {
  if (p.category !== null) return true;
  if (p.tags.length > 0) return true;
  if (p.availability !== DEFAULT_SUPPORTS_LIST_PARAMS.availability) return true;
  if (p.sort !== DEFAULT_SUPPORTS_LIST_PARAMS.sort) return true;
  return false;
}

export type SupportsListResult = Readonly<{
  items: SupportRow[];
  /** 套用 URL 篩選後、關鍵字 `q` 之前的筆數 */
  matchedBeforeTextSearch: number;
}>;

const EMPTY_LIST_RESULT: SupportsListResult = {
  items: [],
  matchedBeforeTextSearch: 0,
};

const SUPPORT_SELECT_COLUMNS =
  "id, created_at, title_zh, title_en, organizer_zh, organizer_en, organizer_url, category, tags, pickup_time, pickup_location, is_available, image_urls, description_zh, description_en, view_count" as const;

function toStringArray(
  param: string | string[] | undefined,
): string[] {
  if (param === undefined || param === "") return [];
  if (Array.isArray(param)) return param;
  return [param];
}

function parseCategory(raw: string | undefined): SupportCategory | null {
  if (!raw) return null;
  return SUPPORT_CATEGORIES.includes(raw as SupportCategory)
    ? (raw as SupportCategory)
    : null;
}

function parseSort(raw: string | undefined): SortOption {
  if (raw && SORT_OPTIONS.includes(raw as SortOption))
    return raw as SortOption;
  return DEFAULT_SUPPORTS_LIST_PARAMS.sort;
}

function parseAvailability(raw: string | undefined): AvailabilityFilter {
  if (raw === "available" || raw === "soldout") return raw;
  return "all";
}

/** Normalize tag filter values: only allowed hashtags, unique */
function normalizeTags(raw: string[]): string[] {
  const seen = new Set<string>();
  for (const t of raw) {
    const s = t.trim();
    if (s && FILTER_TAG_OPTION_SET.has(s)) seen.add(s);
  }
  return Array.from(seen);
}

/**
 * Build list params from Next.js `searchParams` (GET form / shareable URL).
 */
export function parseSupportsListSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): SupportsListParams {
  const q =
    typeof searchParams.q === "string" ? searchParams.q : "";
  const category = parseCategory(
    typeof searchParams.category === "string"
      ? searchParams.category
      : undefined,
  );
  const tags = normalizeTags(toStringArray(searchParams.tag));
  const availability = parseAvailability(
    typeof searchParams.availability === "string"
      ? searchParams.availability
      : undefined,
  );
  const sort = parseSort(
    typeof searchParams.sort === "string" ? searchParams.sort : undefined,
  );

  return { q, category, tags, availability, sort };
}

/** Case-insensitive match on titles, organizers, or any tag substring */
export function matchesSearchQuery(row: SupportRow, raw: string): boolean {
  const q = raw.trim().toLowerCase();
  if (!q) return true;

  const haystack = [
    row.title_zh,
    row.title_en,
    row.organizer_zh,
    row.organizer_en,
    row.description_zh ?? "",
    row.description_en ?? "",
  ]
    .join("\n")
    .toLowerCase();

  if (haystack.includes(q)) return true;

  return row.tags.some((tag) => tag.toLowerCase().includes(q));
}

export async function getSupportsList(
  params: SupportsListParams,
): Promise<SupportsListResult> {
  const isDev = process.env.NODE_ENV === "development";

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    if (isDev) {
      console.warn(
        "[Supabase] 未連線：缺少 NEXT_PUBLIC_SUPABASE_URL 或 NEXT_PUBLIC_SUPABASE_ANON_KEY → 列表為空。請寫入 .env.local 後重啟 npm run dev。",
      );
    }
    return EMPTY_LIST_RESULT;
  }

  if (isDev) {
    try {
      const host = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname;
      console.info(`[Supabase] 查詢 supports（主機: ${host}）…`);
    } catch {
      console.info("[Supabase] 查詢 supports …");
    }
  }

  const supabase = await createServerSupabaseClient();
  let query = supabase.from("supports").select(SUPPORT_SELECT_COLUMNS);

  if (params.category) {
    query = query.eq("category", params.category);
  }

  if (params.availability === "available") {
    query = query.eq("is_available", true);
  } else if (params.availability === "soldout") {
    query = query.eq("is_available", false);
  }

  if (params.tags.length > 0) {
    query = query.overlaps("tags", params.tags);
  }

  switch (params.sort) {
    case "newest":
      query = query
        .order("created_at", { ascending: false })
        .order("id", { ascending: true });
      break;
    case "oldest":
      query = query
        .order("created_at", { ascending: true })
        .order("id", { ascending: true });
      break;
    case "popular":
      query = query
        .order("view_count", { ascending: false })
        .order("created_at", { ascending: false });
      break;
    case "hidden":
      query = query
        .order("view_count", { ascending: true })
        .order("created_at", { ascending: false });
      break;
    default:
      query = query
        .order("created_at", { ascending: false })
        .order("id", { ascending: true });
  }

  const { data, error } = await query;

  if (error) {
    console.error(
      "[getSupportsList] Supabase error — 若首頁沒資料請看此訊息：",
      error.message,
      error.code ? `(code: ${error.code})` : "",
      error.details ? `details: ${error.details}` : "",
      error.hint ? `hint: ${error.hint}` : "",
    );
    return EMPTY_LIST_RESULT;
  }

  const rows = (data ?? []) as SupportRow[];
  const matchedBeforeTextSearch = rows.length;

  if (isDev && matchedBeforeTextSearch === 0 && !hasUrlSqlFilters(params)) {
    console.warn(
      "[Supabase] 查詢成功但 0 筆（且未套用類別／標籤／狀態／排序篩選）。請檢查：1) 資料是否在 public.supports 2) RLS 是否允許 anon 執行 SELECT 3) 欄位是否與程式 select 清單一致（含 created_at、organizer_url）",
    );
  }

  if (!params.q.trim()) {
    if (isDev) {
      console.info(
        `[Supabase] supports 讀取成功，共 ${rows.length} 筆（未套用關鍵字篩選）`,
      );
    }
    return { items: rows, matchedBeforeTextSearch };
  }

  const filtered = rows.filter((row) => matchesSearchQuery(row, params.q));
  if (isDev) {
    console.info(
      `[Supabase] supports 讀取 ${rows.length} 筆，關鍵字「${params.q.trim()}」篩選後 ${filtered.length} 筆`,
    );
  }
  return { items: filtered, matchedBeforeTextSearch };
}

/**
 * 單筆應援（詳細頁）；無列或無法讀取時回傳 null。
 */
export async function getSupportById(id: string): Promise<SupportRow | null> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("supports")
    .select(SUPPORT_SELECT_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(
      "[getSupportById] Supabase error:",
      error.message,
      error.code ? `(code: ${error.code})` : "",
    );
    return null;
  }

  return data as SupportRow | null;
}

/**
 * 詳細頁載入時增加單筆與全站瀏覽量（RPC）。若未建函式或 RLS 擋下，開發模式會印 warning，不擋頁面。
 */
export async function recordSupportDetailView(supportId: string): Promise<void> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return;
  }

  const supabase = await createServerSupabaseClient();
  /** 泛型 Database 與 PostgREST `rpc` 參數推導在部分版本會誤判為 `never`，執行期仍傳正確 JSON。 */
  const db = supabase as SupabaseClient;
  const isDev = process.env.NODE_ENV === "development";

  const { error: errCount } = await db.rpc("increment_view_count", {
    support_id: supportId,
  });
  if (errCount && isDev) {
    console.warn("[Supabase] increment_view_count:", errCount.message);
  }

  const { error: errTotal } = await db.rpc("increment_total_views", {});
  if (errTotal && isDev) {
    console.warn("[Supabase] increment_total_views:", errTotal.message);
  }
}
