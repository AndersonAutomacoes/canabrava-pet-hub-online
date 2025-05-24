
import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDate = (date: string | Date, formatStr: string = 'dd/MM/yyyy'): string => {
  try {
    let dateObj: Date;
    
    if (typeof date === 'string') {
      dateObj = parseISO(date);
    } else {
      dateObj = date;
    }
    
    if (!isValid(dateObj)) {
      return 'Data inválida';
    }
    
    return format(dateObj, formatStr, { locale: ptBR });
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return 'Data inválida';
  }
};

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
};

export const formatDateForInput = (date: string | Date): string => {
  return formatDate(date, 'yyyy-MM-dd');
};

export const formatTimeForInput = (date: string | Date): string => {
  return formatDate(date, 'HH:mm');
};

export const formatDateRelative = (date: string | Date): string => {
  try {
    let dateObj: Date;
    
    if (typeof date === 'string') {
      dateObj = parseISO(date);
    } else {
      dateObj = date;
    }
    
    if (!isValid(dateObj)) {
      return 'Data inválida';
    }
    
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Hoje';
    } else if (diffInDays === 1) {
      return 'Ontem';
    } else if (diffInDays < 7) {
      return `${diffInDays} dias atrás`;
    } else {
      return formatDate(dateObj, 'dd/MM/yyyy');
    }
  } catch (error) {
    console.error('Erro ao formatar data relativa:', error);
    return 'Data inválida';
  }
};
