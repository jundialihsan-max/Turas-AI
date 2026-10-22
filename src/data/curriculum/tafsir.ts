import { CurriculumTopic } from './types';

const TAFSIR_TOPIC_NAMES = [
  'Pengantar ilmu tafsir',
  'Sejarah turunnya Al-Qur\'an',
  'Makkiyah dan Madaniyah',
  'Asbabun nuzul',
  'Pengumpulan dan kodifikasi mushaf',
  'Qira\'at Al-Qur\'an',
  'Muhkam dan mutasyabih',
  'Nasikh dan mansukh',
  '\'Am dan khas',
  'Mutlaq dan muqayyad',
  'Manthuq dan mafhum',
  'Tafsir bil ma\'tsur',
  'Tafsir bir ra\'yi dengan kaidah yang benar',
  'Tafsir Ath-Thabari',
  'Tafsir Ibnu Katsir',
  'Tafsir Al-Baghawi',
  'Tafsir As-Sa\'di',
  'Tafsir Al-Qurthubi',
  'Tafsir Al-Jalalain',
  'Adab mempelajari tafsir',
  'Surah Al-Fatihah',
  'Ayat-ayat tauhid',
  'Ayat tentang ibadah',
  'Ayat tentang iman',
  'Ayat tentang takwa',
  'Ayat tentang akhlak',
  'Ayat tentang keluarga',
  'Ayat tentang pendidikan',
  'Ayat tentang keadilan',
  'Ayat tentang amanah',
  'Ayat tentang perdagangan',
  'Ayat tentang zakat dan sedekah',
  'Ayat tentang puasa',
  'Ayat tentang haji',
  'Ayat tentang jihad dengan memperhatikan konteks dan kaidah tafsir',
  'Ayat tentang dakwah',
  'Ayat tentang kesabaran',
  'Ayat tentang syukur',
  'Ayat tentang tawakal',
  'Ayat tentang tobat',
  'Ayat tentang hari akhir',
  'Kisah para nabi',
  'Kisah umat terdahulu',
  'Ayat hukum',
  'Ayat tentang hubungan sosial',
  'Ayat tentang ilmu',
  'Ayat tentang alam',
  'Ayat tentang persatuan dan persaudaraan',
  'Metode tadabur yang benar',
  'Praktik menelusuri tafsir berdasarkan sumber'
];

export const TAFSIR_TOPICS: CurriculumTopic[] = TAFSIR_TOPIC_NAMES.map((name, index) => {
  const num = index + 1;
  const id = `tafsir-${num < 10 ? '0' + num : num}`;

  return {
    id,
    categoryId: 'tafsir',
    categoryName: 'Tafsir dan Ulumul Qur\'an',
    categoryNameAr: 'التَّفْسِيرُ وَعُلُومُ القُرْآنِ',
    number: num,
    title: name,
    titleAr: `بَابُ ${name.toUpperCase()}`,
    objective: `Memahami kaidah tafsir, konteks wahyu, dan makna ayat-ayat Al-Qur'an mengenai ${name.toLowerCase()}.`,
    linguisticDef: `Penjelasan kata tafsir dan ulumul Qur'an dalam lisan Arab: menyingkap, memperjelas, dan menerangkan tabir makna.`,
    syariDef: `Ilmu yang membahas tentang penurunan Al-Qur'an, lafaz, makna, hukum, hikmah, serta metode pemahaman yang muktabar.`,
    systematicExplanation: [
      `Materi "${name}" merupakan sarana utama dalam mentadaburi Kalamullah secara benar sesuai pemahaman Rasulullah ﷺ dan para sahabat.`,
      `Para mufassir agung menegaskan bahwa urutan tafsir terbaik adalah: menafsirkan Al-Qur'an dengan Al-Qur'an, menafsirkan Al-Qur'an dengan Sunnah, menafsirkan dengan perkataan sahabat, lalu tabi'in.`,
      `Memahami bab ini melindungi pembaca Al-Qur'an dari penafsiran spekulatif yang menyimpang dari kaidah kebahasaan dan syariat.`
    ],
    quranDalil: {
      arabic: 'كِتَابٌ أَنزَلْنَاهُ إِلَيْكَ مُبَارَكٌ لِّيَدَّبَّرُوا آيَاتِهِ وَلِيَتَذَكَّرَ أُولُو الْأَلْبَابِ',
      translation: 'Ini adalah sebuah kitab yang Kami turunkan kepadamu penuh dengan berkah supaya mereka memperhatikan ayat-ayatnya dan supaya mendapat pelajaran orang-orang yang mempunyai pikiran.',
      surahRef: 'QS. Shad: 29'
    },
    hadithDalil: {
      arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
      translation: 'Sebaik-baik kalian adalah orang yang belajar Al-Qur\'an dan mengajarkannya.',
      source: 'Shahih Al-Bukhari no. 5027',
      grade: 'Shahih',
      scholar: 'Imam Al-Bukhari',
      rawi: 'Utsman bin Affan radhiyallahu \'anhu'
    },
    ulamaExplanation: {
      scholar: 'Al-Hafizh Ibnu Katsir',
      bookRef: 'Muqaddimah Tafsir Al-Qur\'anul \'Azhim',
      notes: `Kaidah mengenai ${name.toLowerCase()} menuntut kehati-hatian sanad riwayat tafsir ma'tsur dan penguasaan bahasa Arab yang mendalam.`
    },
    legalDetailsAndModernApp: [
      `Menumbuhkan adab tilawah, tadabur harian, serta penerapan nilai-nilai Al-Qur'an dalam kehidupan berkeluarga dan bermasyarakat.`,
      `Menjauhi penafsiran ayat di luar konteks asbabun nuzul dan kaidah ushul tafsir.`
    ],
    ikhtilafNotes: 'Khilaf dalam tafsir terbagi dua: Ikhtilaf Tanawwu\' (perbedaan ragam makna yang saling melengkapi) dan Ikhtilaf Tadhadd (perbedaan yang saling bertentangan yang harus ditarjih).',
    conclusion: `Al-Qur'an adalah petunjuk abadi, dan memahami ${name.toLowerCase()} membukakan pintu hikmah kalam Ilahi.`,
    furtherReading: ['Al-Itqan fi \'Ulumil Qur\'an karya As-Suyuthi', 'Tafsir As-Sa\'di'],
    quiz: {
      question: `Apakah tingkatan pertama dan paling utama dalam metode penafsiran Al-Qur'an?`,
      options: [
        'Menafsirkan Al-Qur\'an dengan Al-Qur\'an',
        'Menggunakan logika bebas tanpa rujukan',
        'Mencari cerita israiliyyat',
        'Mencocok-cocokkan dengan mitos kuno'
      ],
      correctIndex: 0,
      explanation: 'Tafsir Al-Qur\'an bil Qur\'an adalah tingkatan tertinggi karena Allah yang paling mengetahui maksud firman-Nya.'
    }
  };
});
