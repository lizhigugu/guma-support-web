import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import type { SupportRow } from "@/types/database";

export type AdminSupportItem = Pick<
  SupportRow,
  "id" | "title_zh" | "organizer_zh" | "category" | "is_available"
>;

const ADMIN_SUPPORT_SELECT_COLUMNS =
  "id, title_zh, organizer_zh, category, is_available" as const;

export async function getAdminSupportItems(): Promise<AdminSupportItem[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("supports")
    .select(ADMIN_SUPPORT_SELECT_COLUMNS)
    .order("title_zh", { ascending: true })
    .order("organizer_zh", { ascending: true });

  if (error) {
    throw new Error(`Failed to load supports: ${error.message}`);
  }

  return (data ?? []) as AdminSupportItem[];
}

export async function setSupportAvailability(
  supportId: string,
  isAvailable: boolean,
): Promise<AdminSupportItem> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("supports")
    .update({ is_available: isAvailable })
    .eq("id", supportId)
    .select(ADMIN_SUPPORT_SELECT_COLUMNS)
    .single();

  if (error) {
    throw new Error(`Failed to update support: ${error.message}`);
  }

  return data as AdminSupportItem;
}
