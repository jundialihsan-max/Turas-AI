import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  BookOpen, 
  Library, 
  Quote, 
  FileCheck, 
  CopyCheck, 
  FileText, 
  History, 
  Settings, 
  PlusCircle, 
  ShieldCheck, 
  ArrowLeft, 
  Sparkles,
  ExternalLink,
  User,
  AlertTriangle
} from 'lucide-react';
import { 
  CMSTopic, 
  CMSCategory, 
  SharedDalil, 
  TopicRevision, 
  DuplicateReportItem, 
  CMSOverviewStats 
} from '../../types/cms';
import { Book } from '../../types';
import { cmsClient } from '../../utils/cmsClient';
import { adminAuth } from '../../utils/adminAuth';

// Sub Tabs
import { AdminOverviewTab } from './AdminOverviewTab';
import { AdminTopicsTab } from './AdminTopicsTab';
import { AdminCategoriesTab } from './AdminCategoriesTab';
import { AdminDuplicatesTab } from './AdminDuplicatesTab';
import { AdminDalilsTab } from './AdminDalilsTab';
import { AdminBooksTab } from './AdminBooksTab';
import { AdminRevisionsTab } from './AdminRevisionsTab';
import { AdminDraftsTab } from './AdminDraftsTab';
import { AdminSettingsTab } from './AdminSettingsTab';
import { AdminTopicEditorModal } from './AdminTopicEditorModal';
import { AdminAIAssistModal } from './AdminAIAssistModal';

interface AdminDashboardViewProps {
  onBackToApp: () => void;
  onOpenBook: (bookId: string) => void;
  onNavigateTab: (tab: string) => void;
  initialSubTab?: string;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  onBackToApp,
  onOpenBook,
  onNavigateTab,
  initialSubTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<string>(initialSubTab || 'dashboard');
  const [stats, setStats] = useState<CMSOverviewStats | null>(null);
  const [topics, setTopics] = useState<CMSTopic[]>([]);
  const [categories, setCategories] = useState<CMSCategory[]>([]);
  const [dalils, setDalils] = useState<SharedDalil[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [revisions, setRevisions] = useState<TopicRevision[]>([]);
  const [duplicates, setDuplicates] = useState<DuplicateReportItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Editor Modal State
  const [editorTopic, setEditorTopic] = useState<CMSTopic | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // AI Modal State
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiTarget, setAiTarget] = useState<{ title: string; category: string; content: any }>({
    title: '',
    category: '',
    content: null,
  });

  const currentUser = adminAuth.getCurrentUser();

  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [statsData, topicsData, catsData, dalilsData, booksData, revsData, dupData] =
        await Promise.all([
          cmsClient.getOverview(),
          cmsClient.getAllTopics(),
          cmsClient.getCategories(),
          cmsClient.getSharedDalils(),
          fetch('/api/cms/books').then((r) => r.json()).then((j) => j.data || []).catch(() => []),
          cmsClient.getRevisions(),
          cmsClient.getDuplicates(),
        ]);

