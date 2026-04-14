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
      route_posts: {
        Row: {
          id: string;
          kind: "regular" | "one_time";
          notice_date: string | null;
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
          notice_date?: string | null;
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
          notice_date?: string | null;
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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
