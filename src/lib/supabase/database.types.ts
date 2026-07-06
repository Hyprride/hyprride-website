/**
 * Database schema types.
 *
 * Authored to mirror the output of `supabase gen types typescript`, so it can
 * be regenerated and dropped in once the Supabase CLI is wired up:
 *
 *   supabase gen types typescript --project-id <id> > src/lib/supabase/database.types.ts
 *
 * Kept in sync manually with supabase/migrations/0001_initial_schema.sql.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type BookingStatus =
  | "New"
  | "Pending"
  | "Confirmed"
  | "Completed"
  | "Cancelled";

/** Whether a lead has been pushed to the in-house booking service. */
export type SyncStatus = "not_pushed" | "pushed" | "failed";

/** Where a logged message came in / went out. */
export type MessageChannel = "whatsapp" | "instagram" | "note";
export type MessageDirection = "in" | "out";

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email: string | null;
          address: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          email?: string | null;
          address: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["customers"]["Insert"]>;
        Relationships: [];
      };
      emergency_contacts: {
        Row: {
          id: string;
          customer_id: string;
          contact_name: string;
          contact_phone: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          contact_name: string;
          contact_phone: string;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["emergency_contacts"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "emergency_contacts_customer_id_fkey";
            columns: ["customer_id"];
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
        ];
      };
      bookings: {
        Row: {
          id: string;
          reference: string;
          customer_id: string;
          start_datetime: string;
          end_datetime: string;
          total_hours: number;
          estimated_amount: number | null;
          special_notes: string | null;
          vehicle_interest: string | null;
          preferred_slab_hours: number | null;
          is_unlimited_km: boolean;
          unlimited_km_charge: number | null;
          external_booking_id: string | null;
          external_reference: string | null;
          sync_status: SyncStatus;
          status: BookingStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          reference?: string;
          customer_id: string;
          start_datetime: string;
          end_datetime: string;
          total_hours: number;
          estimated_amount?: number | null;
          special_notes?: string | null;
          vehicle_interest?: string | null;
          preferred_slab_hours?: number | null;
          is_unlimited_km?: boolean;
          unlimited_km_charge?: number | null;
          external_booking_id?: string | null;
          external_reference?: string | null;
          sync_status?: SyncStatus;
          status?: BookingStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["bookings"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "bookings_customer_id_fkey";
            columns: ["customer_id"];
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
        ];
      };
      activity_logs: {
        Row: {
          id: string;
          booking_id: string;
          action: string;
          actor: string;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          action: string;
          actor?: string;
          metadata?: Json;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["activity_logs"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "activity_logs_booking_id_fkey";
            columns: ["booking_id"];
            referencedRelation: "bookings";
            referencedColumns: ["id"];
          },
        ];
      };
      messages: {
        Row: {
          id: string;
          customer_id: string;
          channel: MessageChannel;
          direction: MessageDirection;
          body: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          channel: MessageChannel;
          direction?: MessageDirection;
          body: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "messages_customer_id_fkey";
            columns: ["customer_id"];
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
        ];
      };
      app_settings: {
        Row: {
          id: boolean;
          business_name: string;
          legal_name: string;
          business_phone: string;
          business_email: string;
          business_address: string;
          operating_hours: string;
          gst_rate: number;
          security_deposit: number;
          dynamic_pricing: boolean;
          notify_whatsapp: boolean;
          notify_email: boolean;
          notify_instagram: boolean;
          updated_at: string;
        };
        Insert: {
          id?: boolean;
          business_name?: string;
          legal_name?: string;
          business_phone?: string;
          business_email?: string;
          business_address?: string;
          operating_hours?: string;
          gst_rate?: number;
          security_deposit?: number;
          dynamic_pricing?: boolean;
          notify_whatsapp?: boolean;
          notify_email?: boolean;
          notify_instagram?: boolean;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["app_settings"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      booking_status: BookingStatus;
    };
    // Note: sync_status is a TEXT column with a CHECK constraint (not a pg enum).
    CompositeTypes: Record<string, never>;
  };
}

/* Convenience row aliases used across the app. */
export type CustomerRow = Database["public"]["Tables"]["customers"]["Row"];
export type EmergencyContactRow =
  Database["public"]["Tables"]["emergency_contacts"]["Row"];
export type BookingRow = Database["public"]["Tables"]["bookings"]["Row"];
export type ActivityLogRow =
  Database["public"]["Tables"]["activity_logs"]["Row"];
export type MessageRow = Database["public"]["Tables"]["messages"]["Row"];
export type AppSettingsRow = Database["public"]["Tables"]["app_settings"]["Row"];
