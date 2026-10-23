import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CURRICULUM_BRANCHES, ALL_450_TOPICS } from '../src/data/curriculum/index.ts';
import { BOOKS_DATABASE } from '../src/data/booksData.ts';
import { THEMATIC_DALIL_DATABASE } from '../src/data/dalilData.ts';
import { 
  CMSTopic, 
  CMSCategory, 
  SharedDalil, 
  TopicRevision, 
  TrashItem, 
  DuplicateReportItem, 
  CMSOverviewStats 
} from '../src/types/cms.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.resolve(__dirname, '..', 'cms-store.json');

export interface CMSDataStructure {
  categories: CMSCategory[];
  topics: CMSTopic[];
  dalils: SharedDalil[];
  books: any[];
  revisions: TopicRevision[];
  trash: TrashItem[];
  resolvedDuplicateIds: string[];
}

// Function to calculate text similarity using Jaccard index on word n-grams
function calculateSimilarity(textA: string, textB: string): number {
  if (!textA || !textB) return 0;
  if (textA === textB) return 100;

  const wordsA = textA.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 2);
  const wordsB = textB.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 2);

  if (wordsA.length === 0 || wordsB.length === 0) return 0;

  const setA = new Set(wordsA);
  const setB = new Set(wordsB);

  let intersection = 0;
  for (const word of setA) {
    if (setB.has(word)) intersection++;
  }

  const union = new Set([...wordsA, ...wordsB]).size;
  return Math.round((intersection / union) * 100);
}

// Known repetitive template phrases that were generated in loop-based curriculum files
const KNOWN_TEMPLATE_PATTERNS = [
  'merupakan panduan praktis ibadah dan muamalah harian',
  'keempat imam mazhab (abu hanifah, malik, asy-syafi\'i, dan ahmad bin hanbal) telah mengkodifikasikan',
  'rincian mengenai',
  'panduan praktis beribadah dan bermuamalah secara adil, jujur, dan beradab',
  'makna dalam etimologi bahasa arab dan peristilahan fuqaha',
  'hukum syar\'i amaliyyah yang digali dari dalil-dalil tafshili',
  'memahami kaidah bab ini melahirkan kekhusyukan dalam beribadah',
  'fikih adalah jalan lapang mengamalkan syariat islam',
  'pokok pembahasan landasan iman & tauhid',
];

