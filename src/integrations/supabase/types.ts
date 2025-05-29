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
      admin_users: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
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
        ]
      }
      avaliacoes_produtos: {
        Row: {
          avaliacao: number
          comentario: string | null
          created_at: string
          id: string
          produto_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avaliacao: number
          comentario?: string | null
          created_at?: string
          id?: string
          produto_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avaliacao?: number
          comentario?: string | null
          created_at?: string
          id?: string
          produto_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "avaliacoes_produtos_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          autor: string | null
          categoria: string | null
          conteudo: string
          created_at: string
          id: string
          imagem_url: string | null
          publicado: boolean | null
          resumo: string | null
          slug: string
          tags: string[] | null
          titulo: string
          updated_at: string
        }
        Insert: {
          autor?: string | null
          categoria?: string | null
          conteudo: string
          created_at?: string
          id?: string
          imagem_url?: string | null
          publicado?: boolean | null
          resumo?: string | null
          slug: string
          tags?: string[] | null
          titulo: string
          updated_at?: string
        }
        Update: {
          autor?: string | null
          categoria?: string | null
          conteudo?: string
          created_at?: string
          id?: string
          imagem_url?: string | null
          publicado?: boolean | null
          resumo?: string | null
          slug?: string
          tags?: string[] | null
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      carrinho: {
        Row: {
          created_at: string
          id: string
          produto_id: string | null
          quantidade: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          produto_id?: string | null
          quantidade?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          produto_id?: string | null
          quantidade?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "carrinho_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
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
      favoritos: {
        Row: {
          created_at: string
          id: string
          produto_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          produto_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          produto_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "favoritos_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      frete_configuracoes: {
        Row: {
          ativo: boolean
          cep_destino_fim: string
          cep_destino_inicio: string
          cep_origem: string
          created_at: string
          descricao: string | null
          id: string
          prazo_dias: number
          updated_at: string
          valor_fixo: number
          valor_por_kg: number
        }
        Insert: {
          ativo?: boolean
          cep_destino_fim: string
          cep_destino_inicio: string
          cep_origem: string
          created_at?: string
          descricao?: string | null
          id?: string
          prazo_dias?: number
          updated_at?: string
          valor_fixo?: number
          valor_por_kg?: number
        }
        Update: {
          ativo?: boolean
          cep_destino_fim?: string
          cep_destino_inicio?: string
          cep_origem?: string
          created_at?: string
          descricao?: string | null
          id?: string
          prazo_dias?: number
          updated_at?: string
          valor_fixo?: number
          valor_por_kg?: number
        }
        Relationships: []
      }
      pedido_historico: {
        Row: {
          alterado_por: string | null
          created_at: string
          id: string
          observacoes: string | null
          pedido_id: string
          status_anterior: string | null
          status_novo: string
        }
        Insert: {
          alterado_por?: string | null
          created_at?: string
          id?: string
          observacoes?: string | null
          pedido_id: string
          status_anterior?: string | null
          status_novo: string
        }
        Update: {
          alterado_por?: string | null
          created_at?: string
          id?: string
          observacoes?: string | null
          pedido_id?: string
          status_anterior?: string | null
          status_novo?: string
        }
        Relationships: [
          {
            foreignKeyName: "pedido_historico_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      pedido_itens: {
        Row: {
          id: string
          pedido_id: string | null
          preco_unitario: number
          produto_id: string | null
          quantidade: number
          subtotal: number
        }
        Insert: {
          id?: string
          pedido_id?: string | null
          preco_unitario: number
          produto_id?: string | null
          quantidade: number
          subtotal: number
        }
        Update: {
          id?: string
          pedido_id?: string | null
          preco_unitario?: number
          produto_id?: string | null
          quantidade?: number
          subtotal?: number
        }
        Relationships: [
          {
            foreignKeyName: "pedido_itens_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos: {
        Row: {
          created_at: string
          endereco_entrega: string
          id: string
          metodo_pagamento: string | null
          observacoes: string | null
          status: string
          stripe_payment_intent_id: string | null
          total: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          endereco_entrega: string
          id?: string
          metodo_pagamento?: string | null
          observacoes?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          total: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          endereco_entrega?: string
          id?: string
          metodo_pagamento?: string | null
          observacoes?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          total?: number
          user_id?: string | null
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
      produtos: {
        Row: {
          ativo: boolean | null
          categoria: string
          created_at: string
          descricao: string | null
          dimensoes: string | null
          estoque: number
          id: string
          imagens: string[] | null
          marca: string | null
          nome: string
          peso: number | null
          preco: number
          tipo_pet: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean | null
          categoria: string
          created_at?: string
          descricao?: string | null
          dimensoes?: string | null
          estoque?: number
          id?: string
          imagens?: string[] | null
          marca?: string | null
          nome: string
          peso?: number | null
          preco: number
          tipo_pet?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean | null
          categoria?: string
          created_at?: string
          descricao?: string | null
          dimensoes?: string | null
          estoque?: number
          id?: string
          imagens?: string[] | null
          marca?: string | null
          nome?: string
          peso?: number | null
          preco?: number
          tipo_pet?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          cep: string | null
          cidade: string | null
          created_at: string
          data_nascimento: string | null
          email: string
          endereco: string | null
          estado: string | null
          id: string
          nome: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          cep?: string | null
          cidade?: string | null
          created_at?: string
          data_nascimento?: string | null
          email: string
          endereco?: string | null
          estado?: string | null
          id: string
          nome: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          cep?: string | null
          cidade?: string | null
          created_at?: string
          data_nascimento?: string | null
          email?: string
          endereco?: string | null
          estado?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      servico: {
        Row: {
          cdempresa: number
          cdservico: number
          cdservicopai: number | null
          dsservico: string
          dtcreatedat: string
          vrservico: number | null
        }
        Insert: {
          cdempresa?: number
          cdservico?: number
          cdservicopai?: number | null
          dsservico?: string
          dtcreatedat?: string
          vrservico?: number | null
        }
        Update: {
          cdempresa?: number
          cdservico?: number
          cdservicopai?: number | null
          dsservico?: string
          dtcreatedat?: string
          vrservico?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "servico_cdservicopai_fkey"
            columns: ["cdservicopai"]
            isOneToOne: false
            referencedRelation: "servico"
            referencedColumns: ["cdservico"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_services: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      check_is_admin: {
        Args: { check_user_id?: string }
        Returns: boolean
      }
      get_user_admin_status: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_current_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_user_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_user_admin_simple: {
        Args: { check_user_id: string }
        Returns: boolean
      }
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
