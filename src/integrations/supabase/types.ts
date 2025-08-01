export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_alerts: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          metadata: Json | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          metadata?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          title: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          metadata?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_alerts_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_logs: {
        Row: {
          action: string
          admin_user_id: string | null
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_user_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_logs_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          last_login_at: string | null
          name: string
          password_hash: string
          permissions: Json
          role: string
          two_factor_enabled: boolean
          two_factor_secret: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          name: string
          password_hash: string
          permissions?: Json
          role?: string
          two_factor_enabled?: boolean
          two_factor_secret?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          name?: string
          password_hash?: string
          permissions?: Json
          role?: string
          two_factor_enabled?: boolean
          two_factor_secret?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      bio_pages: {
        Row: {
          avatar_url: string | null
          background_url: string | null
          bio: string | null
          created_at: string
          custom_links: Json | null
          id: string
          is_active: boolean | null
          social_links: Json | null
          theme: string | null
          title: string
          updated_at: string
          user_id: string | null
          username: string
          views: number | null
        }
        Insert: {
          avatar_url?: string | null
          background_url?: string | null
          bio?: string | null
          created_at?: string
          custom_links?: Json | null
          id?: string
          is_active?: boolean | null
          social_links?: Json | null
          theme?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
          username: string
          views?: number | null
        }
        Update: {
          avatar_url?: string | null
          background_url?: string | null
          bio?: string | null
          created_at?: string
          custom_links?: Json | null
          id?: string
          is_active?: boolean | null
          social_links?: Json | null
          theme?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
          username?: string
          views?: number | null
        }
        Relationships: []
      }
      clicks: {
        Row: {
          browser: string | null
          city: string | null
          clicked_at: string
          country: string | null
          device: string | null
          id: string
          ip_address: unknown | null
          link_id: string | null
          os: string | null
          referrer: string | null
        }
        Insert: {
          browser?: string | null
          city?: string | null
          clicked_at?: string
          country?: string | null
          device?: string | null
          id?: string
          ip_address?: unknown | null
          link_id?: string | null
          os?: string | null
          referrer?: string | null
        }
        Update: {
          browser?: string | null
          city?: string | null
          clicked_at?: string
          country?: string | null
          device?: string | null
          id?: string
          ip_address?: unknown | null
          link_id?: string | null
          os?: string | null
          referrer?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clicks_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
        ]
      }
      data_backups: {
        Row: {
          backup_type: string
          completed_at: string | null
          created_at: string
          created_by: string | null
          file_path: string | null
          id: string
          size_bytes: number | null
          status: string
        }
        Insert: {
          backup_type: string
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          file_path?: string | null
          id?: string
          size_bytes?: number | null
          status?: string
        }
        Update: {
          backup_type?: string
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          file_path?: string | null
          id?: string
          size_bytes?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "data_backups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      domain_filters: {
        Row: {
          created_at: string
          created_by: string | null
          domain: string
          id: string
          reason: string | null
          type: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          domain: string
          id?: string
          reason?: string | null
          type: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          domain?: string
          id?: string
          reason?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "domain_filters_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_metrics: {
        Row: {
          arr: number
          churn_rate: number
          conversion_rate: number
          created_at: string
          id: string
          metric_date: string
          mrr: number
          paid_users: number
          total_users: number
        }
        Insert: {
          arr?: number
          churn_rate?: number
          conversion_rate?: number
          created_at?: string
          id?: string
          metric_date: string
          mrr?: number
          paid_users?: number
          total_users?: number
        }
        Update: {
          arr?: number
          churn_rate?: number
          conversion_rate?: number
          created_at?: string
          id?: string
          metric_date?: string
          mrr?: number
          paid_users?: number
          total_users?: number
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          created_at: string
          currency: string
          due_date: string
          id: string
          metadata: Json | null
          paid_at: string | null
          payment_method: string | null
          payment_provider: string | null
          payment_provider_id: string | null
          plan_type: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          due_date: string
          id?: string
          metadata?: Json | null
          paid_at?: string | null
          payment_method?: string | null
          payment_provider?: string | null
          payment_provider_id?: string | null
          plan_type: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          due_date?: string
          id?: string
          metadata?: Json | null
          paid_at?: string | null
          payment_method?: string | null
          payment_provider?: string | null
          payment_provider_id?: string | null
          plan_type?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      links: {
        Row: {
          clicks: number | null
          created_at: string
          description: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          original_url: string
          password: string | null
          short_code: string
          title: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          clicks?: number | null
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          original_url: string
          password?: string | null
          short_code: string
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          clicks?: number | null
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          original_url?: string
          password?: string | null
          short_code?: string
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      plan_features: {
        Row: {
          created_at: string
          feature_name: string
          feature_value: string
          id: string
          plan_type: string
        }
        Insert: {
          created_at?: string
          feature_name: string
          feature_value: string
          id?: string
          plan_type: string
        }
        Update: {
          created_at?: string
          feature_name?: string
          feature_value?: string
          id?: string
          plan_type?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string
          id: string
          name: string | null
          plan: string | null
          updated_at: string
          user_id: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email: string
          id?: string
          name?: string | null
          plan?: string | null
          updated_at?: string
          user_id?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          plan?: string | null
          updated_at?: string
          user_id?: string | null
          website?: string | null
        }
        Relationships: []
      }
      qr_codes: {
        Row: {
          created_at: string
          id: string
          link_id: string | null
          logo_url: string | null
          size: number | null
          style: Json | null
        }
        Insert: {
          created_at?: string
          id?: string
          link_id?: string | null
          logo_url?: string | null
          size?: number | null
          style?: Json | null
        }
        Update: {
          created_at?: string
          id?: string
          link_id?: string | null
          logo_url?: string | null
          size?: number | null
          style?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "qr_codes_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
        ]
      }
      security_events: {
        Row: {
          created_at: string
          details: Json | null
          event_type: string
          id: string
          ip_address: unknown
          severity: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          details?: Json | null
          event_type: string
          id?: string
          ip_address: unknown
          severity?: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          details?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown
          severity?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      user_plans: {
        Row: {
          analytics_enabled: boolean
          bio_pages_enabled: boolean
          created_at: string
          id: string
          max_clicks_per_month: number
          max_links: number
          plan_type: string
          qr_codes_enabled: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          analytics_enabled?: boolean
          bio_pages_enabled?: boolean
          created_at?: string
          id?: string
          max_clicks_per_month?: number
          max_links?: number
          plan_type?: string
          qr_codes_enabled?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          analytics_enabled?: boolean
          bio_pages_enabled?: boolean
          created_at?: string
          id?: string
          max_clicks_per_month?: number
          max_links?: number
          plan_type?: string
          qr_codes_enabled?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_reports: {
        Row: {
          created_at: string
          description: string | null
          id: string
          link_id: string | null
          reason: string
          reporter_ip: unknown | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          link_id?: string | null
          reason: string
          reporter_ip?: unknown | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          link_id?: string | null
          reason?: string
          reporter_ip?: unknown | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_reports_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_reports_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_daily_financial_metrics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      check_domain_safety: {
        Args: { url: string }
        Returns: boolean
      }
      create_admin_alert: {
        Args: {
          _type: string
          _severity: string
          _title: string
          _message: string
          _metadata?: Json
        }
        Returns: string
      }
      create_admin_log: {
        Args: {
          _admin_user_id: string
          _action: string
          _resource_type: string
          _resource_id?: string
          _details?: Json
          _ip_address?: unknown
          _user_agent?: string
        }
        Returns: string
      }
      create_data_backup: {
        Args: { _backup_type: string; _admin_user_id: string }
        Returns: string
      }
      generate_short_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      log_security_event: {
        Args: {
          _event_type: string
          _ip_address: unknown
          _user_agent?: string
          _details?: Json
          _severity?: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
