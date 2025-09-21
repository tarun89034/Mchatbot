declare module 'date-fns' {
  export function format(date: Date | number, formatStr: string): string;
  export function startOfWeek(date: Date | number, options?: { weekStartsOn?: number }): Date;
  export function addDays(date: Date | number, amount: number): Date;
  export function isSameDay(dateLeft: Date | number, dateRight: Date | number): boolean;
} 