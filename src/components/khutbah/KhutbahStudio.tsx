import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Printer, 
  Copy, 
  Check, 
  Clock, 
  RotateCw, 
  ShieldCheck, 
  Edit3, 
  Save, 
  Download, 
  FileText, 
  Send,
  History,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';

interface KhutbahData {
  title: string;
  titleAr: string;
  theme: string;
  type: string;
  estimatedDurationMinutes: number;
  khutbah1: {
    openingAr: string;
    openingId: string;
    contentAr: string;
    contentId: string;
    closingAr: string;
    closingId: string;
  };
  khutbah2: {
    openingAr: string;
    openingId: string;
    contentId: string;
    prayerAr: string;
    prayerId: string;
    closingAr: string;
    closingId: string;
  };
  dalilsUsed: {
    type: string;
    arabic: string;
    translation: string;
    source: string;
    grade: string;
  }[];
  summaryPoints: string[];
  bibliography: string[];
  createdAt?: string;
}

export const KhutbahStudio: React.FC = () => {
  const [khutbahType, setKhutbahType] = useState<string>('jumat');
  const [themeInput, setThemeInput] = useState<string>('Urgensi Menjaga Kemurnian Tauhid dan Meneladani Sunnah di Era Digital');
  const [duration, setDuration] = useState<number>(15);
  const [language, setLanguage] = useState<'bilingual' | 'id' | 'ar'>('bilingual');
  const [languageLevel, setLanguageLevel] = useState<'sederhana' | 'menengah' | 'akademik'>('menengah');
  const [style, setStyle] = useState<'formal' | 'menyentuh' | 'argumentatif' | 'edukatif'>('menyentuh');
  const [audience, setAudience] = useState<string>('Jamaah masjid umum dan generasi muda');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedKhutbah, setGeneratedKhutbah] = useState<KhutbahData | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [historyList, setHistoryList] = useState<KhutbahData[]>(() => {
    try {
      const saved = localStorage.getItem('maktabah_khutbah_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const presetThemes = [
    'Urgensi Menjaga Kemurnian Tauhid dan Meneladani Sunnah',
    'Keluarga Sakinah: Hak dan Kewajiban Suami Istri Menurut Al-Qur\'an',
    'Menghidupkan Jiwa Kejujuran dan Amanah dalam Dunia Kerja',
    'Bahaya Riya\' dan Kerusakan Amal dalam Perspektif Hadits',
    'Tadabur Surah Al-Fatihah: Poros Tauhid dan Tawakal',
    'Adab Bermedia Sosial: Menjauhi Ghibah dan Fitnah Daring',
    'Menyambut Bulan Suci Ramadan dengan Taubat Nasuha',
    'Pentingnya Mencari Nafkah Halal dan Menjauhi Riba'
  ];

  const handleGenerateKhutbah = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/khutbah/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: khutbahType,
          theme: themeInput,
          durationMinutes: duration,
          language,
          languageLevel,
          style,
          audience,
        }),
      });

      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        const itemWithDate: KhutbahData = {
          ...resJson.data,
          createdAt: new Date().toISOString(),
        };
        setGeneratedKhutbah(itemWithDate);

        // Save to history
        const updated = [itemWithDate, ...historyList.slice(0, 9)];
        setHistoryList(updated);
        localStorage.setItem('maktabah_khutbah_history', JSON.stringify(updated));
      } else {
        alert('Gagal menyusun khutbah: ' + (resJson.error || 'Terjadi kesalahan sistem'));
      }
    } catch (e: any) {
      console.error(e);
      alert('Gagal menghubungi server penyusun khutbah.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyFullText = () => {
    if (!generatedKhutbah) return;
    const text = `=== ${generatedKhutbah.title.toUpperCase()} ===
[${generatedKhutbah.titleAr}]
Tema: ${generatedKhutbah.theme} | Durasi: ~${generatedKhutbah.estimatedDurationMinutes} Menit

--- KHUTBAH PERTAMA ---
${generatedKhutbah.khutbah1.openingAr}
(${generatedKhutbah.khutbah1.openingId})

${generatedKhutbah.khutbah1.contentAr}

${generatedKhutbah.khutbah1.contentId}

${generatedKhutbah.khutbah1.closingAr}
(${generatedKhutbah.khutbah1.closingId})

--- KHUTBAH KEDUA ---
${generatedKhutbah.khutbah2.openingAr}
(${generatedKhutbah.khutbah2.openingId})

${generatedKhutbah.khutbah2.contentId}

${generatedKhutbah.khutbah2.prayerAr}
(${generatedKhutbah.khutbah2.prayerId})

${generatedKhutbah.khutbah2.closingAr}
(${generatedKhutbah.khutbah2.closingId})

--- RUJUKAN DALIL ---
${generatedKhutbah.dalilsUsed.map((d) => `• [${d.type}] ${d.source} (${d.grade}): ${d.translation}`).join('\n')}

--- DAFTAR PUSTAKA ---
${generatedKhutbah.bibliography.join('\n')}

[Disusun melalui Khutbah Studio AI — Al-Maktabah Al-Islamiyyah]`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Studio Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-[#064E3B] to-stone-900 text-amber-50 rounded-2xl p-6 sm:p-8 shadow-xl border border-emerald-800 space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-amber-400 text-emerald-950 shadow-sm">
            <Sparkles className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-white">
              Khutbah Studio AI — استوديو إعداد الخطب
            </h1>
            <p className="text-xs text-amber-200/90 font-arabic" dir="rtl">
              إِعْدَادُ الخُطَبِ وَالمَوَاعِظِ بِالأَدِلَّةِ الشَّرْعِيَّةِ المُحَقَّقَةِ
            </p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed max-w-3xl">
          Asisten cerdas bagi para asatidzah, dai, dan khatib untuk menyusun naskah Khutbah Jumat (dua khutbah), Idulfitri, Iduladha, Khutbah Nikah, Tausiyah, dan Kultum berbasis dalil Al-Qur'an dan Sunnah yang terverifikasi.
        </p>

        {/* Scholarly Responsibility Banner */}
        <div className="pt-2 flex items-start gap-2 text-[11px] text-amber-300 bg-emerald-900/60 p-3 rounded-xl border border-emerald-700/50">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>Amanah Ilmiah:</strong> Sistem tidak mengarang hadis, sanad, atau ayat palsu. Seluruh dalil merujuk pada kutubus sittah dan tafsir muktabar. Naskah wajib ditinjau kembali oleh khatib sebelum disampaikan di mimbar.
          </span>
        </div>
      </div>

      {/* Configuration Grid */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-6">
        <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-800" />
          Parameter dan Konfigurasi Naskah
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Jenis Khutbah */}
          <div className="space-y-1.5">
            <label className="font-semibold text-stone-700">Jenis Naskah:</label>
            <select
              value={khutbahType}
              onChange={(e) => setKhutbahType(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 font-medium text-stone-800 focus:outline-hidden focus:border-emerald-700 focus:bg-white"
            >
              <option value="jumat">Khutbah Jumat (Dua Khutbah Lengkap)</option>
              <option value="idulfitri">Khutbah Idulfitri</option>
              <option value="iduladha">Khutbah Iduladha</option>
              <option value="nikah">Khutbah Nikah (Khutbatul Hajah)</option>
              <option value="ceramah">Ceramah & Tausiyah Majelis</option>
              <option value="kultum">Kultum Ramadan (Ringkas & Padat)</option>
              <option value="nasihat_keluarga">Nasihat Pendidikan & Keluarga</option>
            </select>
          </div>

          {/* Durasi */}
          <div className="space-y-1.5">
            <label className="font-semibold text-stone-700">Target Durasi:</label>
            <div className="grid grid-cols-5 gap-1 text-center font-mono font-semibold">
              {[5, 10, 15, 20, 30].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  className={`py-2 rounded-lg border text-xs transition ${
                    duration === d
                      ? 'bg-emerald-900 text-amber-300 border-emerald-900 shadow-xs'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {d}m
                </button>
              ))}
            </div>
          </div>

          {/* Gaya Penyampaian */}
          <div className="space-y-1.5">
            <label className="font-semibold text-stone-700">Gaya Bahasa & Nada:</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value as any)}
              className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 font-medium text-stone-800 focus:outline-hidden focus:border-emerald-700 focus:bg-white"
            >
              <option value="menyentuh">Menyentuh Kalbu (Targhib & Tarhib)</option>
              <option value="formal">Resmi & Berwibawa</option>
              <option value="argumentatif">Ilmiah & Argumentatif</option>
              <option value="edukatif">Edukatif & Mudah Dipahami</option>
            </select>
          </div>
        </div>

        {/* Input Tema */}
        <div className="space-y-2">
          <label className="font-semibold text-xs text-stone-700 block">
            Tema / Judul Pembahasan Khutbah:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={themeInput}
              onChange={(e) => setThemeInput(e.target.value)}
              placeholder="Ketik tema khutbah yang diinginkan..."
              className="flex-1 p-3 rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
            />
            <button
              onClick={handleGenerateKhutbah}
              disabled={isLoading || !themeInput.trim()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-700 hover:to-emerald-800 text-amber-100 font-bold text-xs sm:text-sm shadow-md transition active:scale-95 disabled:opacity-50 flex items-center gap-2 shrink-0"
            >
              {isLoading ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Menyusun...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Susun Khutbah</span>
                </>
              )}
            </button>
          </div>

          {/* Preset Theme Chips */}
          <div className="pt-2 flex flex-wrap gap-1.5 items-center">
            <span className="text-[11px] font-semibold text-stone-500 mr-1">Rekomendasi Tema:</span>
            {presetThemes.map((th, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setThemeInput(th)}
                className="px-2.5 py-1 rounded-md bg-stone-100 hover:bg-emerald-50 hover:text-emerald-900 text-stone-600 text-[11px] transition"
              >
                {th}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generated Result Output */}
      {generatedKhutbah && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-lg p-6 sm:p-10 space-y-8 animate-fade-in print:p-0 print:border-none print:shadow-none">
          {/* Output Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-200 print:hidden">
            <div className="space-y-0.5">
              <span className="text-xs uppercase font-mono tracking-wider font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                Naskah Siap Khutbah · ~{generatedKhutbah.estimatedDurationMinutes} Menit
              </span>
              <p className="text-[11px] text-stone-500">
                Disusun dengan referensi shahih terverifikasi
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Selesai Mengedit' : 'Edit Naskah'}</span>
              </button>

              <button
                onClick={handleCopyFullText}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-800 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Salin Naskah'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-amber-100 text-xs font-semibold shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak / Simpan PDF</span>
              </button>
            </div>
          </div>

          {/* Khutbah Document Title */}
          <div className="text-center space-y-2 border-b border-stone-200 pb-6">
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-stone-900">
              {generatedKhutbah.title}
            </h1>
            <p className="font-arabic text-xl sm:text-2xl text-emerald-950 font-bold" dir="rtl">
              {generatedKhutbah.titleAr}
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-stone-500 pt-1">
              <span>Tema: {generatedKhutbah.theme}</span>
              <span>·</span>
              <span>Khatib: Penuntut Ilmu</span>
              <span>·</span>
              <span>Waktu Bacaan: ±{generatedKhutbah.estimatedDurationMinutes} Menit</span>
            </div>
          </div>

          {/* KHUTBAH PERTAMA */}
          <div className="space-y-5">
            <div className="inline-block bg-stone-900 text-amber-300 font-mono text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">
              Khutbah Pertama (الخُطْبَةُ الأُولَى)
            </div>

            {/* Opening Arabic */}
            <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200/80 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">
                Pembukaan Khutbah & Wasiat Takwa:
              </span>
              <p className="font-arabic text-xl sm:text-2xl text-stone-950 leading-loose text-right" dir="rtl">
                {generatedKhutbah.khutbah1.openingAr}
              </p>
              <p className="text-xs sm:text-sm text-stone-700 italic border-t border-amber-200/60 pt-2">
                "{generatedKhutbah.khutbah1.openingId}"
              </p>
            </div>

            {/* Main Content & Dalils */}
            {generatedKhutbah.khutbah1.contentAr && (
              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block">
                  Dalil Nash Al-Qur'an & Sunnah Pokok:
                </span>
                <p className="font-arabic text-xl sm:text-2xl text-stone-950 leading-loose text-right" dir="rtl">
                  {generatedKhutbah.khutbah1.contentAr}
                </p>
              </div>
            )}

            {/* Khutbah 1 Body Explanation */}
            <div className="prose prose-stone max-w-none text-xs sm:text-sm leading-relaxed text-stone-800 whitespace-pre-line space-y-3">
              {isEditing ? (
                <textarea
                  value={generatedKhutbah.khutbah1.contentId}
                  onChange={(e) =>
                    setGeneratedKhutbah({
                      ...generatedKhutbah,
                      khutbah1: { ...generatedKhutbah.khutbah1, contentId: e.target.value },
                    })
                  }
                  rows={10}
                  className="w-full p-3 rounded-xl border border-stone-300 text-xs sm:text-sm font-sans"
                />
              ) : (
                <p>{generatedKhutbah.khutbah1.contentId}</p>
              )}
            </div>

            {/* Closing 1 */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-right space-y-1">
              <p className="font-arabic text-lg text-stone-900 leading-loose" dir="rtl">
                {generatedKhutbah.khutbah1.closingAr}
              </p>
              <p className="text-xs text-stone-600 italic text-left">
                "{generatedKhutbah.khutbah1.closingId}"
              </p>
            </div>
          </div>

          {/* DUDUK ANTARA DUA KHUTBAH */}
          <div className="py-2 text-center text-xs font-mono uppercase tracking-widest text-stone-400 border-y border-dashed border-stone-200">
            [Duduk Sejenak di Antara Dua Khutbah Sembari Memperbanyak Doa]
          </div>

          {/* KHUTBAH KEDUA */}
          <div className="space-y-5">
            <div className="inline-block bg-stone-900 text-amber-300 font-mono text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">
              Khutbah Kedua (الخُطْبَةُ الثَّانِيَةُ)
            </div>

            {/* Opening 2 */}
            <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80 space-y-2">
              <p className="font-arabic text-xl sm:text-2xl text-stone-950 leading-loose text-right" dir="rtl">
                {generatedKhutbah.khutbah2.openingAr}
              </p>
              <p className="text-xs text-stone-700 italic">
                "{generatedKhutbah.khutbah2.openingId}"
              </p>
            </div>

            {/* Khutbah 2 Content */}
            <div className="text-xs sm:text-sm leading-relaxed text-stone-800 whitespace-pre-line">
              <p>{generatedKhutbah.khutbah2.contentId}</p>
            </div>

            {/* Doa Penutup Berharakat */}
            <div className="bg-emerald-950 text-amber-100 p-6 rounded-2xl border border-emerald-800 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                Doa Penutup Khutbah (الدُّعَاءُ لِلْمُسْلِمِينَ):
              </span>
              <p className="font-arabic text-xl sm:text-2xl text-amber-100 leading-loose text-right" dir="rtl">
                {generatedKhutbah.khutbah2.prayerAr}
              </p>
              <p className="text-xs text-emerald-200/90 italic border-t border-emerald-800 pt-3">
                "{generatedKhutbah.khutbah2.prayerId}"
              </p>
            </div>

            {/* Closing 2 */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1 text-right">
              <p className="font-arabic text-lg text-stone-900 leading-loose" dir="rtl">
                {generatedKhutbah.khutbah2.closingAr}
              </p>
              <p className="text-xs text-stone-600 italic text-left">
                "{generatedKhutbah.khutbah2.closingId}"
              </p>
            </div>
          </div>

          {/* Rujukan Dalil & Takhrij */}
          <div className="rounded-2xl bg-stone-50 border border-stone-200 p-5 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Verifikasi Takhrij Dalil yang Digunakan:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {generatedKhutbah.dalilsUsed.map((d, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white border border-stone-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-emerald-900">{d.type}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 font-mono text-[10px] font-bold border border-emerald-200">
                      {d.grade}
                    </span>
                  </div>
                  <p className="font-arabic text-sm text-right text-stone-900" dir="rtl">{d.arabic}</p>
                  <p className="text-stone-700 italic">"{d.translation}"</p>
                  <p className="text-[11px] text-stone-500 font-medium">Sumber: {d.source}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ringkasan Poin Khutbah */}
          <div className="rounded-xl bg-amber-50/60 border border-amber-200 p-4 space-y-2 text-xs">
            <strong className="text-amber-950 font-bold">Ringkasan Inti Nasihat:</strong>
            <ul className="list-disc pl-5 space-y-1 text-stone-700">
              {generatedKhutbah.summaryPoints.map((pt, idx) => (
                <li key={idx}>{pt}</li>
              ))}
            </ul>
          </div>

          {/* Daftar Pustaka */}
          <div className="text-[11px] text-stone-500 border-t border-stone-200 pt-4 flex flex-wrap items-center gap-x-4 gap-y-1">
            <strong>Daftar Pustaka:</strong>
            {generatedKhutbah.bibliography.map((b, idx) => (
              <span key={idx}>• {b}</span>
            ))}
          </div>
        </div>
      )}

      {/* History of Saved Khutbahs */}
      {historyList.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-3">
          <h3 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-800" />
            Riwayat Naskah Khutbah yang Pernah Dibuat
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {historyList.map((hist, idx) => (
              <div
                key={idx}
                onClick={() => setGeneratedKhutbah(hist)}
                className="p-3.5 rounded-xl border border-stone-200 hover:border-emerald-600 transition cursor-pointer flex items-center justify-between gap-3 bg-stone-50/50 hover:bg-emerald-50/30"
              >
                <div className="min-w-0">
                  <h5 className="font-semibold text-stone-900 truncate">{hist.title}</h5>
                  <p className="text-[11px] text-stone-500 truncate">
                    Tema: {hist.theme} · ~{hist.estimatedDurationMinutes}m
                  </p>
                </div>
                <button
                  type="button"
                  className="px-2.5 py-1 bg-emerald-800 text-amber-200 rounded-md font-semibold text-[11px]"
                >
                  Buka
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
