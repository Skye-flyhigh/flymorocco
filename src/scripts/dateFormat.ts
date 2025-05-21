import { format, isSameMonth, isSameYear, isValid, parseISO } from "date-fns";
import { enGB } from "date-fns/locale"; // Or localize based on user

export function formatRange(startISO: string, endISO: string) {
  const start = parseISO(startISO);
  const end = parseISO(endISO);

  if (!isValid(start) || !isValid(end)) {
    console.warn("Invalid date in tour data:", startISO, endISO);
    return "Invalid dates";
  }

  if (isSameMonth(start, end) && isSameYear(start, end)) {
    return `${format(start, "d", { locale: enGB })}–${format(end, "d MMMM yyyy", { locale: enGB })}`;
  }

  if (!isSameYear(start, end)) {
    return `${format(start, "d MMM yyyy", { locale: enGB })} – ${format(end, "d MMM yyyy", { locale: enGB })}`;
  }

  return `${format(start, "d MMM", { locale: enGB })} – ${format(end, "d MMM yyyy", { locale: enGB })}`;
}