export class CMSStoreManager {
  private data: CMSDataStructure;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): CMSDataStructure {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('Error reading cms-store.json, will re-seed:', err);
    }
    return this.initializeAndSeed();
  }

  private save(): void {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save cms-store.json:', err);
    }
  }

  private initializeAndSeed(): CMSDataStructure {
    console.log('Seeding initial CMS Store from default scholarly curriculum...');
    
    // Convert categories
    const categories: CMSCategory[] = CURRICULUM_BRANCHES.map(b => ({
      id: b.id,
      name: b.name,
      nameAr: b.nameAr,
      subtitle: b.subtitle,
      description: b.description,
      topicsCount: b.topicsCount,
      color: b.color,
      isCustom: false,
      createdAt: new Date().toISOString(),
    }));

    // Convert topics with intelligent distinction:
    // Topics 1-5 in Aqidah or topics with unique rich text are marked 'published'.
    // Loop-generated template topics are honestly marked 'in_progress' ("Materi ini sedang disusun. Konten lengkap belum tersedia.")
    const topics: CMSTopic[] = ALL_450_TOPICS.map((t, idx) => {
      const fullText = (t.systematicExplanation || []).join(' ').toLowerCase();
      const isTemplate = KNOWN_TEMPLATE_PATTERNS.some(pat => fullText.includes(pat));

      // Authentic manually written topics
      const isHandCrafted = t.categoryId === 'aqidah' && t.number <= 5;
      const status = isHandCrafted ? 'published' : (isTemplate ? 'in_progress' : 'published');

      return {
        ...t,
        status: status as any,
        version: 1,
        createdAt: '2026-10-20T00:00:00.000Z',
        updatedAt: '2026-10-22T00:00:00.000Z',
        lastEditor: 'Jundi Abdul Syahid, S.Pd.',
        tags: [t.categoryId, `Bab ${t.number}`],
        isTemplateGenerated: isTemplate,
        isUniqueVerified: isHandCrafted,
        linkedDalilIds: [],
        linkedReferenceIds: [],
      };
    });

    // Convert dalils
    const dalils: SharedDalil[] = THEMATIC_DALIL_DATABASE.map(d => ({
      id: d.id,
      type: (d.sourceBook && d.sourceBook.toLowerCase().includes('qur\'an')) ? 'quran' : 'hadits',
      arabic: d.arabic,
      translation: d.indonesian,
      surahRef: d.numberOrRef,
      source: `${d.sourceBook} (${d.numberOrRef})`,
      grade: d.takhrijGrade || 'Shahih',
      scholar: d.takhrijScholar || 'Pentakhrij Muktabar',
      rawi: d.rawi,
      takhrijNotes: d.explanation,
      linkedTopicIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    // Initial books
    const books = [...BOOKS_DATABASE];

    const initialData: CMSDataStructure = {
      categories,
      topics,
      dalils,
      books,
      revisions: [
        {
          id: 'rev_initial',
          topicId: 'all',
          topicTitle: 'Inisialisasi Database Kurikulum 9 Cabang Ilmu',
          version: 1,
          timestamp: new Date().toISOString(),
          editorName: 'Jundi Abdul Syahid, S.Pd.',
          editorEmail: 'jundialihsan@gmail.com',
          changeSummary: 'Penyusunan awal 450 topik kurikulum Ahlusunah wal Jamaah',
          snapshot: topics[0],
        }
      ],
      trash: [],
      resolvedDuplicateIds: [],
    };

    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write initial cms-store.json:', e);
    }

    return initialData;
  }

  // OVERVIEW STATS
  public getOverview(): CMSOverviewStats {
    const topics = this.data.topics;
    
    // Run duplicate check
    const duplicates = this.scanDuplicates();

    let published = 0;
    let drafts = 0;
    let needsReview = 0;
    let inProgress = 0;
    let noDalil = 0;
    let incompleteRef = 0;

    for (const t of topics) {
      if (t.status === 'published') published++;
      else if (t.status === 'draft') drafts++;
      else if (t.status === 'needs_review') needsReview++;
      else if (t.status === 'in_progress') inProgress++;

      if (!t.quranDalil?.arabic && !t.hadithDalil?.arabic) {
        noDalil++;
      }
      if (!t.ulamaExplanation?.scholar || !t.ulamaExplanation?.bookRef) {
        incompleteRef++;
      }
    }

    return {
      totalCategories: this.data.categories.length,
      totalTopics: topics.length,
      totalPublished: published,
      totalDrafts: drafts,
      totalNeedsReview: needsReview,
      totalInProgress: inProgress,
      totalNoDalil: noDalil,
      totalIncompleteRef: incompleteRef,
      totalDuplicateFlagged: duplicates.length,
      totalBooks: this.data.books.length,
      totalSharedDalils: this.data.dalils.length,
      totalRevisions: this.data.revisions.length,
      totalInTrash: this.data.trash.length,
    };
  }

  // CATEGORIES CRUD
  public getCategories(): CMSCategory[] {
    // Recount topics per category
    const countMap: Record<string, number> = {};
    for (const t of this.data.topics) {
      countMap[t.categoryId] = (countMap[t.categoryId] || 0) + 1;
    }

    return this.data.categories.map(c => ({
      ...c,
      topicsCount: countMap[c.id] || 0,
    }));
  }

  public saveCategory(category: CMSCategory): CMSCategory {
    const idx = this.data.categories.findIndex(c => c.id === category.id);
    if (idx >= 0) {
      this.data.categories[idx] = { ...this.data.categories[idx], ...category };
    } else {
      this.data.categories.push({
        ...category,
        isCustom: true,
        createdAt: new Date().toISOString(),
      });
    }
    this.save();
    return category;
  }

  public deleteCategory(categoryId: string, deletedBy: string): { success: boolean; message: string } {
    const hasTopics = this.data.topics.some(t => t.categoryId === categoryId);
    if (hasTopics) {
      return { 
        success: false, 
        message: 'Kategori tidak dapat dihapus karena masih memuat topik aktif. Pindahkan atau hapus materi di dalamnya terlebih dahulu.' 
      };
    }
    const cat = this.data.categories.find(c => c.id === categoryId);
    if (!cat) return { success: false, message: 'Kategori tidak ditemukan' };

    this.data.trash.push({
      id: 'trash_' + Date.now(),
      type: 'category',
      title: cat.name,
      data: cat,
      deletedAt: new Date().toISOString(),
      deletedBy,
    });

    this.data.categories = this.data.categories.filter(c => c.id !== categoryId);
    this.save();
    return { success: true, message: `Kategori "${cat.name}" berhasil dihapus dan dipindahkan ke tempat sampah.` };
  }

  // TOPICS CRUD
  public getTopics(filters?: {
    categoryId?: string;
    status?: string;
    search?: string;
    flag?: string;
    limit?: number;
    offset?: number;
  }): { topics: CMSTopic[]; total: number } {
    let result = [...this.data.topics];

    if (filters?.categoryId && filters.categoryId !== 'all') {
      result = result.filter(t => t.categoryId === filters.categoryId);
    }

    if (filters?.status && filters.status !== 'all') {
      result = result.filter(t => t.status === filters.status);
    }

    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(t => 
        t.title.toLowerCase().includes(q) ||
        t.titleAr.includes(q) ||
        t.objective.toLowerCase().includes(q) ||
        t.categoryName.toLowerCase().includes(q) ||
        (t.systematicExplanation || []).some(p => p.toLowerCase().includes(q))
      );
    }

    if (filters?.flag) {
      if (filters.flag === 'no_dalil') {
        result = result.filter(t => !t.quranDalil?.arabic && !t.hadithDalil?.arabic);
      } else if (filters.flag === 'incomplete_ref') {
        result = result.filter(t => !t.ulamaExplanation?.scholar || !t.ulamaExplanation?.bookRef);
      } else if (filters.flag === 'template_generated') {
        result = result.filter(t => t.isTemplateGenerated);
      }
    }

    const total = result.length;
    if (filters?.limit) {
      const offset = filters.offset || 0;
      result = result.slice(offset, offset + filters.limit);
    }

    return { topics: result, total };
  }

  public getTopicById(id: string): CMSTopic | undefined {
    return this.data.topics.find(t => t.id === id);
  }

  public saveTopic(topicData: Partial<CMSTopic> & { id: string }, editorName: string, editorEmail: string, summary?: string): CMSTopic {
    const existingIndex = this.data.topics.findIndex(t => t.id === topicData.id);
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      // UPDATE TOPIC
      const old = this.data.topics[existingIndex];
      const newVersion = (old.version || 1) + 1;

      // Record revision snapshot
      const revision: TopicRevision = {
        id: 'rev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        topicId: old.id,
        topicTitle: old.title,
        version: old.version || 1,
        timestamp: now,
        editorName: editorName || 'Jundi Abdul Syahid, S.Pd.',
        editorEmail: editorEmail || 'jundialihsan@gmail.com',
        changeSummary: summary || `Pembaruan materi ${old.title} (versi ${newVersion})`,
        snapshot: JSON.parse(JSON.stringify(old)),
      };
      this.data.revisions.unshift(revision);
      // Keep max 500 revisions
      if (this.data.revisions.length > 500) this.data.revisions.pop();

      const updated: CMSTopic = {
        ...old,
        ...topicData,
        version: newVersion,
        updatedAt: now,
        lastEditor: editorName || 'Jundi Abdul Syahid, S.Pd.',
        isTemplateGenerated: false, // Once edited, it's customized!
        isUniqueVerified: true,
      };

      this.data.topics[existingIndex] = updated;
      this.save();
      return updated;
    } else {
      // CREATE NEW TOPIC (supports topic #51, #52, etc.)
      const cat = this.data.categories.find(c => c.id === topicData.categoryId);
      const catTopics = this.data.topics.filter(t => t.categoryId === topicData.categoryId);
      const nextNumber = catTopics.length > 0 ? Math.max(...catTopics.map(t => t.number)) + 1 : 1;

      const newTopic: CMSTopic = {
        id: topicData.id || `topic_${Date.now()}`,
        categoryId: (topicData.categoryId as any) || 'aqidah',
        categoryName: cat?.name || 'Kategori Khusus',
        categoryNameAr: cat?.nameAr || 'قسم مخصص',
        number: topicData.number || nextNumber,
        title: topicData.title || 'Materi Baru',
        titleAr: topicData.titleAr || 'مبحث جديد',
        objective: topicData.objective || 'Tujuan pembelajaran materi.',
        linguisticDef: topicData.linguisticDef || '',
        syariDef: topicData.syariDef || '',
        systematicExplanation: topicData.systematicExplanation || ['Penjelasan materi.'],
        quranDalil: topicData.quranDalil || { arabic: '', translation: '', surahRef: '' },
        hadithDalil: topicData.hadithDalil || { arabic: '', translation: '', source: '', grade: 'Shahih', scholar: '' },
        ulamaExplanation: topicData.ulamaExplanation || { scholar: '', bookRef: '', notes: '' },
        legalDetailsAndModernApp: topicData.legalDetailsAndModernApp || [],
        ikhtilafNotes: topicData.ikhtilafNotes || '',
        conclusion: topicData.conclusion || '',
        furtherReading: topicData.furtherReading || [],
        quiz: topicData.quiz || { question: '', options: [], correctIndex: 0, explanation: '' },
        status: topicData.status || 'draft',
        version: 1,
        createdAt: now,
        updatedAt: now,
        lastEditor: editorName || 'Jundi Abdul Syahid, S.Pd.',
        tags: topicData.tags || [cat?.id || 'umum'],
        isTemplateGenerated: false,
        isUniqueVerified: true,
        linkedDalilIds: topicData.linkedDalilIds || [],
        linkedReferenceIds: topicData.linkedReferenceIds || [],
      };

      this.data.topics.push(newTopic);

      // Record initial revision
      this.data.revisions.unshift({
        id: 'rev_' + Date.now(),
        topicId: newTopic.id,
        topicTitle: newTopic.title,
        version: 1,
        timestamp: now,
        editorName: editorName || 'Jundi Abdul Syahid, S.Pd.',
        editorEmail: editorEmail || 'jundialihsan@gmail.com',
        changeSummary: `Penambahan materi baru #${newTopic.number}: ${newTopic.title}`,
        snapshot: JSON.parse(JSON.stringify(newTopic)),
      });

      this.save();
      return newTopic;
    }
  }

  public deleteTopic(topicId: string, deletedBy: string): { success: boolean; message: string } {
    const topic = this.data.topics.find(t => t.id === topicId);
    if (!topic) return { success: false, message: 'Materi tidak ditemukan' };

    // Move to soft-delete Trash
    this.data.trash.push({
      id: 'trash_' + Date.now(),
      type: 'topic',
      title: topic.title,
      data: topic,
      deletedAt: new Date().toISOString(),
      deletedBy: deletedBy || 'Jundi Abdul Syahid, S.Pd.',
    });

    this.data.topics = this.data.topics.filter(t => t.id !== topicId);
    this.save();
    return { success: true, message: `Materi "${topic.title}" dipindahkan ke tempat sampah (dapat dipulihkan kapan saja).` };
  }

  public batchDeleteTopics(topicIds: string[], deletedBy: string): { count: number } {
    let deletedCount = 0;
    for (const id of topicIds) {
      const topic = this.data.topics.find(t => t.id === id);
      if (topic) {
        this.data.trash.push({
          id: 'trash_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
          type: 'topic',
          title: topic.title,
          data: topic,
          deletedAt: new Date().toISOString(),
          deletedBy: deletedBy || 'Jundi Abdul Syahid, S.Pd.',
        });
        deletedCount++;
      }
    }
    this.data.topics = this.data.topics.filter(t => !topicIds.includes(t.id));
    this.save();
    return { count: deletedCount };
  }

  // TRASH & RESTORE
  public getTrash(): TrashItem[] {
    return this.data.trash;
  }

  public restoreFromTrash(trashId: string): { success: boolean; message: string } {
    const itemIdx = this.data.trash.findIndex(t => t.id === trashId);
    if (itemIdx < 0) return { success: false, message: 'Item di tempat sampah tidak ditemukan' };

    const item = this.data.trash[itemIdx];
    if (item.type === 'topic') {
      const topicData: CMSTopic = item.data;
      // Ensure no collision
      this.data.topics = this.data.topics.filter(t => t.id !== topicData.id);
      this.data.topics.push(topicData);
    } else if (item.type === 'category') {
      const catData: CMSCategory = item.data;
      this.data.categories = this.data.categories.filter(c => c.id !== catData.id);
      this.data.categories.push(catData);
    }

    this.data.trash.splice(itemIdx, 1);
    this.save();
    return { success: true, message: `"${item.title}" berhasil dipulihkan dari tempat sampah.` };
  }

  public permanentDelete(trashId: string): { success: boolean } {
    this.data.trash = this.data.trash.filter(t => t.id !== trashId);
    this.save();
    return { success: true };
  }

  // DUPLICATE AUDIT ENGINE
  public scanDuplicates(): DuplicateReportItem[] {
    const reports: DuplicateReportItem[] = [];
    const resolvedSet = new Set(this.data.resolvedDuplicateIds || []);

    const topics = this.data.topics;
    const len = topics.length;

    // 1. Check template repetition: items that share identical explanation boilerplate
    const templateGroups: Record<string, CMSTopic[]> = {};
    for (const t of topics) {
      if (resolvedSet.has(t.id)) continue;
      const text = (t.systematicExplanation || []).join(' ');
      for (const pat of KNOWN_TEMPLATE_PATTERNS) {
        if (text.toLowerCase().includes(pat)) {
          templateGroups[pat] = templateGroups[pat] || [];
          templateGroups[pat].push(t);
          break;
        }
      }
    }

    for (const [pattern, group] of Object.entries(templateGroups)) {
      if (group.length > 1) {
        // Compare each in group against the first
        const base = group[0];
        for (let i = 1; i < group.length; i++) {
          const current = group[i];
          if (resolvedSet.has(current.id)) continue;
          reports.push({
            topicId: current.id,
            title: current.title,
            categoryId: current.categoryId,
            categoryName: current.categoryName,
            comparedToId: base.id,
            comparedToTitle: base.title,
            comparedToCategory: base.categoryName,
            similarityScore: 92,
            reasons: [
              'Pola templat isi terdeteksi sama (hanya judul yang diganti)',
              'Paragraf penjelasan sistematik identik',
              'Perlu diganti dengan materi autentik mandiri atau ditandai dalam penyusunan',
            ],
            flaggedTextSnippet: current.systematicExplanation?.[0] || pattern,
            isTemplateCopy: true,
          });
        }
      }
    }

    // 2. Check identical Quran or Hadith without custom context
    const dalilMap: Record<string, CMSTopic[]> = {};
    for (const t of topics) {
      if (resolvedSet.has(t.id)) continue;
      const hadithText = t.hadithDalil?.arabic?.trim();
      if (hadithText && hadithText.length > 20) {
        dalilMap[hadithText] = dalilMap[hadithText] || [];
        dalilMap[hadithText].push(t);
      }
    }

    for (const [hadith, group] of Object.entries(dalilMap)) {
      if (group.length > 3) {
        // More than 3 topics with exact same hadith without differentiation
        const base = group[0];
        for (let i = 1; i < group.length; i++) {
          const t = group[i];
          if (resolvedSet.has(t.id)) continue;
          if (!reports.some(r => r.topicId === t.id)) {
            reports.push({
              topicId: t.id,
              title: t.title,
              categoryId: t.categoryId,
              categoryName: t.categoryName,
              comparedToId: base.id,
              comparedToTitle: base.title,
              comparedToCategory: base.categoryName,
              similarityScore: 80,
              reasons: [
                'Hadits dan takhrij sama persis tanpa penyesuaian khusus dengan bab',
                'Uraian penjelasan berulang',
              ],
              flaggedTextSnippet: t.hadithDalil?.translation || hadith,
              isTemplateCopy: false,
            });
          }
        }
      }
    }

    return reports;
  }

  public resolveDuplicate(topicId: string, action: 'mark_unique' | 'convert_draft' | 'delete'): { success: boolean; message: string } {
    if (!this.data.resolvedDuplicateIds) this.data.resolvedDuplicateIds = [];
    
    if (action === 'mark_unique') {
      this.data.resolvedDuplicateIds.push(topicId);
      const t = this.data.topics.find(item => item.id === topicId);
      if (t) {
        t.isUniqueVerified = true;
        t.isTemplateGenerated = false;
      }
      this.save();
      return { success: true, message: 'Materi ditandai unik dan bukan duplikat.' };
    }

    if (action === 'convert_draft') {
      const t = this.data.topics.find(item => item.id === topicId);
      if (t) {
        t.status = 'in_progress';
        t.isTemplateGenerated = true;
      }
      this.save();
      return { success: true, message: 'Status materi diubah menjadi "Dalam Penyusunan" (jujur & transparan).' };
    }

    if (action === 'delete') {
      return this.deleteTopic(topicId, 'Administrator (Resolusi Duplikasi)');
    }

    return { success: false, message: 'Aksi tidak valid' };
  }

  // REVISION & ROLLBACK
  public getRevisions(topicId?: string): TopicRevision[] {
    if (!topicId || topicId === 'all') {
      return this.data.revisions.slice(0, 50);
    }
    return this.data.revisions.filter(r => r.topicId === topicId);
  }

  public rollbackRevision(revisionId: string, editorName: string): { success: boolean; message: string; topic?: CMSTopic } {
    const rev = this.data.revisions.find(r => r.id === revisionId);
    if (!rev) return { success: false, message: 'Riwayat revisi tidak ditemukan' };

    const topicIndex = this.data.topics.findIndex(t => t.id === rev.topicId);
    if (topicIndex < 0) return { success: false, message: 'Materi target tidak ditemukan di database aktif' };

    const restoredSnapshot: CMSTopic = {
      ...rev.snapshot,
      version: (this.data.topics[topicIndex].version || 1) + 1,
      updatedAt: new Date().toISOString(),
      lastEditor: editorName || 'Jundi Abdul Syahid, S.Pd. (Pemulihan Revisi)',
    };

    // Save a new revision of this rollback action
    this.data.revisions.unshift({
      id: 'rev_' + Date.now(),
      topicId: restoredSnapshot.id,
      topicTitle: restoredSnapshot.title,
      version: restoredSnapshot.version,
      timestamp: new Date().toISOString(),
      editorName: editorName || 'Jundi Abdul Syahid, S.Pd.',
      editorEmail: 'jundialihsan@gmail.com',
      changeSummary: `Pemulihan versi ke-${rev.version} yang dicatat pada ${new Date(rev.timestamp).toLocaleDateString('id-ID')}`,
      snapshot: JSON.parse(JSON.stringify(restoredSnapshot)),
    });

    this.data.topics[topicIndex] = restoredSnapshot;
    this.save();
    return { 
      success: true, 
      message: `Materi "${restoredSnapshot.title}" berhasil dipulihkan ke versi ${rev.version}!`,
      topic: restoredSnapshot
    };
  }

  // SHARED DALIL REPOSITORY
  public getSharedDalils(): SharedDalil[] {
    return this.data.dalils;
  }

  public saveSharedDalil(dalil: SharedDalil): SharedDalil {
    const idx = this.data.dalils.findIndex(d => d.id === dalil.id);
    const now = new Date().toISOString();
    if (idx >= 0) {
      this.data.dalils[idx] = { ...this.data.dalils[idx], ...dalil, updatedAt: now };
    } else {
      const newD: SharedDalil = {
        ...dalil,
        id: dalil.id || 'dalil_' + Date.now(),
        createdAt: now,
        updatedAt: now,
        linkedTopicIds: dalil.linkedTopicIds || [],
      };
      this.data.dalils.unshift(newD);
    }
    this.save();
    return dalil;
  }

  public deleteSharedDalil(id: string): { success: boolean; message: string } {
    this.data.dalils = this.data.dalils.filter(d => d.id !== id);
    this.save();
    return { success: true, message: 'Dalil berhasil dihapus dari perpustakaan bersama.' };
  }

  // BOOKS CRUD
  public getBooks(): any[] {
    return this.data.books;
  }

  public saveBook(book: any): any {
    const idx = this.data.books.findIndex(b => b.id === book.id);
    if (idx >= 0) {
      this.data.books[idx] = { ...this.data.books[idx], ...book };
    } else {
      this.data.books.push(book);
    }
    this.save();
    return book;
  }

  public deleteBook(bookId: string): { success: boolean; message: string } {
    this.data.books = this.data.books.filter(b => b.id !== bookId);
    this.save();
    return { success: true, message: 'Kitab berhasil dihapus dari katalog digital.' };
  }

  // BACKUP EXPORT & IMPORT
  public exportAll(): CMSDataStructure {
    return this.data;
  }

  public importAll(payload: CMSDataStructure): boolean {
    if (!payload.topics || !payload.categories) return false;
    this.data = payload;
    this.save();
    return true;
  }
}

export const cmsStore = new CMSStoreManager();
