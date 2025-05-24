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
      Agendamento: {
        Row: {
          cdAgendamento: number
          cdCliente: number
          cdEmpresa: number
          cdPet: number
          cdServico: number
          dtCreatedAt: string
          dtEnd: string
          dtStart: string
          flComparecimento: boolean
        }
        Insert: {
          cdAgendamento?: number
          cdCliente: number
          cdEmpresa: number
          cdPet: number
          cdServico: number
          dtCreatedAt?: string
          dtEnd: string
          dtStart: string
          flComparecimento?: boolean
        }
        Update: {
          cdAgendamento?: number
          cdCliente?: number
          cdEmpresa?: number
          cdPet?: number
          cdServico?: number
          dtCreatedAt?: string
          dtEnd?: string
          dtStart?: string
          flComparecimento?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "Agendamento_cdCliente_fkey"
            columns: ["cdCliente"]
            isOneToOne: false
            referencedRelation: "Clientes"
            referencedColumns: ["cdCliente"]
          },
          {
            foreignKeyName: "Agendamento_cdEmpresa_fkey"
            columns: ["cdEmpresa"]
            isOneToOne: false
            referencedRelation: "Empresa"
            referencedColumns: ["cdEmpresa"]
          },
          {
            foreignKeyName: "Agendamento_cdPet_fkey"
            columns: ["cdPet"]
            isOneToOne: false
            referencedRelation: "Pet"
            referencedColumns: ["cdPet"]
          },
          {
            foreignKeyName: "Agendamento_cdServico_fkey"
            columns: ["cdServico"]
            isOneToOne: false
            referencedRelation: "Servico"
            referencedColumns: ["cdServico"]
          },
        ]
      }
      Clientes: {
        Row: {
          cdCliente: number
          cdConversationId: string | null
          cdEmpresa: number | null
          dsBotativo: string | null
          dsNome: string | null
          dtCreatedAt: string
          nuTelefoneWhatsapp: string | null
        }
        Insert: {
          cdCliente?: number
          cdConversationId?: string | null
          cdEmpresa?: number | null
          dsBotativo?: string | null
          dsNome?: string | null
          dtCreatedAt?: string
          nuTelefoneWhatsapp?: string | null
        }
        Update: {
          cdCliente?: number
          cdConversationId?: string | null
          cdEmpresa?: number | null
          dsBotativo?: string | null
          dsNome?: string | null
          dtCreatedAt?: string
          nuTelefoneWhatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Clientes_cdEmpresa_fkey"
            columns: ["cdEmpresa"]
            isOneToOne: false
            referencedRelation: "Empresa"
            referencedColumns: ["cdEmpresa"]
          },
        ]
      }
      Empresa: {
        Row: {
          cdEmpresa: number
          dsApiDiFyBot: string | null
          dsNome: string | null
          dsStatus: string | null
          dtCreatedAt: string
          nuTelefoneWhatsapp: string | null
          nuTokenInstance: string | null
        }
        Insert: {
          cdEmpresa?: number
          dsApiDiFyBot?: string | null
          dsNome?: string | null
          dsStatus?: string | null
          dtCreatedAt?: string
          nuTelefoneWhatsapp?: string | null
          nuTokenInstance?: string | null
        }
        Update: {
          cdEmpresa?: number
          dsApiDiFyBot?: string | null
          dsNome?: string | null
          dsStatus?: string | null
          dtCreatedAt?: string
          nuTelefoneWhatsapp?: string | null
          nuTokenInstance?: string | null
        }
        Relationships: []
      }
      Pet: {
        Row: {
          cdCliente: number
          cdPet: number
          dsDocumento: string | null
          dsPorte: string | null
          dtCreatedAt: string
          dtNascimento: string | null
          nmPet: string
          nmRaca: string | null
          nuIdade: number | null
        }
        Insert: {
          cdCliente: number
          cdPet?: number
          dsDocumento?: string | null
          dsPorte?: string | null
          dtCreatedAt?: string
          dtNascimento?: string | null
          nmPet: string
          nmRaca?: string | null
          nuIdade?: number | null
        }
        Update: {
          cdCliente?: number
          cdPet?: number
          dsDocumento?: string | null
          dsPorte?: string | null
          dtCreatedAt?: string
          dtNascimento?: string | null
          nmPet?: string
          nmRaca?: string | null
          nuIdade?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Pet_cdCliente_fkey"
            columns: ["cdCliente"]
            isOneToOne: false
            referencedRelation: "Clientes"
            referencedColumns: ["cdCliente"]
          },
        ]
      }
      Servico: {
        Row: {
          cdEmpresa: number
          cdServico: number
          cdServicoPai: number | null
          dsServico: string
          dtCreatedAt: string
          vrServico: number | null
        }
        Insert: {
          cdEmpresa: number
          cdServico?: number
          cdServicoPai?: number | null
          dsServico?: string
          dtCreatedAt?: string
          vrServico?: number | null
        }
        Update: {
          cdEmpresa?: number
          cdServico?: number
          cdServicoPai?: number | null
          dsServico?: string
          dtCreatedAt?: string
          vrServico?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Servico_cdEmpresa_fkey"
            columns: ["cdEmpresa"]
            isOneToOne: false
            referencedRelation: "Empresa"
            referencedColumns: ["cdEmpresa"]
          },
          {
            foreignKeyName: "Servico_cdServicoPai_fkey"
            columns: ["cdServicoPai"]
            isOneToOne: false
            referencedRelation: "Servico"
            referencedColumns: ["cdServico"]
          },
        ]
      }
    }
    Views: {
      consultaagendamentopet: {
        Row: {
          cdAgendamento: number | null
          cdCliente: number | null
          dsServico: string | null
          dtStart: string | null
          flComparecimento: boolean | null
          nmPet: string | null
          nuTelefoneWhatsapp: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Agendamento_cdCliente_fkey"
            columns: ["cdCliente"]
            isOneToOne: false
            referencedRelation: "Clientes"
            referencedColumns: ["cdCliente"]
          },
        ]
      }
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
    Enums: {},
  },
} as const
