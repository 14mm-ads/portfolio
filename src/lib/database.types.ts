export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

type Table<Row, Insert, Update> = {
  Row: Row
  Insert: Insert
  Update: Update
  Relationships: []
}

export type Database = {
  public: {
    Tables: {
      admin_users: Table<
        { user_id: string; created_at: string },
        { user_id: string; created_at?: string },
        { user_id?: string; created_at?: string }
      >
      brands: Table<
        {
          name: string
          logo_url: string | null
          tagline: string
          description: string
          sector: string
          website_url: string
          accent_color: string
          updated_at: string
        },
        {
          name: string
          logo_url?: string | null
          tagline?: string
          description?: string
          sector?: string
          website_url?: string
          accent_color?: string
          updated_at?: string
        },
        {
          name?: string
          logo_url?: string | null
          tagline?: string
          description?: string
          sector?: string
          website_url?: string
          accent_color?: string
          updated_at?: string
        }
      >
      projects: Table<
        { id: string; slug: string; data: Json; created_at: string; updated_at: string },
        { id: string; slug: string; data: Json; created_at?: string; updated_at?: string },
        { id?: string; slug?: string; data?: Json; created_at?: string; updated_at?: string }
      >
    }
    Views: Record<string, never>
    Functions: {
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
