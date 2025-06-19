export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_otp_tokens: {
        Row: {
          admin_user_id: string
          created_at: string | null
          expires_at: string
          id: string
          token: string
          used: boolean | null
        }
        Insert: {
          admin_user_id: string
          created_at?: string | null
          expires_at: string
          id?: string
          token: string
          used?: boolean | null
        }
        Update: {
          admin_user_id?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          token?: string
          used?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_otp_tokens_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_sessions: {
        Row: {
          admin_user_id: string
          created_at: string | null
          expires_at: string
          id: string
          session_token: string
        }
        Insert: {
          admin_user_id: string
          created_at?: string | null
          expires_at: string
          id?: string
          session_token: string
        }
        Update: {
          admin_user_id?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          session_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_sessions_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          last_login: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
        }
        Relationships: []
      }
      customer_inquiries: {
        Row: {
          country: string | null
          created_at: string | null
          document_name: string | null
          document_url: string | null
          email: string
          has_document: boolean | null
          id: string
          message: string | null
          name: string
          phone: string
          proposal_type: string | null
          status: string | null
          total_amount: number | null
          updated_at: string | null
          urgent: boolean | null
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          document_name?: string | null
          document_url?: string | null
          email: string
          has_document?: boolean | null
          id?: string
          message?: string | null
          name: string
          phone: string
          proposal_type?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
          urgent?: boolean | null
        }
        Update: {
          country?: string | null
          created_at?: string | null
          document_name?: string | null
          document_url?: string | null
          email?: string
          has_document?: boolean | null
          id?: string
          message?: string | null
          name?: string
          phone?: string
          proposal_type?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
          urgent?: boolean | null
        }
        Relationships: []
      }
      customer_inquiry_services: {
        Row: {
          created_at: string | null
          id: string
          inquiry_id: string
          quantity: number | null
          service_id: string
          sub_service_id: string
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          inquiry_id: string
          quantity?: number | null
          service_id: string
          sub_service_id: string
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          id?: string
          inquiry_id?: string
          quantity?: number | null
          service_id?: string
          sub_service_id?: string
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "customer_inquiry_services_inquiry_id_fkey"
            columns: ["inquiry_id"]
            isOneToOne: false
            referencedRelation: "customer_inquiries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_inquiry_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_inquiry_services_sub_service_id_fkey"
            columns: ["sub_service_id"]
            isOneToOne: false
            referencedRelation: "sub_services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          name: string
          status: Database["public"]["Enums"]["service_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          name: string
          status?: Database["public"]["Enums"]["service_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["service_status"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sub_services: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          minimum_units: number | null
          name: string
          price: number
          service_id: string
          show_price: boolean | null
          status: Database["public"]["Enums"]["service_status"] | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          minimum_units?: number | null
          name: string
          price?: number
          service_id: string
          show_price?: boolean | null
          status?: Database["public"]["Enums"]["service_status"] | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          minimum_units?: number | null
          name?: string
          price?: number
          service_id?: string
          show_price?: boolean | null
          status?: Database["public"]["Enums"]["service_status"] | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sub_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_otp_tokens: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_admin_otp: {
        Args: { admin_email: string }
        Returns: string
      }
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      validate_admin_session: {
        Args: { session_token: string }
        Returns: string
      }
      verify_admin_otp: {
        Args: { admin_email: string; otp_token: string }
        Returns: {
          session_token: string
          admin_user_id: string
        }[]
      }
    }
    Enums: {
      service_status: "active" | "inactive"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      service_status: ["active", "inactive"],
    },
  },
} as const
