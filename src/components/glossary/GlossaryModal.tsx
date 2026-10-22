import React, { useState } from 'react';
import { BookA, Search, X, Copy, Check } from 'lucide-react';

interface GlossaryTerm {
  termId: string;
  termAr: string;
  category: string;
  meaning: string;
  context: string;
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    termId: 'Tauhid',
    termAr: 'التَّوْحِيدُ',
    category: 'Aqidah',
    meaning: 'Mengesakan Allah dalam Rububiyah, Uluhiyah, dan Asma wa Sifat-Nya tanpa tandingan dan sekutu.',
    context: 'Pondasi utama ajaran Islam yang menentukan sahnya seluruh amal ibadah.',
  },
  {
    termId: 'Ittiba\'',
    termAr: 'الاِتِّبَاعُ',
    category: 'Manhaj & Hadis',
    meaning: 'Mengikuti dan meneladani tuntunan Rasulullah ﷺ berdasarkan dalil yang shahih tanpa membuat ajaran baru.',
    context: 'Syarat kedua diterimanya amal kebajikan selain keikhlasan niat.',
  },
  {
    termId: 'Takhrij',
    termAr: 'التَّخْرِيجُ',
    category: 'Ulumul Hadis',
    meaning: 'Penelusuran sumber hadits ke kitab-kitab induk aslinya beserta penyebutan sanad dan derajat keshahihannya.',
    context: 'Metodologi muhadditsin dalam memverifikasi riwayat agar terhindar dari hadits palsu.',
  },
  {
    termId: 'Maqashid Syariah',
    termAr: 'مَقَاصِدُ الشَّرِيعَةِ',
    category: 'Ushul Fikih',
    meaning: 'Tujuan-tujuan luhur pensyariatan hukum Islam demi mewujudkan kemaslahatan hamba dan menolak mudarat.',
    context: 'Meliputi 5 hal pokok (Dharuriyyat al-Khams): Menjaga agama, jiwa, akal, keturunan, dan harta.',
  },
  {
    termId: 'Qiyas',
    termAr: 'القِيَاسُ',
    category: 'Ushul Fikih',
    meaning: 'Menyamakan hukum suatu perkara baru dengan perkara asal yang ada nashnya karena persamaan \'illat (sebab hukum).',
    context: 'Salah satu sumber hukum Islam yang disepakati oleh mayoritas fuqaha empat mazhab.',
  },
  {
    termId: 'Ijma\'',
    termAr: 'الإِجْمَاعُ',
    category: 'Ushul Fikih',
    meaning: 'Kesepakatan seluruh mujtahid dari umat Muhammad ﷺ pada suatu masa setelah wafatnya beliau atas suatu hukum syar\'i.',
    context: 'Sumber hukum Islam ketiga yang bersifat qath\'i (pasti) mengikat.',
  },
  {
    termId: 'I\'rab',
    termAr: 'الإِعْرَابُ',
    category: 'Bahasa Arab & Nahwu',
    meaning: 'Perubahan harakat atau bentuk akhir kata akibat perbedaan amil yang memasukinya (Rafa\', Nashab, Jar, Jazm).',
    context: 'Kunci memahami makna kalimat Al-Qur\'an dan hadits secara presisi.',
  },
  {
    termId: 'Bayan',
    termAr: 'البَيَانُ',
    category: 'Balaghah',
    meaning: 'Ilmu yang membahas cara mengungkapkan satu makna dengan berbagai ragam gaya bahasa (tasybih, majaz, kinayah).',
    context: 'Sarana meresapi keindahan sastra Al-Qur\'an dan jawami\'ul kalim Nabi ﷺ.',
  },
  {
    termId: 'Tazkiyatun Nufus',
    termAr: 'تَزْكِيَةُ النُّفُوسِ',
    category: 'Akhlak',
    meaning: 'Penyucian jiwa dari noda syirik, kemaksiatan, serta penyakit hati (riya\', hasad, ujub, takabur).',
    context: 'Tujuan utama pembinaan spiritual setiap muslim untuk meraih qolbun salim.',
  },
  {
    termId: 'Wara\'',
    termAr: 'الوَرَعُ',
    category: 'Akhlak & Fikih',
    meaning: 'Meninggalkan perkara yang syubhat (samar) atau perkara mubah yang berlebihan karena khawatir terjatuh pada yang haram.',
    context: 'Tingkatan ketakwaan tinggi yang menjaga kesucian rezeki dan kehormatan diri.',
  },
];

export const GlossaryModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  if (!isOpen) return null;

  const categories = ['all', 'Aqidah', 'Ulumul Hadis', 'Ushul Fikih', 'Bahasa Arab & Nahwu', 'Balaghah', 'Akhlak'];

  const filtered = GLOSSARY_TERMS.filter((t) => {
    const matchCat = selectedCategory === 'all' || t.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const q = query.toLowerCase().trim();
    const matchQ =
      !q ||
      t.termId.toLowerCase().includes(q) ||
      t.termAr.includes(q) ||
      t.meaning.toLowerCase().includes(q) ||
      t.context.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 pt-16 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
              <BookA className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900">
                Kamus Istilah Islam & Glosarium Bahasa Arab
              </h3>
              <p className="text-xs text-stone-500">
                Perbendaharaan istilah syar'i dan gramatika dari literatur muktabar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-stone-400 hover:text-stone-700 font-bold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Categories */}
        <div className="p-4 border-b border-stone-100 space-y-3 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari istilah syar'i (Tauhid, Qiyas, I'rab, Wara')..."
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-emerald-700 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition ${
                  selectedCategory === c
                    ? 'bg-emerald-900 text-amber-200'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {c === 'all' ? 'Semua Istilah' : c}
              </button>
            ))}
          </div>
        </div>

        {/* Terms List */}
        <div className="p-4 overflow-y-auto space-y-3">
          {filtered.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-emerald-500 transition space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase bg-emerald-50 text-emerald-900 px-2 py-0.5 rounded font-bold border border-emerald-200">
                  {item.category}
                </span>
                <span className="font-arabic text-lg text-emerald-950 font-bold" dir="rtl">
                  {item.termAr}
                </span>
              </div>
              <h4 className="font-serif font-bold text-sm text-stone-900">
                {item.termId}
              </h4>
              <p className="text-xs text-stone-700 leading-relaxed font-medium">
                {item.meaning}
              </p>
              <p className="text-[11px] text-stone-500 italic bg-white p-2 rounded-lg border border-stone-200/60">
                Faidah: {item.context}
              </p>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="py-12 text-center text-xs text-stone-500">
              Tidak ada istilah yang cocok dengan "{query}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
