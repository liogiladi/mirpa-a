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
      patients: {
        Row: {
          address: string | null
          birth_date: string
          cid: string
          created_at: string
          first_name: string
          last_name: string
          profile_img_id: string | null
          receiver_id: string
        }
        Insert: {
          address?: string | null
          birth_date: string
          cid: string
          created_at: string
          first_name: string
          last_name: string
          profile_img_id?: string | null
          receiver_id: string
        }
        Update: {
          address?: string | null
          birth_date?: string
          cid?: string
          created_at?: string
          first_name?: string
          last_name?: string
          profile_img_id?: string | null
          receiver_id?: string
        }
        Relationships: []
      }
      visitors: {
        Row: {
          cid: string
          created_at: string
          email: string | null
          first_name: string
          last_name: string
          phone_number: string | null
          relation: string
        }
        Insert: {
          cid: string
          created_at?: string
          email?: string | null
          first_name: string
          last_name: string
          phone_number?: string | null
          relation: string
        }
        Update: {
          cid?: string
          created_at?: string
          email?: string | null
          first_name?: string
          last_name?: string
          phone_number?: string | null
          relation?: string
        }
        Relationships: []
      }
      visits: {
        Row: {
          approved: boolean | null
          created_at: string
          datetime: string
          extra_visitor_id: string | null
          id: string
          patient_cid: string
          rejection_reason: string | null
          visitor_id: string
        }
        Insert: {
          approved?: boolean | null
          created_at: string
          datetime: string
          extra_visitor_id?: string | null
          id?: string
          patient_cid: string
          rejection_reason?: string | null
          visitor_id: string
        }
        Update: {
          approved?: boolean | null
          created_at?: string
          datetime?: string
          extra_visitor_id?: string | null
          id?: string
          patient_cid?: string
          rejection_reason?: string | null
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "visits_extra_visitor_id_fkey"
            columns: ["extra_visitor_id"]
            isOneToOne: false
            referencedRelation: "visitors"
            referencedColumns: ["cid"]
          },
          {
            foreignKeyName: "visits_patient_cid_fkey"
            columns: ["patient_cid"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["cid"]
          },
          {
            foreignKeyName: "visits_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "visitors"
            referencedColumns: ["cid"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
