/**
 * Frontend CMS Client & Reactive State Synchronizer
 * Al-Maktabah Al-Islamiyyah
 */

import { 
  CMSTopic, 
  CMSCategory, 
  SharedDalil, 
  TopicRevision, 
  TrashItem, 
  DuplicateReportItem, 
  CMSOverviewStats 
} from '../types/cms';
import { adminAuth } from './adminAuth';
import { ALL_450_TOPICS } from '../data/curriculum/index';
import { CURRICULUM_BRANCHES } from '../data/curriculum/categories';

type Listener = () => void;

class CMSClient {
  private listeners: Set<Listener> = new Set();
  private cachedTopics: CMSTopic[] = [];
  private cachedCategories: CMSCategory[] = [];
  private isLoaded = false;

  public subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch (e) {
        console.error('Error notifying CMS listener:', e);
      }
    });
  }

  // OVERVIEW
  public async getOverview(): Promise<CMSOverviewStats> {
    try {
      const res = await fetch('/api/cms/overview');
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('Using offline overview calculation:', e);
    }

    const topics = await this.getAllTopics();
    const categories = await this.getCategories();
    return {
      totalCategories: categories.length,
      totalTopics: topics.length,
      totalPublished: topics.filter((t) => t.status === 'published').length,
      totalDrafts: topics.filter((t) => t.status === 'draft').length,
      totalNeedsReview: topics.filter((t) => t.status === 'needs_review').length,
      totalInProgress: topics.filter((t) => t.status === 'in_progress').length,
      totalNoDalil: topics.filter((t) => !t.quranDalil?.arabic && !t.hadithDalil?.arabic).length,
      totalIncompleteRef: topics.filter((t) => !t.ulamaExplanation?.scholar).length,
      totalDuplicateFlagged: 0,
      totalBooks: 12,
      totalSharedDalils: 30,
      totalRevisions: 1,
      totalInTrash: 0,
    };
  }

  // CATEGORIES
  public async getCategories(): Promise<CMSCategory[]> {
    try {
      const res = await fetch('/api/cms/categories');
      if (res.ok) {
        const json = await res.json();
        this.cachedCategories = json.data;
        return json.data;
      }
    } catch (e) {
      console.warn('Fallback to local categories:', e);
    }

    if (this.cachedCategories.length > 0) return this.cachedCategories;

    this.cachedCategories = CURRICULUM_BRANCHES.map((b) => ({
      id: b.id,
      name: b.name,
      nameAr: b.nameAr,
      subtitle: b.subtitle,
      description: b.description,
      topicsCount: b.topicsCount,
      color: b.color,
      isCustom: false,
    }));
    return this.cachedCategories;
  }

  public async saveCategory(category: CMSCategory): Promise<CMSCategory> {
    try {
      const res = await fetch('/api/cms/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
      });
      if (res.ok) {
        const json = await res.json();
        this.notify();
        return json.data;
      }
    } catch (e) {
      console.error('Failed to save category to server:', e);
    }

    const idx = this.cachedCategories.findIndex((c) => c.id === category.id);
    if (idx >= 0) this.cachedCategories[idx] = category;
    else this.cachedCategories.push(category);
    this.notify();
    return category;
  }

  public async deleteCategory(id: string): Promise<{ success: boolean; message: string }> {
    const user = adminAuth.getCurrentUser();
    try {
      const res = await fetch(`/api/cms/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deletedBy: user.name }),
      });
      const json = await res.json();
      if (json.success) {
        this.cachedCategories = this.cachedCategories.filter((c) => c.id !== id);
        this.notify();
      }
      return json;
    } catch (e: any) {
      return { success: false, message: e.message || 'Gagal menghapus kategori' };
    }
  }

  // TOPICS
  public async getTopics(filters?: {
    categoryId?: string;
    status?: string;
    search?: string;
    flag?: string;
  }): Promise<CMSTopic[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.categoryId) params.append('categoryId', filters.categoryId);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.flag) params.append('flag', filters.flag);

      const res = await fetch(`/api/cms/topics?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (filters?.categoryId === 'all' && !filters.search && !filters.flag && filters.status === 'all') {
          this.cachedTopics = json.data;
          this.isLoaded = true;
        }
        return json.data;
      }
    } catch (e) {
      console.warn('Fallback to local cached topics:', e);
    }

    return this.getAllTopicsLocal(filters);
  }

  public async getAllTopics(): Promise<CMSTopic[]> {
    return this.getTopics({ categoryId: 'all', status: 'all' });
  }

  private getAllTopicsLocal(filters?: {
    categoryId?: string;
    status?: string;
    search?: string;
  }): CMSTopic[] {
    if (this.cachedTopics.length === 0) {
      this.cachedTopics = ALL_450_TOPICS.map((t) => ({
        ...t,
        status: (t.categoryId === 'aqidah' && t.number <= 5 ? 'published' : 'in_progress') as any,
        version: 1,
        createdAt: '2026-10-20T00:00:00.000Z',
        updatedAt: '2026-10-22T00:00:00.000Z',
        lastEditor: 'Jundi Abdul Syahid, S.Pd.',
        isTemplateGenerated: !(t.categoryId === 'aqidah' && t.number <= 5),
        isUniqueVerified: t.categoryId === 'aqidah' && t.number <= 5,
      }));
    }

    let res = [...this.cachedTopics];
    if (filters?.categoryId && filters.categoryId !== 'all') {
      res = res.filter((t) => t.categoryId === filters.categoryId);
    }
    if (filters?.status && filters.status !== 'all') {
      res = res.filter((t) => t.status === filters.status);
    }
    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      res = res.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.titleAr.includes(q) ||
          t.objective.toLowerCase().includes(q)
      );
    }
    return res;
  }

  public async getTopicById(id: string): Promise<CMSTopic | undefined> {
    try {
      const res = await fetch(`/api/cms/topics/${id}`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('Fetch topic by ID fallback:', e);
    }
    const all = await this.getAllTopics();
    return all.find((t) => t.id === id);
  }

  public async saveTopic(
    topic: Partial<CMSTopic> & { id: string },
    summary?: string
  ): Promise<CMSTopic> {
    const user = adminAuth.getCurrentUser();
    const payload = {
      ...topic,
      editorName: user.name,
      editorEmail: user.email,
      summary: summary || `Pembaruan materi ${topic.title || topic.id}`,
    };

    try {
      const isUpdate = Boolean(this.cachedTopics.find((t) => t.id === topic.id));
      const url = isUpdate ? `/api/cms/topics/${topic.id}` : '/api/cms/topics';
      const method = isUpdate ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        const saved = json.data;

        // Update local cache
        const idx = this.cachedTopics.findIndex((t) => t.id === saved.id);
        if (idx >= 0) this.cachedTopics[idx] = saved;
        else this.cachedTopics.unshift(saved);

        this.notify();
        return saved;
      }
    } catch (e) {
      console.error('Failed to save topic to server:', e);
    }

    // Offline update
    const idx = this.cachedTopics.findIndex((t) => t.id === topic.id);
    const updated: CMSTopic = {
      ...(this.cachedTopics[idx] || ({} as any)),
      ...topic,
      version: ((this.cachedTopics[idx]?.version || 1) + 1),
      updatedAt: new Date().toISOString(),
      lastEditor: user.name,
    };
    if (idx >= 0) this.cachedTopics[idx] = updated;
    else this.cachedTopics.unshift(updated);

    this.notify();
    return updated;
  }

  public async deleteTopic(id: string): Promise<{ success: boolean; message: string }> {
    const user = adminAuth.getCurrentUser();
    try {
      const res = await fetch(`/api/cms/topics/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deletedBy: user.name }),
      });
      const json = await res.json();
      if (json.success) {
        this.cachedTopics = this.cachedTopics.filter((t) => t.id !== id);
        this.notify();
      }
      return json;
    } catch (e: any) {
      this.cachedTopics = this.cachedTopics.filter((t) => t.id !== id);
      this.notify();
      return { success: true, message: 'Materi dipindahkan ke tempat sampah.' };
    }
  }

  public async batchDeleteTopics(topicIds: string[]): Promise<{ count: number }> {
    const user = adminAuth.getCurrentUser();
    try {
      const res = await fetch('/api/cms/topics/batch-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicIds, deletedBy: user.name }),
      });
      const json = await res.json();
      if (json.success) {
        this.cachedTopics = this.cachedTopics.filter((t) => !topicIds.includes(t.id));
        this.notify();
        return { count: json.count };
      }
    } catch (e) {
      console.error('Batch delete failed:', e);
    }
    this.cachedTopics = this.cachedTopics.filter((t) => !topicIds.includes(t.id));
    this.notify();
    return { count: topicIds.length };
  }

  // TRASH
  public async getTrash(): Promise<TrashItem[]> {
    try {
      const res = await fetch('/api/cms/trash');
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('Trash fetch failed:', e);
    }
    return [];
  }

  public async restoreTrash(trashId: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`/api/cms/trash/restore/${trashId}`, { method: 'POST' });
      const json = await res.json();
      this.notify();
      return json;
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }

  public async permanentDeleteTrash(trashId: string): Promise<{ success: boolean }> {
    try {
      const res = await fetch(`/api/cms/trash/permanent/${trashId}`, { method: 'DELETE' });
      const json = await res.json();
      this.notify();
      return json;
    } catch (e: any) {
      return { success: false };
    }
  }

  // DUPLICATES
  public async getDuplicates(): Promise<DuplicateReportItem[]> {
    try {
      const res = await fetch('/api/cms/duplicates');
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('Failed to scan duplicates from server:', e);
    }
    return [];
  }

  public async resolveDuplicate(
    topicId: string,
    action: 'mark_unique' | 'convert_draft' | 'delete'
  ): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch('/api/cms/duplicates/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId, action }),
      });
      const json = await res.json();
      this.notify();
      return json;
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }

  // REVISIONS
  public async getRevisions(topicId?: string): Promise<TopicRevision[]> {
    try {
      const res = await fetch(`/api/cms/revisions/${topicId || 'all'}`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('Revisions fetch failed:', e);
    }
    return [];
  }

  public async rollbackRevision(revisionId: string): Promise<{ success: boolean; message: string; topic?: CMSTopic }> {
    const user = adminAuth.getCurrentUser();
    try {
      const res = await fetch('/api/cms/revisions/rollback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revisionId, editorName: user.name }),
      });
      const json = await res.json();
      if (json.success && json.topic) {
        const idx = this.cachedTopics.findIndex((t) => t.id === json.topic.id);
        if (idx >= 0) this.cachedTopics[idx] = json.topic;
        this.notify();
      }
      return json;
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }

  // SHARED DALIL REPOSITORY
  public async getSharedDalils(): Promise<SharedDalil[]> {
    try {
      const res = await fetch('/api/cms/dalils');
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('Dalils fetch failed:', e);
    }
    return [];
  }

  public async saveSharedDalil(dalil: Partial<SharedDalil>): Promise<SharedDalil> {
    const res = await fetch('/api/cms/dalils', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dalil),
    });
    const json = await res.json();
    this.notify();
    return json.data;
  }

  public async deleteSharedDalil(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`/api/cms/dalils/${id}`, { method: 'DELETE' });
    const json = await res.json();
    this.notify();
    return json;
  }

  // AI ASSISTANT
  public async requestAIAssist(
    action: 'draft_topic' | 'expand_explanation' | 'simplify_language' | 'check_consistency' | 'generate_quiz',
    title: string,
    categoryName?: string,
    currentContent?: any
  ): Promise<{ success: boolean; data: any }> {
    const res = await fetch('/api/cms/ai-assist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, title, categoryName, currentContent }),
    });
    return res.json();
  }

  // BACKUP EXPORT & IMPORT
  public async exportBackup(): Promise<any> {
    const res = await fetch('/api/cms/backup/export');
    const json = await res.json();
    return json.data;
  }

  public async importBackup(payload: any): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/cms/backup/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (json.success) {
      this.notify();
    }
    return json;
  }
}

export const cmsClient = new CMSClient();
