/**
 * Supabase row types for this project. Regenerate with the Supabase CLI
 * when the schema changes; keep in sync with your dashboard tables.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type SupportRow = {
  id: string;
  created_at: string;
  title_zh: string;
  title_en: string;
  organizer_zh: string;
  organizer_en: string;
  organizer_url: string[];
  category: string;
  tags: string[];
  pickup_time: string;
  pickup_location: string;
  is_available: boolean;
  image_urls: string[];
  description_zh: string | null;
  description_en: string | null;
  view_count: number;
};

export type SiteMetadataRow = {
  id: number;
  total_views: number;
};

export type Database = {
  public: {
    Tables: {
      supports: {
        Row: SupportRow;
        Insert: Omit<
          SupportRow,
          | "id"
          | "view_count"
          | "created_at"
          | "description_zh"
          | "description_en"
        > & {
          id?: string;
          view_count?: number;
          created_at?: string;
          description_zh?: string | null;
          description_en?: string | null;
        };
        Update: Partial<Omit<SupportRow, "id">>;
        Relationships: [];
      };
      site_metadata: {
        Row: SiteMetadataRow;
        Insert: Partial<SiteMetadataRow> & { id?: number };
        Update: Partial<SiteMetadataRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      /** Align `Args` with your Supabase SQL function parameters. */
      increment_view_count: {
        Args: { support_id: string };
        Returns: unknown;
      };
      increment_total_views: {
        Args: Record<string, never>;
        Returns: unknown;
      };
    };
  };
};
