/**
 * Types for the 9 Islamic Academic Curriculum Branches (450 Pokok Pembahasan)
 */

export type CurriculumBranchId =
  | 'aqidah'
  | 'hadis'
  | 'fikih'
  | 'tafsir'
  | 'sirah'
  | 'tarikh_tasyri'
  | 'bahasa_arab'
  | 'balaghah'
  | 'akhlak';

export interface CurriculumTopic {
  id: string;
  categoryId: CurriculumBranchId;
  categoryName: string;
  categoryNameAr: string;
  number: number; // 1 to 50
  title: string;
  titleAr: string;
  objective: string;
  linguisticDef: string;
  syariDef: string;
  systematicExplanation: string[];
  quranDalil: {
    arabic: string;
    translation: string;
    surahRef: string;
  };
  hadithDalil: {
    arabic: string;
    translation: string;
    source: string;
    grade: 'Shahih' | 'Hasan' | 'Dhaif' | 'Mutawatir';
    scholar: string;
    rawi?: string;
  };
  ulamaExplanation: {
    scholar: string;
    bookRef: string;
    notes: string;
  };
  legalDetailsAndModernApp: string[];
  ikhtilafNotes?: string;
  conclusion: string;
  furtherReading: string[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface CurriculumBranch {
  id: CurriculumBranchId;
  name: string;
  nameAr: string;
  subtitle: string;
  description: string;
  topicsCount: number; // Exactly 50
  color: string;
}
