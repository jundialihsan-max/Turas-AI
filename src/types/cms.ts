/**
 * Content Management System (CMS) Types
 * Al-Maktabah Al-Islamiyyah
 */

import { CurriculumTopic, CurriculumBranchId } from '../data/curriculum/types';

export type ContentStatus = 'published' | 'draft' | 'needs_review' | 'in_progress';

export interface CMSTopic extends CurriculumTopic {
  status: ContentStatus;
  version: number;
  createdAt: string;
  updatedAt: string;
  lastEditor: string;
  tags?: string[];
  isTemplateGenerated?: boolean;
  isUniqueVerified?: boolean;
  linkedDalilIds?: string[];
  linkedReferenceIds?: string[];
}

export interface CMSCategory {
  id: string;
  name: string;
  nameAr: string;
  subtitle: string;
  description: string;
  topicsCount: number;
  color: string;
  isCustom?: boolean;
  createdAt?: string;
}

export interface SharedDalil {
  id: string;
  type: 'quran' | 'hadits';
  arabic: string;
  translation: string;
  surahRef?: string; // for Quran
  source?: string; // for Hadith e.g. Shahih Al-Bukhari no. 1
  grade?: 'Shahih' | 'Hasan' | 'Dhaif' | 'Mutawatir';
  scholar?: string;
  rawi?: string;
  takhrijNotes?: string;
  linkedTopicIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SharedReference {
  id: string;
  scholar: string;
  bookRef: string;
  notes: string;
  linkedTopicIds: string[];
  createdAt: string;
}

export interface TopicRevision {
  id: string;
  topicId: string;
  topicTitle: string;
  version: number;
  timestamp: string;
  editorName: string;
  editorEmail: string;
  changeSummary: string;
  snapshot: CMSTopic;
}

export interface TrashItem {
  id: string;
  type: 'topic' | 'category' | 'book' | 'dalil';
  title: string;
  data: any;
  deletedAt: string;
  deletedBy: string;
}

export interface DuplicateReportItem {
  topicId: string;
  title: string;
  categoryId: string;
  categoryName: string;
  comparedToId: string;
  comparedToTitle: string;
  comparedToCategory: string;
  similarityScore: number; // 0 to 100%
  reasons: string[];
  flaggedTextSnippet: string;
  isTemplateCopy: boolean;
  isResolved?: boolean;
  resolution?: 'marked_unique' | 'converted_draft' | 'merged' | 'deleted';
}

export interface CMSOverviewStats {
  totalCategories: number;
  totalTopics: number;
  totalPublished: number;
  totalDrafts: number;
  totalNeedsReview: number;
  totalInProgress: number;
  totalNoDalil: number;
  totalIncompleteRef: number;
  totalDuplicateFlagged: number;
  totalBooks: number;
  totalSharedDalils: number;
  totalRevisions: number;
  totalInTrash: number;
}

export interface AdminUser {
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  authenticated: boolean;
  lastLogin?: string;
}
