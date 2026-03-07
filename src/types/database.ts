export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      appointments: {
        Row: {
          id: string;
          user_id: string;
          appointment_at: string;
          vehicle_brand: string;
          vehicle_model: string;
          vehicle_plate: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          appointment_at: string;
          vehicle_brand: string;
          vehicle_model: string;
          vehicle_plate: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          appointment_at?: string;
          vehicle_brand?: string;
          vehicle_model?: string;
          vehicle_plate?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type Appointment = Database["public"]["Tables"]["appointments"]["Row"];
export type AppointmentInsert =
  Database["public"]["Tables"]["appointments"]["Insert"];