      setStats(statsData);
      setTopics(topicsData);
      setCategories(catsData);
      setDalils(dalilsData);
      setBooks(booksData);
      setRevisions(revsData);
      setDuplicates(dupData);
    } catch (e) {
      console.error('Error loading CMS data:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
    const unsubscribe = cmsClient.subscribe(() => {
      loadAllData();
    });
    return unsubscribe;
  }, [loadAllData]);

  // Topic Actions
  const handleOpenEditTopic = (t: CMSTopic) => {
    setEditorTopic(t);
    setIsEditorOpen(true);
  };

  const handleOpenNewTopic = () => {
    setEditorTopic(null);
    setIsEditorOpen(true);
  };

  const handleSaveTopic = async (topicData: Partial<CMSTopic> & { id: string }, summary?: string) => {
    await cmsClient.saveTopic(topicData, summary);
    setIsEditorOpen(false);
    await loadAllData();
  };

  const handleDeleteTopic = async (id: string) => {
    await cmsClient.deleteTopic(id);
    await loadAllData();
  };

  const handleBatchDelete = async (ids: string[]) => {
    await cmsClient.batchDeleteTopics(ids);
    await loadAllData();
  };

  const handlePublishTopic = async (t: CMSTopic) => {
    await cmsClient.saveTopic({ id: t.id, status: 'published' }, `Penerbitan resmi materi ${t.title}`);
    await loadAllData();
  };

  // Category Actions
  const handleSaveCategory = async (cat: CMSCategory) => {
    await cmsClient.saveCategory(cat);
    await loadAllData();
  };

  const handleDeleteCategory = async (id: string) => {
    const res = await cmsClient.deleteCategory(id);
    await loadAllData();
    return res;
  };

  // Duplicate Resolution
  const handleResolveDuplicate = async (
    topicId: string,
    action: 'mark_unique' | 'convert_draft' | 'delete'
  ) => {
    await cmsClient.resolveDuplicate(topicId, action);
    await loadAllData();
  };

  // Revisions
  const handleRollback = async (revId: string) => {
    const res = await cmsClient.rollbackRevision(revId);
    await loadAllData();
    return res;
  };

  // Dalil
  const handleSaveDalil = async (d: Partial<SharedDalil>) => {
    await cmsClient.saveSharedDalil(d);
    await loadAllData();
  };

  const handleDeleteDalil = async (id: string) => {
    const res = await cmsClient.deleteSharedDalil(id);
    await loadAllData();
    return res;
  };

  // AI Trigger
  const handleTriggerAI = (title: string, category: string, content: any) => {
    setAiTarget({ title, category, content });
    setIsAIModalOpen(true);
  };

  const handleApplyAIData = (data: any) => {
    if (editorTopic) {
      setEditorTopic((prev) => (prev ? { ...prev, ...data } : null));
    }
  };

  const subNavItems = [
    { id: 'dashboard', label: '1. Dashboard', icon: LayoutDashboard },
    { id: 'categories', label: '2. Kelola Kategori', icon: Layers },
    { id: 'topics', label: '3. Kelola Materi', icon: BookOpen, badge: topics.length },
    { id: 'books', label: '4. Kelola Kitab', icon: Library },
    { id: 'dalil', label: '5. Kelola Dalil', icon: Quote, badge: dalils.length },
    { id: 'duplicates', label: '6. Cek Duplikasi', icon: CopyCheck, badge: duplicates.length, alert: duplicates.length > 0 },
    { id: 'drafts', label: '7. Draf & Revisi', icon: FileText },
    { id: 'revisions', label: '8. Riwayat Perubahan', icon: History, badge: revisions.length },
    { id: 'settings', label: '9. Pengaturan & AI', icon: Settings },
  ];

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Top Admin Header Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-[#064E3B] to-teal-950 text-amber-50 rounded-2xl p-5 sm:p-6 shadow-lg border border-emerald-900 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToApp}
              className="p-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-900 text-amber-300 transition"
              title="Kembali ke Aplikasi Utama"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  Panel Administrator
                </span>
                <span className="text-xs text-emerald-300">
                  · Al-Maktabah Al-Islamiyyah
                </span>
              </div>
              <h1 className="font-serif font-bold text-xl sm:text-2xl text-amber-100 mt-0.5">
                Admin Dashboard — Manajemen Konten Islam
              </h1>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('academy')}
              className="px-3.5 py-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-amber-200 text-xs font-semibold flex items-center gap-1.5 border border-emerald-700/60 transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>Lihat Hasil di Akademi</span>
            </button>

            <button
              onClick={handleOpenNewTopic}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 text-xs font-bold transition flex items-center gap-1.5 shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Materi Baru</span>
            </button>
          </div>
        </div>

        {/* Admin Attribution Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-emerald-900/60 text-xs text-emerald-200/90">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Pengelola Utama: <strong>Jundi Abdul Syahid, S.Pd.</strong> (Orang Dalam Genetik Jawa)</span>
          </div>
          <span className="font-mono text-[11px] text-amber-300/80">
            Amanah Ilmiah · Rujukan Ahlusunah wal Jama'ah
          </span>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="bg-white rounded-2xl p-2 border border-stone-200 shadow-xs flex items-center gap-1.5 overflow-x-auto">
        {subNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSubTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSubTab(item.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                isActive
                  ? 'bg-emerald-900 text-amber-200 shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-stone-500'}`} />
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    item.alert
                      ? 'bg-rose-600 text-white font-bold'
                      : isActive
                      ? 'bg-black/20 text-amber-200'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tab View */}
      <div>
        {activeSubTab === 'dashboard' && (
          <AdminOverviewTab
            stats={stats}
            onNavigateTab={(tab) => setActiveSubTab(tab)}
            onOpenNewTopic={handleOpenNewTopic}
            onScanDuplicates={() => setActiveSubTab('duplicates')}
          />
        )}

        {activeSubTab === 'categories' && (
          <AdminCategoriesTab
            categories={categories}
            onSaveCategory={handleSaveCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        )}

        {activeSubTab === 'topics' && (
          <AdminTopicsTab
            topics={topics}
            categories={categories}
            onOpenEdit={handleOpenEditTopic}
            onOpenNew={handleOpenNewTopic}
            onDeleteTopic={handleDeleteTopic}
            onBatchDelete={handleBatchDelete}
          />
        )}

        {activeSubTab === 'books' && (
          <AdminBooksTab
            books={books}
            onOpenBook={onOpenBook}
            onSaveBook={async (book) => {
              await fetch('/api/cms/books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(book),
              });
              await loadAllData();
            }}
            onDeleteBook={async (id) => {
              const res = await fetch(`/api/cms/books/${id}`, { method: 'DELETE' });
              await loadAllData();
              return res.json();
            }}
          />
        )}

        {activeSubTab === 'dalil' && (
          <AdminDalilsTab
            dalils={dalils}
            allTopics={topics}
            onSaveDalil={handleSaveDalil}
            onDeleteDalil={handleDeleteDalil}
          />
        )}

        {activeSubTab === 'duplicates' && (
          <AdminDuplicatesTab
            reports={duplicates}
            allTopics={topics}
            onOpenEdit={handleOpenEditTopic}
            onResolve={handleResolveDuplicate}
            onRefresh={loadAllData}
          />
        )}

        {activeSubTab === 'drafts' && (
          <AdminDraftsTab
            topics={topics}
            onOpenEdit={handleOpenEditTopic}
            onPublishTopic={handlePublishTopic}
          />
        )}

        {activeSubTab === 'revisions' && (
          <AdminRevisionsTab
            revisions={revisions}
            allTopics={topics}
            onRollback={handleRollback}
            onRefresh={loadAllData}
          />
        )}

        {activeSubTab === 'settings' && (
          <AdminSettingsTab onRefreshData={loadAllData} />
        )}
      </div>

      {/* Full Topic Editor Modal */}
      <AdminTopicEditorModal
        isOpen={isEditorOpen}
        topic={editorTopic}
        categories={categories}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveTopic}
        onTriggerAI={handleTriggerAI}
      />

      {/* AI Assistant Modal */}
      <AdminAIAssistModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        topicTitle={aiTarget.title}
        categoryName={aiTarget.category}
        currentContent={aiTarget.content}
        onApplyToEditor={handleApplyAIData}
      />
    </div>
  );
};
