import { ItemCondition } from '../types';

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateIndo(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
}

export function formatMonthYearIndo(monthStr: string): string {
  if (!monthStr || monthStr === 'all') return 'Semua Bulan';
  try {
    const parts = monthStr.split('-');
    if (parts.length < 2) return monthStr;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const date = new Date(year, month - 1, 1);
    return new Intl.DateTimeFormat('id-ID', {
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return monthStr;
  }
}

export function getConditionBadgeClass(condition: ItemCondition): {
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  switch (condition) {
    case 'Sangat Baik':
      return {
        bg: 'bg-emerald-50 text-emerald-700',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
      };
    case 'Baik':
      return {
        bg: 'bg-teal-50 text-teal-700',
        text: 'text-teal-700',
        border: 'border-teal-200',
        dot: 'bg-teal-500',
      };
    case 'Rusak Ringan':
      return {
        bg: 'bg-amber-50 text-amber-700',
        text: 'text-amber-700',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
      };
    case 'Dalam Perbaikan':
      return {
        bg: 'bg-blue-50 text-blue-700',
        text: 'text-blue-700',
        border: 'border-blue-200',
        dot: 'bg-blue-500',
      };
    case 'Rusak Berat':
      return {
        bg: 'bg-rose-50 text-rose-700',
        text: 'text-rose-700',
        border: 'border-rose-200',
        dot: 'bg-rose-500',
      };
    case 'Afkir':
      return {
        bg: 'bg-stone-100 text-stone-600',
        text: 'text-stone-600',
        border: 'border-stone-300',
        dot: 'bg-stone-500',
      };
    default:
      return {
        bg: 'bg-slate-50 text-slate-700',
        text: 'text-slate-700',
        border: 'border-slate-200',
        dot: 'bg-slate-400',
      };
  }
}
