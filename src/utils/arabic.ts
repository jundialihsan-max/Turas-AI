/**
 * Arabic typography and text utilities
 */

export function removeHarakat(text: string): string {
  if (!text) return '';
  // Unicode range for Arabic tashkeel / harakat: \u064B to \u065F, plus \u0670 (dagger alif)
  return text
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[إأآٱ]/g, 'ا')
    .replace(/[ى]/g, 'ي')
    .replace(/[ؤ]/g, 'و')
    .replace(/[ئ]/g, 'ي')
    .replace(/[ة]/g, 'ه');
}

export function searchArabicMatch(source: string, query: string): boolean {
  if (!source || !query) return false;
  const cleanSource = removeHarakat(source.toLowerCase());
  const cleanQuery = removeHarakat(query.toLowerCase());
  return cleanSource.includes(cleanQuery);
}

export function copyWithAttribution(arabic: string, indonesian: string, sourceName: string): Promise<boolean> {
  const formatted = `« ${arabic} »\n\n"${indonesian}"\n\n[Sumber: ${sourceName} — Dikutip dari Al-Maktabah Al-Islamiyyah]`;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(formatted).then(() => true).catch(() => false);
  }
  return Promise.resolve(false);
}
