export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      admin_accounts: {
        Row: {
          email: string;
          display_name: string;
          role: "owner" | "operator";
          enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          email: string;
          display_name?: string;
          role?: "owner" | "operator";
          enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string;
          display_name?: string;
          role?: "owner" | "operator";
          enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      route_posts: {
        Row: {
          id: string;
          kind: "regular" | "one_time";
          is_active: boolean;
          notice_date: string | null;
          return_date: string | null;
          from_location: string;
          to_location: string;
          schedule: string;
          return_schedule: string | null;
          available_seats: number;
          operating_days: string[];
          contact_phone: string | null;
          contact_link: string | null;
          note: string;
          vehicle_model: string;
          vehicle_plate: string;
          owner_user_id: string;
          owner_name: string;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          kind: "regular" | "one_time";
          is_active?: boolean;
          notice_date?: string | null;
          return_date?: string | null;
          from_location: string;
          to_location: string;
          schedule: string;
          return_schedule?: string | null;
          available_seats: number;
          operating_days?: string[];
          contact_phone?: string | null;
          contact_link?: string | null;
          note?: string;
          vehicle_model: string;
          vehicle_plate: string;
          owner_user_id: string;
          owner_name?: string;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          kind?: "regular" | "one_time";
          is_active?: boolean;
          notice_date?: string | null;
          return_date?: string | null;
          from_location?: string;
          to_location?: string;
          schedule?: string;
          return_schedule?: string | null;
          available_seats?: number;
          operating_days?: string[];
          contact_phone?: string | null;
          contact_link?: string | null;
          note?: string;
          vehicle_model?: string;
          vehicle_plate?: string;
          owner_user_id?: string;
          owner_name?: string;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "route_posts_owner_user_id_fkey";
            columns: ["owner_user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      driver_profiles: {
        Row: {
          owner_user_id: string;
          vehicle_model: string;
          vehicle_plate: string;
          vehicle_note: string;
          contact_phone: string | null;
          contact_link: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          owner_user_id: string;
          vehicle_model?: string;
          vehicle_plate?: string;
          vehicle_note?: string;
          contact_phone?: string | null;
          contact_link?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          owner_user_id?: string;
          vehicle_model?: string;
          vehicle_plate?: string;
          vehicle_note?: string;
          contact_phone?: string | null;
          contact_link?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "driver_profiles_owner_user_id_fkey";
            columns: ["owner_user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      support_requests: {
        Row: {
          id: string;
          category: "inquiry" | "bug" | "change_request" | "other";
          status: "open" | "in_progress" | "resolved" | "closed";
          user_id: string | null;
          user_email: string;
          title: string;
          message: string;
          admin_note: string;
          created_at: string;
          updated_at: string;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          category: "inquiry" | "bug" | "change_request" | "other";
          status?: "open" | "in_progress" | "resolved" | "closed";
          user_id?: string | null;
          user_email: string;
          title: string;
          message: string;
          admin_note?: string;
          created_at?: string;
          updated_at?: string;
          resolved_at?: string | null;
        };
        Update: {
          id?: string;
          category?: "inquiry" | "bug" | "change_request" | "other";
          status?: "open" | "in_progress" | "resolved" | "closed";
          user_id?: string | null;
          user_email?: string;
          title?: string;
          message?: string;
          admin_note?: string;
          created_at?: string;
          updated_at?: string;
          resolved_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "support_requests_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      claim_initial_admin_account: {
        Args: Record<PropertyKey, never>;
        Returns: Database["public"]["Tables"]["admin_accounts"]["Row"];
      };
      is_email_registered: {
        Args: {
          check_email: string;
        };
        Returns: boolean;
      };
      is_current_user_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
