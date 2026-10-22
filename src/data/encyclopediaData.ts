/**
 * Ensiklopedia Syariat Islam Secara Kaffah (12 Pilar Kehidupan)
 */

export interface EncyclopediaEntry {
  id: string;
  category:
    | 'aqidah_hati'
    | 'ibadah_fisik'
    | 'muamalah'
    | 'keluarga'
    | 'pendidikan'
    | 'akhlak_sosial'
    | 'ekonomi'
    | 'kepemimpinan'
    | 'dakwah'
    | 'hak_kewajiban'
    | 'makanan_gaya_hidup'
    | 'teknologi_modern';
  categoryLabel: string;
  question: string;
  questionAr?: string;
  statusHukum: 'Disepakati (Ijma\')' | 'Masalah Ijtihadiyyah (Khilaf Mu\'tabar)' | 'Butuh Fatwa Ahli Khusus';
  quranDalil: {
    arabic: string;
    translation: string;
    surahRef: string;
    linkedBookId?: string;
  };
  hadithDalil: {
    arabic: string;
    translation: string;
    source: string;
    grade: 'Shahih' | 'Hasan' | 'Dhaif';
    scholar: string;
    rawi: string;
  };
  ulamaExplanation: string;
  mazhabViews: {
    hanafi?: string;
    maliki?: string;
    syafii?: string;
    hanbali?: string;
  };
  modernContext: string;
  connectedBranch: string; // Linking to one of the 9 curriculum branches
  sources: string[];
}

