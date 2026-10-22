import { CurriculumTopic } from './types';

const FIKIH_TOPIC_NAMES = [
  'Pengertian fikih dan ushul fikih',
  'Sumber hukum Islam',
  'Hukum taklifi',
  'Hukum wadh\'i',
  'Thaharah',
  'Air dan jenis-jenisnya dalam fikih',
  'Najis dan cara menyucikannya',
  'Wudu',
  'Mandi wajib',
  'Tayamum',
  'Haid dan nifas',
  'Istinja dan adab buang hajat',
  'Shalat wajib',
  'Syarat dan rukun shalat',
  'Pembatal shalat',
  'Shalat berjamaah',
  'Shalat Jumat',
  'Shalat musafir',
  'Shalat orang sakit',
  'Sujud sahwi',
  'Shalat sunnah',
  'Zakat',
  'Zakat fitrah',
  'Puasa Ramadan',
  'Pembatal puasa',
  'Puasa sunnah',
  'I\'tikaf',
  'Haji',
  'Umrah',
  'Kurban dan akikah',
  'Jenazah dan pengurusan pemakaman',
  'Halal dan haram makanan',
  'Sembelihan',
  'Jual beli',
  'Riba',
  'Utang piutang',
  'Gadai dan jaminan',
  'Sewa menyewa',
  'Kerja sama usaha',
  'Zakat perdagangan dan keuangan',
  'Pernikahan',
  'Hak dan kewajiban suami istri',
  'Talak dan rujuk',
  'Waris',
  'Wasiat dan hibah',
  'Wakaf',
  'Sumpah dan nazar',
  'Makanan, pakaian, dan muamalah kontemporer',
  'Fikih perbedaan mazhab',
  'Fikih kehidupan modern dan penerapan maqashid syariah'
];

export const FIKIH_TOPICS: CurriculumTopic[] = FIKIH_TOPIC_NAMES.map((name, index) => {
  const num = index + 1;
  const id = `fikih-${num < 10 ? '0' + num : num}`;

  return {
    id,
    categoryId: 'fikih',
    categoryName: 'Fikih Islam Empat Mazhab',
    categoryNameAr: 'الفِقْهُ الإِسْلَامِيُّ',
    number: num,
    title: name,
    titleAr: `كِتَابُ ${name.toUpperCase()}`,
    objective: `Menguasai rukun, syarat, hukum, dalil, dan pandangan komparatif empat mazhab mengenai ${name.toLowerCase()}.`,
    linguisticDef: `Makna ${name.toLowerCase()} dalam etimologi bahasa Arab dan peristilahan fuqaha.`,
    syariDef: `Hukum syar'i amaliyyah yang digali dari dalil-dalil tafshili Al-Qur'an dan As-Sunnah tentang ${name.toLowerCase()}.`,
    systematicExplanation: [
      `Pembahasan fikih seputar "${name}" merupakan panduan praktis ibadah dan muamalah harian setiap muslim agar sah menurut syariat.`,
      `Keempat imam mazhab (Abu Hanifah, Malik, Asy-Syafi'i, dan Ahmad bin Hanbal) telah mengkodifikasikan dalil-dalil bab ini secara sistematis.`,
      `Memahami kaidah bab ini melahirkan kekhusyukan dalam beribadah dan kehati-hatian dalam bertransaksi halal-haram.`
    ],
    quranDalil: {
      arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا أَطِيعُوا اللَّهَ وَأَطِيعُوا الرَّسُولَ وَأُولِي الْأَمْرِ مِنكُمْ',
      translation: 'Wahai orang-orang yang beriman, taatilah Allah dan taatilah Rasul-Nya, dan ulil amri di antara kamu.',
      surahRef: 'QS. An-Nisa\': 59'
    },
    hadithDalil: {
      arabic: 'مَنْ يُرِدِ اللَّهُ بِهِ خَيْراً يُفَقِّهْهُ فِي الدِّينِ',
      translation: 'Barangsiapa yang Allah kehendaki kebaikan baginya, niscaya Allah fahamkan dia secara mendalam dalam urusan agama.',
      source: 'Shahih Al-Bukhari no. 71, Shahih Muslim no. 1037',
      grade: 'Shahih',
      scholar: 'Muttafaqun \'Alaih',
      rawi: 'Mu\'awiyah bin Abi Sufyan radhiyallahu \'anhu'
    },
    ulamaExplanation: {
      scholar: 'Al-Imam An-Nawawi',
      bookRef: 'Al-Majmu\' Syarah Al-Muhadzdzab',
      notes: `Rincian mengenai ${name.toLowerCase()} dipaparkan dengan menimbang dalil nash terkuat serta qaul mu\'tamad para imam mazhab.`
    },
    legalDetailsAndModernApp: [
      `Panduan praktis beribadah dan bermuamalah secara adil, jujur, dan beradab di era masyarakat modern.`,
      `Menghormati keragaman fatwa ulama muktabar dalam perkara furu' ijtihadiyyah.`
    ],
    ikhtilafNotes: 'Perbedaan pandangan para fuqaha dalam rincian bab ini bersumber dari perbedaan dalam memahami dalalah lafaz nash atau tarjih hadits.',
    conclusion: `Fikih adalah jalan lapang mengamalkan syariat Islam dengan landasan ilmu yang dapat dipertanggungjawabkan.`,
    furtherReading: ['Al-Fiqh Al-Islami wa Adillatuhu karya Wahbah Az-Zuhaili', 'Bidayatul Mujtahid karya Ibnu Rusyd'],
    quiz: {
      question: `Apakah tujuan utama mempelajari fikih tentang "${name}"?`,
      options: [
        'Agar ibadah dan muamalah sah sesuai tuntunan syariat',
        'Untuk memaksakan mazhab pribadi kepada orang lain',
        'Mencari keringanan tanpa dalil',
        'Mengganti hukum syariat yang sudah pasti'
      ],
      correctIndex: 0,
      explanation: 'Fikih bertujuan membimbing mukallaf agar ibadah dan muamalahnya sah dan diterima di sisi Allah.'
    }
  };
});
