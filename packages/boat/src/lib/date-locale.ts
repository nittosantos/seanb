import { registerLocale } from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';
import enUS from 'date-fns/locale/en-US';

registerLocale('pt-BR', ptBR);
registerLocale('en-US', enUS);

/**
 * Maps next-intl locale to react-datepicker locale string.
 * Ensures date format (e.g. Thu 05/02/26 → Qui 05/02/26) and
 * calendar UI (month/day names) are localized.
 */
export function getDatePickerLocale(nextIntlLocale: string): string {
  return nextIntlLocale === 'pt' ? 'pt-BR' : 'en-US';
}
