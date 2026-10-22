import { CurriculumTopic } from './types';

const BALAGHAH_TOPIC_NAMES = [
  'Pengantar adab Arab',
  'Sejarah sastra Arab',
  'Syair Arab klasik',
  'Prosa Arab',
  'Mu\'allaqat',
  'Penyair Jahiliyah',
  'Sastra pada masa Islam',
  'Sastra era Umayyah',
  'Sastra era Abbasiyah',
  'Sastra Andalusia',
  'Sastra Arab modern',
  'Pengantar balaghah',
  'Ilmu ma\'ani',
  'Ilmu bayan',
  'Ilmu badi\'',
  'Khabar dan insya\'',
  'Ijaz dan ithnab',
  'Musawah',
  'Taqdim dan ta\'khir',
  'Qashr',
  'Fashl dan washl',
  'Musnad dan musnad ilaih',
  'Tasybih',
  'Rukun tasybih',
  'Isti\'arah',
  'Majaz mursal',
  'Kinayah',
  'Haqiqah dan majaz',
  'Thibaq',
  'Muqabalah',
  'Jinas',
  'Saja\'',
  'Iqtibas',
  'Tauriyah',
  'Muhassinat lafzhiyyah',
  'Muhassinat ma\'nawiyyah',
  'Analisis gaya bahasa Al-Qur\'an',
  'Keindahan susunan kalimat Arab',
  'Analisis khutbah Arab klasik',
  'Surat-surat sastra Arab',
  'Adab dan etika penulisan',
  'Analisis teks sastra',
  'Kritik sastra Arab',
  'Perbandingan syair dan prosa',
  'Arudh',
  'Qafiyah',
  'Bina\' syair',
  'Penulisan prosa Arab',
  'Penerjemahan teks sastra',
  'Praktik menulis teks Arab yang fasih'
];

export const BALAGHAH_TOPICS: CurriculumTopic[] = BALAGHAH_TOPIC_NAMES.map((name, index) => {
  const num = index + 1;
  const id = `balaghah-${num < 10 ? '0' + num : num}`;

  return {
    id,
    categoryId: 'balaghah',
    categoryName: 'Sastra Arab dan Balaghah',
    categoryNameAr: 'الأَدَبُ العَرَبِيُّ وَالبَلَاغَةُ',
    number: num,
    title: name,
    titleAr: `بَابُ ${name.toUpperCase()}`,
    objective: `Menyelami aspek estetika sastra, rahasia kemukjizatan balaghah (I\'jazul Qur\'an), dan retorika seputar ${name.toLowerCase()}.`,
    linguisticDef: `Al-Balaghah bermakna sampainya suatu ungkapan secara fasih dan menyentuh tepat pada sasaran batin pendengarnya.`,
    syariDef: `Ilmu yang mempelajari kesesuaian ucapan fasih dengan tuntutan situasi dan kondisi mukhatab (muqthadha al-hal), terbagi dalam tiga cabang utama: Ma\'ani, Bayan, dan Badi\'.`,
    systematicExplanation: [
      `Materi "${name}" membukakan tirai keindahan bahasa Al-Qur'an dan kemuliaan sabda Nabi ﷺ yang diberi anugerah jawami\'ul kalim (kata ringkas sarat makna).`,
      `Pakar balaghah klasik seperti Abdul Qahir Al-Jurjani dan Al-Khatib Al-Qazwini menata kaidah ini agar umat dapat meresapi kemukjizatan sastra Ilahi.`,
      `Menguasai materi ini mengasah kemampuan menyusun khutbah, ceramah, dan tulisan ilmiah yang memikat, elegan, serta beradab.`
    ],
    quranDalil: {
      arabic: 'الرَّحْمَٰنُ ۝ عَلَّمَ الْقُرْآنَ ۝ خَلَقَ الْإِنسَانَ ۝ عَلَّمَهُ الْبَيَانَ',
      translation: '(Tuhan) Yang Maha Pemurah, Yang telah mengajarkan Al-Qur\'an. Dia menciptakan manusia, mengajarnya pandai berbicara (bayan).',
      surahRef: 'QS. Ar-Rahman: 1-4'
    },
    hadithDalil: {
      arabic: 'إِنَّ مِنَ الْبَيَانِ لَسِحْراً',
      translation: 'Sesungguhnya sebagian dari kefasihan penjelasan (al-bayan) itu mengandung daya pikat laksana sihir (yang menggetarkan jiwa).',
      source: 'Shahih Al-Bukhari no. 5146',
      grade: 'Shahih',
      scholar: 'Imam Al-Bukhari',
      rawi: 'Abdullah bin Umar radhiyallahu \'anhuma'
    },
    ulamaExplanation: {
      scholar: 'Al-Imam Abdul Qahir Al-Jurjani',
      bookRef: 'Dala\'ilul I\'jaz fi \'Ilmil Ma\'ani',
      notes: `Keindahan dalam ${name.toLowerCase()} bukanlah sekadar pilihan kosa kata yang terisolir, melainkan keterpaduan nazhm (jalinan makna) yang harmonis.`
    },
    legalDetailsAndModernApp: [
      `Memanfaatkan keahlian retorika dan estetika bahasa untuk dakwah yang santun, penulisan buku bermutu, dan khutbah yang mencerahkan nurani.`,
      `Menjauhi gaya bicara yang berbelit-belit tanpa isi atau sok fasih yang dibenci syariat.`
    ],
    ikhtilafNotes: 'Para ulama sastra meneliti apakah gaya bahasa Al-Qur\'an dapat ditandingi oleh manusia (pandangan jumhur: mustahil dan mukjizat sepanjang masa) versus pendapat syadz kaum Mu\'tazilah (as-sharfah).',
    conclusion: `Balaghah adalah puncak keindahan bahasa Arab yang menampakkan kemegahan mukjizat Al-Qur'anul Karim.`,
    furtherReading: ['Al-Balaghah Al-Wadhihah', 'Al-Idhah fi \'Ulumil Balaghah karya Al-Qazwini'],
    quiz: {
      question: `Tiga cabang utama dalam disiplin ilmu Balaghah adalah:`,
      options: [
        'Ilmu Ma\'ani, Ilmu Bayan, dan Ilmu Badi\'',
        'Fisika, Kimia, dan Biologi',
        'Nahwu, Sharaf, dan Khat',
        'Aritmatika, Geometri, dan Aljabar'
      ],
      correctIndex: 0,
      explanation: 'Balaghah terbagi atas Ma\'ani (makna kontekstual), Bayan (metafora & tasybih), dan Badi\' (ornamen keindahan lafaz/makna).'
    }
  };
});
