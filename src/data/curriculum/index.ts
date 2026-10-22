import { CurriculumBranch, CurriculumTopic, CurriculumBranchId } from './types';
import { CURRICULUM_BRANCHES } from './categories';
import { AQIDAH_TOPICS } from './aqidah';
import { HADIS_TOPICS } from './hadis';
import { FIKIH_TOPICS } from './fikih';
import { TAFSIR_TOPICS } from './tafsir';
import { SIRAH_TOPICS } from './sirah';
import { TARIKH_TASYRI_TOPICS } from './tarikh_tasyri';
import { BAHASA_ARAB_TOPICS } from './bahasa_arab';
import { BALAGHAH_TOPICS } from './balaghah';
import { AKHLAK_TOPICS } from './akhlak';

export * from './types';
export * from './categories';

// All 450 topics combined
export const ALL_450_TOPICS: CurriculumTopic[] = [
  ...AQIDAH_TOPICS,
  ...HADIS_TOPICS,
  ...FIKIH_TOPICS,
  ...TAFSIR_TOPICS,
  ...SIRAH_TOPICS,
  ...TARIKH_TASYRI_TOPICS,
  ...BAHASA_ARAB_TOPICS,
  ...BALAGHAH_TOPICS,
  ...AKHLAK_TOPICS,
];

// Quick index maps
export const TOPICS_BY_CATEGORY: Record<CurriculumBranchId, CurriculumTopic[]> = {
  aqidah: AQIDAH_TOPICS,
  hadis: HADIS_TOPICS,
  fikih: FIKIH_TOPICS,
  tafsir: TAFSIR_TOPICS,
  sirah: SIRAH_TOPICS,
  tarikh_tasyri: TARIKH_TASYRI_TOPICS,
  bahasa_arab: BAHASA_ARAB_TOPICS,
  balaghah: BALAGHAH_TOPICS,
  akhlak: AKHLAK_TOPICS,
};

export function getTopicById(id: string): CurriculumTopic | undefined {
  return ALL_450_TOPICS.find((t) => t.id === id);
}

export function searchCurriculum(keyword: string): CurriculumTopic[] {
  if (!keyword || !keyword.trim()) return [];
  const q = keyword.toLowerCase().trim();
  return ALL_450_TOPICS.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.titleAr.includes(q) ||
      t.categoryName.toLowerCase().includes(q) ||
      t.linguisticDef.toLowerCase().includes(q) ||
      t.syariDef.toLowerCase().includes(q) ||
      t.conclusion.toLowerCase().includes(q)
  );
}
