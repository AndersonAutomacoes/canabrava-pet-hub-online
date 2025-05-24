
/**
 * Utilitários para validação de dados
 * Centraliza todas as regras de validação da aplicação
 */

export const validation = {
  // Validações de email
  email: {
    isValid: (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    message: 'Por favor, insira um email válido'
  },

  // Validações de telefone
  phone: {
    isValid: (phone: string): boolean => {
      const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
      return phoneRegex.test(phone);
    },
    format: (phone: string): string => {
      const numbers = phone.replace(/\D/g, '');
      if (numbers.length === 11) {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
      } else if (numbers.length === 10) {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
      }
      return phone;
    },
    message: 'Formato: (11) 99999-9999'
  },

  // Validações de CEP
  cep: {
    isValid: (cep: string): boolean => {
      const cepRegex = /^\d{5}-\d{3}$/;
      return cepRegex.test(cep);
    },
    format: (cep: string): string => {
      const numbers = cep.replace(/\D/g, '');
      if (numbers.length === 8) {
        return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
      }
      return cep;
    },
    message: 'Formato: 00000-000'
  },

  // Validações de senha
  password: {
    isValid: (password: string): boolean => {
      return password.length >= 6;
    },
    getStrength: (password: string): 'weak' | 'medium' | 'strong' => {
      if (password.length < 6) return 'weak';
      
      let score = 0;
      if (password.length >= 8) score++;
      if (/[A-Z]/.test(password)) score++;
      if (/[a-z]/.test(password)) score++;
      if (/\d/.test(password)) score++;
      if (/[^A-Za-z\d]/.test(password)) score++;
      
      if (score < 3) return 'weak';
      if (score < 5) return 'medium';
      return 'strong';
    },
    message: 'A senha deve ter pelo menos 6 caracteres'
  },

  // Validações de nome
  name: {
    isValid: (name: string): boolean => {
      return name.trim().length >= 2;
    },
    message: 'Nome deve ter pelo menos 2 caracteres'
  },

  // Validações de preço
  price: {
    isValid: (price: number): boolean => {
      return price > 0;
    },
    format: (price: number): string => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(price);
    },
    message: 'Preço deve ser maior que zero'
  }
};

/**
 * Função helper para validar múltiplos campos
 */
export interface ValidationRule {
  field: string;
  value: any;
  rules: Array<{
    validator: (value: any) => boolean;
    message: string;
  }>;
}

export function validateFields(rules: ValidationRule[]): Record<string, string> {
  const errors: Record<string, string> = {};

  rules.forEach(({ field, value, rules: fieldRules }) => {
    for (const rule of fieldRules) {
      if (!rule.validator(value)) {
        errors[field] = rule.message;
        break;
      }
    }
  });

  return errors;
}