export const ENCYCLOPEDIA_ENTRIES: EncyclopediaEntry[] = [
  {
    id: 'enc-aqidah-1',
    category: 'aqidah_hati',
    categoryLabel: 'Aqidah & Ibadah Hati',
    question: 'Bagaimanakah hakikat pemurnian niat dan bahaya riya\' dalam amalan ibadah?',
    questionAr: 'مَا حَقِيقَةُ الإِخْلَاصِ وَخَطَرُ الرِّيَاءِ فِي الْأَعْمَالِ؟',
    statusHukum: 'Disepakati (Ijma\')',
    quranDalil: {
      arabic: 'فَمَن كَانَ يَرْجُو لِقَاءَ رَبِّهِ فَلْيَعْمَلْ عَمَلًا صَالِحًا وَلَا يُشْرِكْ بِعِبَادَةِ رَبِّهِ أَحَدًا',
      translation: 'Barangsiapa mengharap perjumpaan dengan Tuhannya, maka hendaklah ia mengerjakan kebajikan dan janganlah ia mempersekutukan dengan sesuatu pun dalam beribadah kepada Tuhannya.',
      surahRef: 'QS. Al-Kahfi: 110',
      linkedBookId: 'mushaf-al-quran',
    },
    hadithDalil: {
      arabic: 'إِنَّ أَخْوَفَ مَا أَخَافُ عَلَيْكُمُ الشِّرْكُ الْأَصْغَرُ: الرِّيَاءُ',
      translation: 'Sesungguhnya hal yang paling aku takuti menimpa kalian adalah syirik kecil: yaitu riya\'.',
      source: 'Musnad Ahmad no. 23630',
      grade: 'Shahih',
      scholar: 'Dishahihkan oleh Al-Mundziri dan Al-Albani',
      rawi: 'Mahmud bin Labid radhiyallahu \'anhu',
    },
    ulamaExplanation: 'Imam Ibnu Katsir menegaskan bahwa dua pilar amal yang mabrur adalah: amalan itu harus murni ikhlas semata karena Allah dan harus sesuai dengan tuntunan Rasulullah ﷺ.',
    mazhabViews: {
      hanafi: 'Riya\' menghapus pahala amalan yang tercampuri olehnya secara ijma\'.',
      maliki: 'Wajib berniat ikhlas sejak awal takbir hingga salam dalam ibadah fardhu.',
      syafii: 'Niat adalah rukun pokok penentu sahnya ibadah (Innamal a\'malu bin niyyat).',
      hanbali: 'Jika riya\' mendominasi asal mula amalan maka amalan batal dan tidak sah.',
    },
    modernContext: 'Tantangan era digital di mana pengguna media sosial rawan terjebak dalam memamerkan ibadah (selfie umrah, pamer sedekah daring) yang dapat mengikis keikhlasan.',
    connectedBranch: 'aqidah',
    sources: ['Tafsir Ibnu Katsir', 'Jami\'ul \'Ulum wal Hikam', 'Madarijus Salikin'],
  },
  {
    id: 'enc-ekonomi-1',
    category: 'ekonomi',
    categoryLabel: 'Ekonomi & Keuangan Syariah',
    question: 'Bagaimana hukum bunga bank konvensional, paylater berbunga, dan riba dalam transaksi keuangan modern?',
    questionAr: 'حُكْمُ فَوَائِدِ البُنُوكِ التَّقْلِيدِيَّةِ وَالرِّبَا فِي الْمُعَامَلَاتِ المُعَاصِرَةِ',
    statusHukum: 'Disepakati (Ijma\')',
    quranDalil: {
      arabic: 'وَأَحَلَّ اللَّهُ الْبَيْعَ وَحَرَّمَ الرِّبَا',
      translation: 'Dan Allah telah menghalalkan jual beli dan mengharamkan riba.',
      surahRef: 'QS. Al-Baqarah: 275',
    },
    hadithDalil: {
      arabic: 'لَعَنَ رَسُولُ اللَّهِ ﷺ آكِلَ الرِّبَا، وَمُؤْكِلَهُ، وَكَاتِبَهُ، وَشَاهِدَيْهِ، وَقَالَ: «هُمْ سَوَاءٌ»',
      translation: 'Rasulullah ﷺ melaknat pemakan riba, penyetor riba, pencatatnya, dan dua saksinya; beliau bersabda: "Mereka semua sama dosanya."',
      source: 'Shahih Muslim no. 1598',
      grade: 'Shahih',
      scholar: 'Imam Muslim',
      rawi: 'Jabir bin Abdillah radhiyallahu \'anhu',
    },
    ulamaExplanation: 'Keputusan Majma\' Al-Fiqh Al-Islami OKI (Organisasi Kerjasama Islam) menetapkan bahwa setiap tambahan yang disyaratkan atas pokok utang piutang (qardh) adalah riba nasiah yang diharamkan qath\'i.',
    mazhabViews: {
      hanafi: 'Kullu qardhin jarra manfa\'atan fahuwa riba (setiap piutang yang menarik manfaat bersyarat adalah riba).',
      maliki: 'Riba dalam utang piutang haram secara ijma\' tanpa pengecualian.',
      syafii: 'Haram mensyaratkan kelebihan pembayaran sekecil apapun dalam akad qardh.',
      hanbali: 'Wajib beralih kepada akad syar\'i seperti mudharabah, musyarakah, dan murabahah.',
    },
    modernContext: 'Solusi perbankan syariah, koperasi syariah, peer-to-peer lending syariah tanpa denda keterlambatan berbunga, serta literasi keuangan halal.',
    connectedBranch: 'fikih',
    sources: ['Resolusi Majelis Fikih Islami Jeddah', 'Fatwa DSN-MUI No. 1', 'Bidayatul Mujtahid'],
  },
  {
    id: 'enc-teknologi-1',
    category: 'teknologi_modern',
    categoryLabel: 'Teknologi & Kehidupan Modern',
    question: 'Bagaimana pandangan syariat mengenai pemanfaatan Kecerdasan Buatan (AI) dalam dakwah dan penetapan hukum?',
    questionAr: 'ضَوَابِطُ اسْتِخْدَامِ الذَّكَاءِ الاصْطِنَاعِيِّ فِي الخِدْمَاتِ الإِسْلَامِيَّةِ وَالفَتْوَى',
    statusHukum: 'Masalah Ijtihadiyyah (Khilaf Mu\'tabar)',
    quranDalil: {
      arabic: 'فَاسْأَلُوا أَهْلَ الذِّكْرِ إِن كُنتُمْ لَا تَعْلَمُونَ',
      translation: 'Maka tanyakanlah kepada orang yang berilmu (ahli dzikr) jika kamu tidak mengetahui.',
      surahRef: 'QS. An-Nahl: 43',
    },
    hadithDalil: {
      arabic: 'مَنْ أَفْتَى بِغَيْرِ عِلْمٍ كَانَ إِثْمُهُ عَلَى مَنْ أَفْتَاهُ',
      translation: 'Barangsiapa berfatwa tanpa dasar ilmu, maka dosanya dipikul oleh orang yang memberi fatwa tersebut.',
      source: 'Sunan Abu Dawud no. 3657',
      grade: 'Hasan',
      scholar: 'Al-Albani dalam Shahih Abi Dawud',
      rawi: 'Abu Hurairah radhiyallahu \'anhu',
    },
    ulamaExplanation: 'AI dapat dimanfaatkan sebagai sarana bantu riset, pencarian dalil, dan penyusunan draf khutbah, namun AI BUKAN mujtahid dan TIDAK BERHAK mengeluarkan fatwa hukum agama secara independen tanpa verifikasi ulama manusia.',
    mazhabViews: {
      hanafi: 'Alat dan sarana mengambil hukum tujuannya (Al-Wasa\'il laha ahkamul maqashid).',
      maliki: 'Wajib menerapkan sadd adz-dzara\'i agar AI tidak mengarang hadits atau ayat palsu.',
      syafii: 'Syarat mufti mensyaratkan keadilan, akal, dan istinbath; mesin tidak memenuhi syarat \'adalah.',
      hanbali: 'Diperbolehkan sebagai khadamah (alat bantu referensi) dengan syarat diverifikasi oleh ahli.',
    },
    modernContext: 'Penggunaan generator khutbah, asisten pencarian fikih, dan otomatisasi naskah keagamaan wajib disertai disclaimer dan review oleh khatib berkompeten.',
    connectedBranch: 'tarikh_tasyri',
    sources: ['Keputusan Majma\' Fiqh Al-Islami 2024 tentang AI', 'Kaidah Ushul Fikih Kontemporer'],
  },
  {
    id: 'enc-keluarga-1',
    category: 'keluarga',
    categoryLabel: 'Keluarga & Pernikahan',
    question: 'Bagaimana pembagian hak dan kewajiban suami istri dalam mewujudkan sakinah, mawaddah, wa rahmah?',
    questionAr: 'حُقُوقُ الزَّوْجَيْنِ وَمَسْؤُولِيَّاتُ الْأُسْرَةِ فِي الإِسْلَامِ',
    statusHukum: 'Disepakati (Ijma\')',
    quranDalil: {
      arabic: 'وَعَاشِرُوهُنَّ بِالْمَعْرُوفِ ۚ فَإِن كَرِهْتُمُوهُنَّ فَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَيَجْعَلَ اللَّهُ فِيهِ خَيْرًا كَثِيرًا',
      translation: 'Dan bergaullah dengan mereka secara patut. Kemudian jika kamu tidak menyukai mereka, (maka bersabarlah) karena mungkin kamu tidak menyukai sesuatu, padahal Allah menjadikan padanya kebaikan yang banyak.',
      surahRef: 'QS. An-Nisa\': 19',
    },
    hadithDalil: {
      arabic: 'خَيْرُكُمْ خَيْرُكُمْ لِأَهْلِهِ، وَأَنَا خَيْرُكُمْ لِأَهْلِي',
      translation: 'Sebaik-baik kalian adalah yang paling baik terhadap keluarganya (istrinya), dan aku adalah orang yang paling baik di antara kalian terhadap keluargaku.',
      source: 'Sunan At-Tirmidzi no. 3895',
      grade: 'Shahih',
      scholar: 'Imam At-Tirmidzi',
      rawi: 'Aisyah radhiyallahu \'anha',
    },
    ulamaExplanation: 'Suami berkewajiban memberikan nafkah lahir dan batin, memimpin dengan kasih sayang, dan menjaga kehormatan; istri berkewajiban taat dalam kebaikan, menjaga rahasia rumah tangga, dan memelihara anak.',
    mazhabViews: {
      hanafi: 'Kewajiban nafkah gugur jika istri nusyuz (membangkang) tanpa alasan syar\'i.',
      maliki: 'Mu\'asyarah bil ma\'ruf mencakup larangan membahayakan istri secara fisik maupun mental.',
      syafii: 'Nafkah diukur berdasarkan kemampuan suami dan standar kecukupan setempat (al-kifayah).',
      hanbali: 'Suami wajib mengajarkan pokok aqidah dan fardhu \'ain kepada keluarganya.',
    },
    modernContext: 'Membangun komunikasi beradab, manajemen finansial rumah tangga transparan, dan menghindari kekerasan dalam rumah tangga (KDRT).',
    connectedBranch: 'fikih',
    sources: ['Tafsir Al-Qurthubi', 'Al-Mughni karya Ibnu Qudamah', 'Fiqhus Sunnah'],
  },
  {
    id: 'enc-makanan-1',
    category: 'makanan_gaya_hidup',
    categoryLabel: 'Makanan & Gaya Hidup',
    question: 'Kriteria kehalalan makanan, sertifikasi halal, dan status zat turunan (istihalah) dalam industri pangan kontemporer?',
    questionAr: 'أَحْكَامُ الْأَطْعِمَةِ وَالْحَلَالِ وَالْاسْتِحَالَةِ فِي الصِّنَاعَةِ الْحَدِيثَةِ',
    statusHukum: 'Masalah Ijtihadiyyah (Khilaf Mu\'tabar)',
    quranDalil: {
      arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا كُلُوا مِن طَيِّبَاتِ مَا رَزَقْنَاكُمْ وَاشْكُرُوا لِلَّهِ إِن كُنتُمْ إِيَّاهُ تَعْبُدُونَ',
      translation: 'Wahai orang-orang yang beriman, makanlah dari rezeki yang baik-baik yang Kami berikan kepadamu dan bersyukurlah kepada Allah, jika benar-benar kepada-Nya kamu menyembah.',
      surahRef: 'QS. Al-Baqarah: 172',
    },
    hadithDalil: {
      arabic: 'إِنَّ الْحَلَالَ بَيِّنٌ، وَإِنَّ الْحَرَامَ بَيِّنٌ، وَبَيْنَهُمَا مُشْتَبِهَاتٌ',
      translation: 'Sesungguhnya yang halal itu jelas dan yang haram itu jelas; dan di antara keduanya terdapat perkara yang samar (syubhat).',
      source: 'Shahih Al-Bukhari no. 52, Shahih Muslim no. 1599',
      grade: 'Shahih',
      scholar: 'Muttafaqun \'Alaih',
      rawi: 'An-Nu\'man bin Basyir radhiyallahu \'anhu',
    },
    ulamaExplanation: 'Prinsip dasar pada makanan adalah halal sampai ada dalil shahih yang mengharamkannya. Jika suatu zat najis telah mengalami istihalah tamimah (transformasi kimia sempurna menjadi zat baru), ulama meneliti kesuciannya.',
    mazhabViews: {
      hanafi: 'Istihalah (perubahan wujud sempurna) menyucikan zat najis menjadi zat suci.',
      maliki: 'Sependapat dengan Hanafi bahwa zat yang berubah sifat dan karakternya menjadi suci.',
      syafii: 'Istihalah tidak menyucikan kecuali dalam 3 perkara (khamr menjadi cuka dengan sendirinya, kulit bangkai yang disamak, ulat yang lahir dari makanan).',
      hanbali: 'Memilih pendapat bahwa perubahan wujud total menghilangkan sifat kenajisan.',
    },
    modernContext: 'Pentingnya logo dan sertifikasi halal resmi (BPJPH / MUI) untuk produk impor, obat-obatan, dan suplemen.',
    connectedBranch: 'fikih',
    sources: ['Ahkamul Ath\'imah fil Islam', 'Fatwa MUI tentang Istihalah', 'Al-Majmu\' Syarah Al-Muhadzdzab'],
  },
];
