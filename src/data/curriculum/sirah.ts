import { CurriculumTopic } from './types';

const SIRAH_TOPIC_NAMES = [
  'Jazirah Arab sebelum Islam',
  'Nasab dan kehidupan awal Nabi Muhammad ﷺ',
  'Masa kenabian',
  'Dakwah secara sembunyi-sembunyi',
  'Dakwah secara terbuka',
  'Penindasan kaum muslimin di Makkah',
  'Hijrah ke Habasyah',
  'Isra dan Mikraj',
  'Baiat Aqabah',
  'Hijrah ke Madinah',
  'Pembangunan masyarakat Madinah',
  'Persaudaraan Muhajirin dan Ansar',
  'Perang Badar',
  'Perang Uhud',
  'Perang Khandaq',
  'Perjanjian Hudaibiyah',
  'Fathu Makkah',
  'Haji Wada\'',
  'Wafatnya Rasulullah ﷺ',
  'Abu Bakar Ash-Shiddiq',
  'Umar bin Khattab',
  'Utsman bin Affan',
  'Ali bin Abi Thalib',
  'Pengumpulan Al-Qur\'an',
  'Perkembangan ilmu hadis',
  'Dinasti Umayyah',
  'Dinasti Abbasiyah',
  'Perkembangan ilmu pengetahuan',
  'Baitul Hikmah dan tradisi penerjemahan',
  'Imam Abu Hanifah',
  'Imam Malik',
  'Imam Asy-Syafi\'i',
  'Imam Ahmad bin Hanbal',
  'Perkembangan mazhab fikih',
  'Ulama hadis klasik',
  'Ulama tafsir klasik',
  'Perkembangan pendidikan Islam',
  'Peradaban Islam di Andalusia',
  'Perkembangan Islam di Afrika',
  'Perkembangan Islam di Asia',
  'Masuknya Islam ke Nusantara',
  'Peran ulama dalam sejarah Indonesia',
  'Kesultanan Islam di Nusantara',
  'Perkembangan pesantren',
  'Sejarah dakwah di Jawa',
  'Hubungan Islam dan kebudayaan lokal',
  'Perkembangan ilmu dan perpustakaan Islam',
  'Gerakan pembaruan pemikiran Islam',
  'Sejarah Islam kontemporer',
  'Metode kritik sumber sejarah Islam'
];

export const SIRAH_TOPICS: CurriculumTopic[] = SIRAH_TOPIC_NAMES.map((name, index) => {
  const num = index + 1;
  const id = `sirah-${num < 10 ? '0' + num : num}`;

  return {
    id,
    categoryId: 'sirah',
    categoryName: 'Sejarah Islam dan Sirah',
    categoryNameAr: 'السِّيرَةُ النَّبَوِيَّةُ وَالتَّارِيخُ',
    number: num,
    title: name,
    titleAr: `تَارِيخُ ${name.toUpperCase()}`,
    objective: `Mempelajari rekam jejak sejarah, ibrah perjuangan nubuwwah, dan perkembangan peradaban Islam seputar ${name.toLowerCase()}.`,
    linguisticDef: `As-Sirah bermakna jalan hidup, perjalanan waktu, atau biografi perilaku seseorang dari masa ke masa.`,
    syariDef: `Catatan historis perjalanan risalah kenabian Muhammad ﷺ, para sahabat, serta bentang sejarah peradaban Islam berlandaskan kritik sumber terpercaya.`,
    systematicExplanation: [
      `Materi "${name}" memberikan pelajaran hidup (ibrah) berharga mengenai bagaimana wahyu diwujudkan dalam dinamika sosial kemasyarakatan.`,
      `Para sejarawan muslim klasik seperti Ibnu Ishaq, Ibnu Hisyam, Ath-Thabari, dan Ibnu Katsir mendokumentasikan fakta dengan silsilah riwayat yang teliti.`,
      `Meneladani bab ini memperkokoh kecintaan kepada Rasulullah ﷺ, para sahabat, dan para ulama pembawa panji ilmu sepanjang zaman.`
    ],
    quranDalil: {
      arabic: 'لَّقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ لِّمَن كَانَ يَرْجُو اللَّهَ وَالْيَوْمَ الْآخِرَ',
      translation: 'Sesungguhnya telah ada pada (diri) Rasulullah itu suri teladan yang baik bagimu (yaitu) bagi orang yang mengharap (rahmat) Allah dan (kedatangan) hari kiamat.',
      surahRef: 'QS. Al-Ahzab: 21'
    },
    hadithDalil: {
      arabic: 'خَيْرُ أُمَّتِي قَرْنِي، ثُمَّ الَّذِينَ يَلُونَهُمْ، ثُمَّ الَّذِينَ يَلُونَهُمْ',
      translation: 'Sebaik-baik umatku adalah generasiku (sahabat), kemudian orang-orang setelah mereka (tabi\'in), kemudian orang-orang setelah mereka (tabi\'ut tabi\'in).',
      source: 'Shahih Al-Bukhari no. 3651, Shahih Muslim no. 2533',
      grade: 'Shahih',
      scholar: 'Muttafaqun \'Alaih',
      rawi: 'Imran bin Hushain radhiyallahu \'anhu'
    },
    ulamaExplanation: {
      scholar: 'Syaikh Shafiyurrahman Al-Mubarakfuri',
      bookRef: 'Ar-Rahiq Al-Makhtum',
      notes: `Peristiwa dalam ${name.toLowerCase()} dipilah dengan ketat membedakan antara riwayat shahih, riwayat yang lemah, dan penafsiran sejarawan modern.`
    },
    legalDetailsAndModernApp: [
      `Mengambil teladan kepemimpinan adil, adab dakwah santun, keteguhan prinsip, dan toleransi berbudaya yang ditunjukkan para tokoh sejarah Islam.`,
      `Menolak narasi distorsi orientalis yang mencoreng kemuliaan para sahabat Nabi.`
    ],
    ikhtilafNotes: 'Dalam riwayat tarikh, para muhadditsin membedakan standar sanad hadits hukum (yang sangat ketat) dengan riwayat maghazi dan sirah, dengan tetap menolak kedustaan nyata.',
    conclusion: `Sejarah Islam bukan sekadar masa lalu, melainkan lentera kebijaksanaan untuk menata masa depan peradaban umat.`,
    furtherReading: ['Tarikh Ath-Thabari', 'Al-Bidayah wan Nihayah karya Ibnu Katsir'],
    quiz: {
      question: `Apakah manfaat utama mempelajari sirah nabawiyyah dan sejarah Islam?`,
      options: [
        'Meneladani akhlak Rasulullah ﷺ dan mengambil ibrah peradaban',
        'Menghafal tahun peperangan tanpa memahami hikmahnya',
        'Mengagumi fanatisme kesukuan Jahiliyah',
        'Mengabaikan Sunnah dan ajaran syariat'
      ],
      correctIndex: 0,
      explanation: 'Sirah adalah penjabaran praktis Al-Qur\'an dalam kehidupan nyata Rasulullah ﷺ.'
    }
  };
});
