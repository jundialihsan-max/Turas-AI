import { CurriculumTopic } from './types';

const HADIS_TOPIC_NAMES = [
  'Pengertian hadis, sunnah, khabar, dan atsar',
  'Kedudukan hadis dalam syariat',
  'Fungsi hadis terhadap Al-Qur\'an',
  'Sejarah kodifikasi hadis',
  'Generasi periwayat hadis',
  'Sanad dan matan',
  'Perawi dan syarat periwayatan',
  'Pengertian hadis sahih',
  'Pengertian hadis hasan',
  'Pengertian hadis daif',
  'Hadis maudhu\'',
  'Hadis mutawatir',
  'Hadis ahad',
  'Hadis masyhur',
  'Hadis aziz dan gharib',
  'Hadis marfu\'',
  'Hadis mauquf',
  'Hadis maqthu\'',
  'Hadis mursal',
  'Hadis munqathi\'',
  'Hadis mu\'dhal',
  'Hadis mudallas',
  'Hadis mu\'allal',
  'Hadis syadz dan munkar',
  'Ilmu jarh wa ta\'dil',
  'Biografi perawi',
  'Takhrij hadis',
  'Perbedaan penomoran hadis',
  'Kitab Shahih Al-Bukhari',
  'Kitab Shahih Muslim',
  'Sunan Abu Dawud',
  'Jami\' At-Tirmidzi',
  'Sunan An-Nasa\'i',
  'Sunan Ibnu Majah',
  'Al-Muwaththa\'',
  'Musnad Ahmad',
  'Al-Arba\'in An-Nawawiyyah',
  'Riyadhus Shalihin',
  'Bulughul Maram',
  'Umdatul Ahkam',
  'Hadis-hadis tentang niat',
  'Hadis ibadah dan thaharah',
  'Hadis shalat',
  'Hadis zakat dan sedekah',
  'Hadis puasa',
  'Hadis haji dan umrah',
  'Hadis muamalah',
  'Hadis akhlak dan adab',
  'Metode memahami hadis yang tampak berbeda',
  'Praktik penelitian dan verifikasi hadis'
];

export const HADIS_TOPICS: CurriculumTopic[] = HADIS_TOPIC_NAMES.map((name, index) => {
  const num = index + 1;
  const id = `hadis-${num < 10 ? '0' + num : num}`;

  return {
    id,
    categoryId: 'hadis',
    categoryName: 'Hadis dan Ulumul Hadis',
    categoryNameAr: 'الحَدِيثُ وَعُلُومُهُ',
    number: num,
    title: name,
    titleAr: `بَابُ ${name.toUpperCase()}`,
    objective: `Memahami hakikat ${name.toLowerCase()} dalam kerangka kaidah ilmu riwayat dan dirayah para muhadditsin.`,
    linguisticDef: `Penjelasan kosakata istilah ${name.toLowerCase()} dalam tinjauan bahasa Arab dan tradisi periwayatan.`,
    syariDef: `Istilah para ahli hadis (muhadditsin) mengenai ${name.toLowerCase()} dalam memverifikasi keabsahan sanad dan matan.`,
    systematicExplanation: [
      `Materi "${name}" merupakan salah satu pilar penentu dalam menjaga keaslian sabda, perbuatan, dan ketetapan Rasulullah ﷺ.`,
      `Para imam penghimpun hadis merumuskan kriteria ketat untuk menyaring riwayat, memastikan ketersambungan sanad, dan menolak kepalsuan.`,
      `Dalam penerapannya, pemahaman terhadap bab ini menghindarkan seorang penuntut ilmu dari menisbatkan hadits lemah atau palsu kepada Nabi ﷺ.`
    ],
    quranDalil: {
      arabic: 'وَمَا آتَاكُمُ الرَّسُولُ فَخُذُوهُ وَمَا نَهَاكُمْ عَنْهُ فَانتَهُوا ۚ وَاتَّقُوا اللَّهَ',
      translation: 'Apa yang diberikan Rasul kepadamu, maka terimalah. Dan apa yang dilarangnya bagimu, maka tinggalkanlah. Dan bertakwalah kepada Allah.',
      surahRef: 'QS. Al-Hasyr: 7'
    },
    hadithDalil: {
      arabic: 'نَضَّرَ اللَّهُ امْرَأً سَمِعَ مِنَّا حَدِيثاً فَحَفِظَهُ حَتَّى يُبَلِّغَهُ',
      translation: 'Semoga Allah memancarkan cahaya pada wajah seseorang yang mendengar suatu hadits dari kami lalu ia menghafalnya hingga menyampaikannya kepada orang lain.',
      source: 'Sunan Abu Dawud no. 3660, Sunan At-Tirmidzi no. 2658',
      grade: 'Shahih',
      scholar: 'Dishahihkan oleh Imam At-Tirmidzi dan Ibnu Hibban',
      rawi: 'Abdullah bin Mas\'ud radhiyallahu \'anhu'
    },
    ulamaExplanation: {
      scholar: 'Al-Hafizh Ibnu Hajar Al-Asqalani',
      bookRef: 'Nukhbatul Fikar fi Musthalahi Ahlil Atsar',
      notes: `Kaidah mengenai ${name.toLowerCase()} telah dimatangkan secara ilmiah oleh para ulama hadits abad ke-3 hingga ke-9 Hijriyah.`
    },
    legalDetailsAndModernApp: [
      `Membiasakan budaya takhrij dan verifikasi sebelum menyebarkan kutipan hadis di media sosial dan pesan instan.`,
      `Mengedepankan kehati-hatian ilmiah terhadap riwayat dhaif jiddan atau maudhu'.`
    ],
    ikhtilafNotes: 'Jika terdapat perbedaan penilaian keshahihan antara imam mutaqaddimin dan muta\'akhkhirin, perhatikan argumentasi \'illah dan jalur sanadnya.',
    conclusion: `Penguasaan materi ${name.toLowerCase()} adalah benteng ilmiah dalam mempertahankan Sunnah Nabawiyyah.`,
    furtherReading: ['Muqaddimah Ibnu Shalah', 'Tadribur Rawi karya Imam As-Suyuthi'],
    quiz: {
      question: `Mengapa disiplin ilmu yang membahas "${name}" sangat diutamakan dalam Islam?`,
      options: [
        'Untuk membedakan riwayat yang shahih dan yang tertolak dari Nabi ﷺ',
        'Sekadar tradisi lisan kuno tanpa metodologi',
        'Agar bisa membuat hadits baru',
        'Karena tidak memerlukan sanad riwayat'
      ],
      correctIndex: 0,
      explanation: 'Ulama merumuskan kaidah sanad dan matan untuk menjaga kemurnian wahyu kedua (As-Sunnah).'
    }
  };
});
