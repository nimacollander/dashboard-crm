/**
 * The demo's fixed "today". The mock data is written around this date, and a
 * constant (rather than `new Date()`) keeps prerendered pages deterministic.
 */
export const DEMO_TODAY = "2026-10-18";

const DAY_MS = 24 * 60 * 60 * 1000;

export function daysBetween(fromIso: string, toIso: string): number {
  return Math.round((Date.parse(toIso) - Date.parse(fromIso)) / DAY_MS);
}
