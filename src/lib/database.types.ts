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
      portfolio_options: Table<
        { id: string; field: string; value: string; created_at: string },
        { id?: string; field: string; value: string; created_at?: string },
        { id?: string; field?: string; value?: string; created_at?: string }
      >
      change_log: Table<
        {
          id: number
          created_at: string
          actor_user_id: string | null
          actor_name: string | null
          actor_email: string | null
          entity_type: string
          entity_key: string
          entity_label: string
          action: string
          before_record: Json | null
          after_record: Json | null
        },
        {
          id?: number
          created_at?: string
          actor_user_id?: string | null
          actor_name?: string | null
          actor_email?: string | null
          entity_type: string
          entity_key: string
          entity_label: string
          action: string
          before_record?: Json | null
          after_record?: Json | null
        },
        {
          id?: number
          created_at?: string
          actor_user_id?: string | null
          actor_name?: string | null
          actor_email?: string | null
          entity_type?: string
          entity_key?: string
          entity_label?: string
          action?: string
          before_record?: Json | null
          after_record?: Json | null
        }
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
