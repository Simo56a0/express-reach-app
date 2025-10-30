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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      chat_messages: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          package_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          package_id: string
          sender_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          package_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer: string
          category: string
          created_at: string
          id: string
          question: string
          updated_at: string
          user_type: string
        }
        Insert: {
          answer: string
          category?: string
          created_at?: string
          id?: string
          question: string
          updated_at?: string
          user_type?: string
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string
          id?: string
          question?: string
          updated_at?: string
          user_type?: string
        }
        Relationships: []
      }
      package_events: {
        Row: {
          created_at: string | null
          description: string
          event_type: string
          id: string
          location: string | null
          package_id: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          event_type: string
          id?: string
          location?: string | null
          package_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          event_type?: string
          id?: string
          location?: string | null
          package_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "package_events_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          assigned_at: string | null
          claimed_by: string | null
          created_at: string | null
          delivered_at: string | null
          delivery_address: string
          delivery_city: string
          delivery_date: string | null
          delivery_latitude: number | null
          delivery_longitude: number | null
          delivery_postal_code: string
          dimensions: string | null
          driver_id: string | null
          guest_email: string | null
          id: string
          notes: string | null
          package_type: string
          pickup_address: string
          pickup_city: string
          pickup_date: string | null
          pickup_latitude: number | null
          pickup_longitude: number | null
          pickup_postal_code: string
          price_pounds: number
          recipient_name: string
          recipient_phone: string
          sender_id: string | null
          service_type: string
          status: string
          tracking_number: string
          value_pounds: number | null
          weight_kg: number | null
        }
        Insert: {
          assigned_at?: string | null
          claimed_by?: string | null
          created_at?: string | null
          delivered_at?: string | null
          delivery_address: string
          delivery_city: string
          delivery_date?: string | null
          delivery_latitude?: number | null
          delivery_longitude?: number | null
          delivery_postal_code: string
          dimensions?: string | null
          driver_id?: string | null
          guest_email?: string | null
          id?: string
          notes?: string | null
          package_type: string
          pickup_address: string
          pickup_city: string
          pickup_date?: string | null
          pickup_latitude?: number | null
          pickup_longitude?: number | null
          pickup_postal_code: string
          price_pounds: number
          recipient_name: string
          recipient_phone: string
          sender_id?: string | null
          service_type: string
          status?: string
          tracking_number?: string
          value_pounds?: number | null
          weight_kg?: number | null
        }
        Update: {
          assigned_at?: string | null
          claimed_by?: string | null
          created_at?: string | null
          delivered_at?: string | null
          delivery_address?: string
          delivery_city?: string
          delivery_date?: string | null
          delivery_latitude?: number | null
          delivery_longitude?: number | null
          delivery_postal_code?: string
          dimensions?: string | null
          driver_id?: string | null
          guest_email?: string | null
          id?: string
          notes?: string | null
          package_type?: string
          pickup_address?: string
          pickup_city?: string
          pickup_date?: string | null
          pickup_latitude?: number | null
          pickup_longitude?: number | null
          pickup_postal_code?: string
          price_pounds?: number
          recipient_name?: string
          recipient_phone?: string
          sender_id?: string | null
          service_type?: string
          status?: string
          tracking_number?: string
          value_pounds?: number | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "packages_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          driver_license: string | null
          full_name: string | null
          id: string
          is_available: boolean | null
          phone: string | null
          postal_code: string | null
          updated_at: string | null
          user_type: string | null
          vehicle_type: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          driver_license?: string | null
          full_name?: string | null
          id: string
          is_available?: boolean | null
          phone?: string | null
          postal_code?: string | null
          updated_at?: string | null
          user_type?: string | null
          vehicle_type?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          driver_license?: string | null
          full_name?: string | null
          id?: string
          is_available?: boolean | null
          phone?: string | null
          postal_code?: string | null
          updated_at?: string | null
          user_type?: string | null
          vehicle_type?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_distance: {
        Args: { lat1: number; lat2: number; lon1: number; lon2: number }
        Returns: number
      }
      get_nearby_packages: {
        Args: {
          driver_lat: number
          driver_lon: number
          max_distance_km?: number
        }
        Returns: {
          delivery_address: string
          delivery_city: string
          delivery_date: string
          distance_km: number
          id: string
          package_type: string
          pickup_address: string
          pickup_city: string
          pickup_date: string
          price_pounds: number
          recipient_name: string
          recipient_phone: string
          status: string
          tracking_number: string
          weight_kg: number
        }[]
      }
      get_package_by_tracking: {
        Args: { tracking_num: string }
        Returns: {
          created_at: string
          delivered_at: string
          delivery_city: string
          delivery_date: string
          id: string
          pickup_date: string
          recipient_name: string
          status: string
          tracking_number: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      track_package: {
        Args: { tracking_num: string }
        Returns: {
          created_at: string
          delivered_at: string
          delivery_city: string
          delivery_date: string
          id: string
          pickup_date: string
          recipient_name: string
          status: string
          tracking_number: string
        }[]
      }
    }
    Enums: {
      app_role: "customer" | "driver" | "admin"
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
      app_role: ["customer", "driver", "admin"],
    },
  },
} as const
