export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      Donor: {
        Row: {
          Blood_group: string | null
          City: string | null
          id: number
          Last_donated: string | null
          Status: boolean | null
        }
        Insert: {
          Blood_group?: string | null
          City?: string | null
          id?: number
          Last_donated?: string | null
          Status?: boolean | null
        }
        Update: {
          Blood_group?: string | null
          City?: string | null
          id?: number
          Last_donated?: string | null
          Status?: boolean | null
        }
        Relationships: []
      }
      donors: {
        Row: {
          blood_group: Database["public"]["Enums"]["blood_group_type"]
          city: string
          created_at: string
          id: string
          last_donated: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          blood_group: Database["public"]["Enums"]["blood_group_type"]
          city: string
          created_at?: string
          id?: string
          last_donated?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          blood_group?: Database["public"]["Enums"]["blood_group_type"]
          city?: string
          created_at?: string
          id?: string
          last_donated?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pledges: {
        Row: {
          created_at: string
          donor_id: string
          donor_name: string
          id: string
          request_id: string
          status: string
          units_pledged: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          donor_id: string
          donor_name: string
          id?: string
          request_id: string
          status?: string
          units_pledged: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          donor_id?: string
          donor_name?: string
          id?: string
          request_id?: string
          status?: string
          units_pledged?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pledges_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "pledges_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors_with_availability"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "pledges_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          phone?: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      requests: {
        Row: {
          blood_group: Database["public"]["Enums"]["blood_group_type"]
          city: string
          created_at: string
          description: string | null
          hospital_id: string
          hospital_name: string
          id: string
          status: Database["public"]["Enums"]["request_status"]
          units_fulfilled: number
          units_required: number
          updated_at: string
          urgency: string
        }
        Insert: {
          blood_group: Database["public"]["Enums"]["blood_group_type"]
          city: string
          created_at?: string
          description?: string | null
          hospital_id: string
          hospital_name: string
          id?: string
          status?: Database["public"]["Enums"]["request_status"]
          units_fulfilled?: number
          units_required: number
          updated_at?: string
          urgency?: string
        }
        Update: {
          blood_group?: Database["public"]["Enums"]["blood_group_type"]
          city?: string
          created_at?: string
          description?: string | null
          hospital_id?: string
          hospital_name?: string
          id?: string
          status?: Database["public"]["Enums"]["request_status"]
          units_fulfilled?: number
          units_required?: number
          updated_at?: string
          urgency?: string
        }
        Relationships: []
      }
    }
    Views: {
      donors_with_availability: {
        Row: {
          blood_group: Database["public"]["Enums"]["blood_group_type"] | null
          city: string | null
          created_at: string | null
          id: string | null
          is_available: boolean | null
          last_donated: string | null
          name: string | null
          phone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      is_donor_available: {
        Args: { last_donation_date: string }
        Returns: boolean
      }
    }
    Enums: {
      blood_group_type: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
      request_status: "open" | "fulfilled" | "cancelled"
      user_role: "donor" | "hospital"
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
    Enums: {
      blood_group_type: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      request_status: ["open", "fulfilled", "cancelled"],
      user_role: ["donor", "hospital"],
    },
  },
} as const
