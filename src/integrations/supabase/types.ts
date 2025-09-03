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
      blood_requests: {
        Row: {
          blood_group: string
          city: string
          created_at: string
          deadline: string
          hospital_id: string
          id: string
          status: Database["public"]["Enums"]["request_status"]
          units_needed: number
          urgency: Database["public"]["Enums"]["urgency_level"]
        }
        Insert: {
          blood_group: string
          city: string
          created_at?: string
          deadline: string
          hospital_id: string
          id?: string
          status?: Database["public"]["Enums"]["request_status"]
          units_needed: number
          urgency: Database["public"]["Enums"]["urgency_level"]
        }
        Update: {
          blood_group?: string
          city?: string
          created_at?: string
          deadline?: string
          hospital_id?: string
          id?: string
          status?: Database["public"]["Enums"]["request_status"]
          units_needed?: number
          urgency?: Database["public"]["Enums"]["urgency_level"]
        }
        Relationships: [
          {
            foreignKeyName: "blood_requests_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      donors: {
        Row: {
          available: boolean
          blood_group: string
          city: string
          created_at: string
          donation_count: number
          email: string
          id: string
          last_donated: string | null
          name: string
          phone: string
        }
        Insert: {
          available?: boolean
          blood_group: string
          city: string
          created_at?: string
          donation_count?: number
          email: string
          id?: string
          last_donated?: string | null
          name: string
          phone: string
        }
        Update: {
          available?: boolean
          blood_group?: string
          city?: string
          created_at?: string
          donation_count?: number
          email?: string
          id?: string
          last_donated?: string | null
          name?: string
          phone?: string
        }
        Relationships: []
      }
      hospitals: {
        Row: {
          address: string
          city: string
          created_at: string
          id: string
          name: string
          phone: string
          user_id: string
        }
        Insert: {
          address: string
          city: string
          created_at?: string
          id?: string
          name: string
          phone: string
          user_id: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          id?: string
          name?: string
          phone?: string
          user_id?: string
        }
        Relationships: []
      }
      pledges: {
        Row: {
          created_at: string
          donor_id: string
          id: string
          request_id: string
          status: Database["public"]["Enums"]["pledge_status"]
          units_pledged: number
        }
        Insert: {
          created_at?: string
          donor_id: string
          id?: string
          request_id: string
          status?: Database["public"]["Enums"]["pledge_status"]
          units_pledged: number
        }
        Update: {
          created_at?: string
          donor_id?: string
          id?: string
          request_id?: string
          status?: Database["public"]["Enums"]["pledge_status"]
          units_pledged?: number
        }
        Relationships: [
          {
            foreignKeyName: "pledges_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pledges_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "blood_requests"
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
          units_fulfilled?: number
          units_required?: number
          updated_at?: string
          urgency?: string
        }
        Relationships: []
      }
    }
    Views: {
      pledges_with_details: {
        Row: {
          created_at: string | null
          donor_name: string | null
          donor_phone: string | null
          id: string | null
          request_blood_group: string | null
          request_city: string | null
          request_hospital_name: string | null
          status: string | null
          units_pledged: number | null
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
      pledge_status: "pledged" | "completed" | "canceled"
      request_status: "open" | "closed" | "fulfilled"
      urgency_level: "low" | "medium" | "high" | "critical"
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
      pledge_status: ["pledged", "completed", "canceled"],
      request_status: ["open", "closed", "fulfilled"],
      urgency_level: ["low", "medium", "high", "critical"],
      user_role: ["donor", "hospital"],
    },
  },
} as const
