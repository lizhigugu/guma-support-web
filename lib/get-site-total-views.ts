import { createServerSupabaseClient } from "@/lib/supabase";

/** 讀取 site_metadata 單例列（id=1）的全站瀏覽量；失敗或未連線時回傳 null */
export async function getSiteTotalViews(): Promise<number | null> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("site_metadata")
    .select("id, total_views")
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return Number(data.total_views);
}
