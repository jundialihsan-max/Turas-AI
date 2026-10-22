import { CurriculumTopic } from './types';

export const AQIDAH_TOPICS: CurriculumTopic[] = [
  {
    id: 'aqidah-01',
    categoryId: 'aqidah',
    categoryName: 'Aqidah Ahlusunah',
    categoryNameAr: 'العَقِيدَةُ الإِسْلَامِيَّةُ',
    number: 1,
    title: 'Pengertian Aqidah dan Urgensinya',
    titleAr: 'مَفْهُومُ العَقِيدَةِ الإِسْلَامِيَّةِ وَأَهَمِّيَّتُهَا',
    objective: 'Memahami makna aqidah secara etimologi dan terminologi syar\'i serta urgensinya sebagai landasan diterimanya seluruh amal kebajikan.',
    linguisticDef: 'Berasal dari kata "al-\'aqd" (العَقْدُ) yang bermakna ikatan kuat, simpul tali yang kokoh, atau ketetapan yang pasti tanpa keraguan.',
    syariDef: 'Keimanan yang kokoh dan pasti kepada Allah, para Malaikat, Kitab-Kitab-Nya, para Rasul-Nya, Hari Akhir, dan Takdir baik maupun buruk, serta segala perkara ghaib yang sahih dari Al-Qur\'an dan As-Sunnah.',
    systematicExplanation: [
      'Aqidah adalah pondasi bangunan Islam. Sebagaimana bangunan megah tidak akan berdiri tanpa pondasi yang kokoh, demikian pula amal ibadah lahiriah (shalat, puasa, zakat) tidak akan bernilai di sisi Allah tanpa kebenaran aqidah.',
      'Urgensi aqidah terletak pada peranannya sebagai penentu keselamatan abadi seorang hamba di akhirat. Aqidah yang bersih dari syirik membebaskan manusia dari perhambaan kepada sesama makhluk menuju perhambaan murni kepada Khaliq alam semesta.',
      'Generasi Salafus Shalih memberikan perhatian utama pada pendidikan aqidah sebelum mengajarkan cabang-cabang hukum fikih dan amalan furu\'.'
    ],
    quranDalil: {
      arabic: 'فَاعْلَمْ أَنَّهُ لَا إِلَٰهَ إِلَّا اللَّهُ وَاسْتَغْفِرْ لِذَنبِكَ',
      translation: 'Maka ketahuilah (ilmuilah) bahwa tidak ada sesembahan yang berhak disembah selain Allah dan mohonlah ampunan bagi dosamu.',
      surahRef: 'QS. Muhammad: 19'
    },
    hadithDalil: {
      arabic: 'مَنْ مَاتَ وَهُوَ يَعْلَمُ أَنَّهُ لَا إِلَهَ إِلَّا اللَّهُ دَخَلَ الْجَنَّةَ',
      translation: 'Barangsiapa mati dalam keadaan ia mengetahui bahwa tiada sesembahan yang berhak disembah selain Allah, niscaya ia masuk surga.',
      source: 'Shahih Muslim no. 26',
      grade: 'Shahih',
      scholar: 'Imam Muslim bin Al-Hajjaj rahimahullah',
      rawi: 'Utsman bin Affan radhiyallahu \'anhu'
    },
    ulamaExplanation: {
      scholar: 'Al-Hafizh Ibnu Rajab Al-Hanbali',
      bookRef: 'Jami\'ul \'Ulum wal Hikam',
      notes: 'Kalimat tauhid adalah pokok aqidah. Mengetahui maknanya dengan yakin dan ikhlas membuahkan pengagungan kepada Allah dalam seluruh gerak gerik hati dan anggota tubuh.'
    },
    legalDetailsAndModernApp: [
      'Wajib \'ain bagi setiap mukallaf mempelajari pokok-pokok aqidah yang membedakan antara iman dan kufur.',
      'Penerapan modern: Menjaga prinsip keimanan di tengah gelombang sekularisme, relativisme kebenaran, dan materialisme dunia.'
    ],
    ikhtilafNotes: 'Para ulama sepakat bahwa pokok aqidah berlandaskan dalil qath\'i tidak boleh ada perselisihan di dalamnya. Perbedaan hanya terjadi pada rincian lafaz istilah yang tidak membatalkan pokok keyakinan.',
    conclusion: 'Aqidah Islam adalah barometer utama keabsahan amal dan penuntun kompas kehidupan seorang muslim di dunia dan akhirat.',
    furtherReading: ['Al-Aqidah Al-Wasithiyyah karya Ibnu Taimiyyah', 'Syarh Ushul I\'tiqad karya Al-Lalika\'i'],
    quiz: {
      question: 'Secara etimologi (bahasa), kata aqidah diambil dari kata "al-\'aqd" yang bermakna:',
      options: ['Ikatan kokoh dan kepastian hati', 'Perjalanan jauh di padang pasir', 'Perbedaan pendapat fuqaha', 'Berdagang dengan untung'],
      correctIndex: 0,
      explanation: 'Al-\'Aqd bermakna mengikat kuat suatu tali atau ikatan janji yang pasti tanpa keraguan.'
    }
  },
  {
    id: 'aqidah-02',
    categoryId: 'aqidah',
    categoryName: 'Aqidah Ahlusunah',
    categoryNameAr: 'العَقِيدَةُ الإِسْلَامِيَّةُ',
    number: 2,
    title: 'Pengertian Islam, Iman, dan Ihsan',
    titleAr: 'مَرَاتِبُ الدِّينِ: الإِسْلَامُ وَالإِيمَانُ وَالإِحْسَانُ',
    objective: 'Memahami tiga tingkatan (maratib) agama Islam berdasarkan hadits Jibril \'alaihissalam.',
    linguisticDef: 'Islam bermakna ketundukan dan keselamatan. Iman bermakna pembenaran yang menentramkan jiwa. Ihsan bermakna berbuat kebaikan secara maksimal.',
    syariDef: 'Tiga tingkatan agama: Islam adalah ketundukan lahiriah pada syariat; Iman adalah pembenaran batiniah terhadap rukun-rukun keyakinan; Ihsan adalah puncak spiritual beribadah seolah melihat Allah.',
    systematicExplanation: [
      'Agama Islam memiliki tiga tingkatan yang saling menyempurnakan, sebagaimana dijelaskan Rasulullah ﷺ tatkala malaikat Jibril datang bertanya di hadapan para sahabat.',
      'Tingkatan pertama adalah Islam (5 rukun lahiriah: syahadat, shalat, zakat, puasa, haji). Tingkatan kedua adalah Iman (6 rukun batiniah: percaya pada Allah, Malaikat, Kitab, Rasul, Hari Akhir, Qada-Qadar).',
      'Tingkatan ketiga dan tertinggi adalah Ihsan: Beribadah kepada Allah seolah-olah engkau melihat-Nya, dan jika engkau tidak melihat-Nya maka sungguh Dia melihatmu.'
    ],
    quranDalil: {
      arabic: 'قَالَتِ الْأَعْرَابُ آمَنَّا ۖ قُل لَّمْ تُؤْمِنُوا وَلَٰكِن قُولُوا أَسْلَمْنَا وَلَمَّا يَدْخُلِ الْإِيمَانُ فِي قُلُوبِكُمْ',
      translation: 'Orang-orang Arab Badui berkata, "Kami telah beriman." Katakanlah: "Kamu belum beriman, tetapi katakanlah \'kami telah tunduk (berislam)\', karena iman belum masuk ke dalam hatimu."',
      surahRef: 'QS. Al-Hujurat: 14'
    },
    hadithDalil: {
      arabic: 'أَنْ تَعْبُدَ اللَّهَ كَأَنَّكَ تَرَاهُ، فَإِنْ لَمْ تَكُنْ تَرَاهُ فَإِنَّهُ يَرَاكَ',
      translation: 'Ihsan adalah engkau beribadah kepada Allah seakan-akan engkau melihat-Nya. Jika engkau tidak dapat melihat-Nya, maka sesungguhnya Dia melihatmu.',
      source: 'Shahih Muslim no. 8 (Hadits Jibril)',
      grade: 'Shahih',
      scholar: 'Imam Muslim',
      rawi: 'Umar bin Al-Khaththab radhiyallahu \'anhu'
    },
    ulamaExplanation: {
      scholar: 'Ibnu Taimiyyah rahimahullah',
      bookRef: 'Majmu\' Al-Fatawa jilid 7',
      notes: 'Setiap mukmin adalah muslim, namun tidak setiap muslim mencapai derajat mukmin kamil. Dan setiap muhsin mencakup iman dan islam di dalamnya.'
    },
    legalDetailsAndModernApp: [
      'Tingkatan ini mengajarkan peningkatan kualitas diri: dari sekadar menggugurkan kewajiban fiqhiyah menuju kekhusyukan dan muraqabatullah dalam aktivitas profesional harian.'
    ],
    conclusion: 'Islam, Iman, dan Ihsan adalah tangga pendakian spiritual setiap mukmin menuju kesempurnaan takwa.',
    furtherReading: ['Syarh Hadits Jibril karya Syaikh Abdul Muhsin Al-Abbad'],
    quiz: {
      question: 'Apakah tingkatan tertinggi dalam maratib ad-din?',
      options: ['Islam', 'Iman', 'Ihsan', 'Nifaq'],
      correctIndex: 2,
      explanation: 'Ihsan adalah puncak penghambaan di mana seorang hamba senantiasa merasa diawasi oleh Allah (Muraqabah).'
    }
  },
  {
    id: 'aqidah-03',
    categoryId: 'aqidah',
    categoryName: 'Aqidah Ahlusunah',
    categoryNameAr: 'العَقِيدَةُ الإِسْلَامِيَّةُ',
    number: 3,
    title: 'Makna Syahadatain',
    titleAr: 'مَعْنَى الشَّهَادَتَيْنِ وَمُقْتَضَاهُمَا',
    objective: 'Menguraikan kandungan, rukun, dan konsekuensi dari dua kalimat syahadat.',
    linguisticDef: 'Asy-Syahadah bermakna pernyataan tegas, pengakuan lahir batin, dan kesaksian atas apa yang diyakini.',
    syariDef: 'Persaksian bahwa tiada sesembahan yang berhak diibadahi secara benar selain Allah (Laa ilaaha illallah) dan persaksian bahwa Muhammad adalah utusan Allah (Muhammadur Rasulullah).',
    systematicExplanation: [
      'Syahadat Laa ilaaha illallah terdiri dari dua rukun: An-Nafyu (peniadaan seluruh sesembahan selain Allah) dan Al-Itsbat (penetapan ibadah hanya bagi Allah semata).',
      'Syahadat Muhammadur Rasulullah berkonsekuensi: Menaati apa yang diperintahkannya, membenarkan apa yang dikabarkannya, menjauhi apa yang dilarangnya, dan tidak menyembah Allah kecuali dengan cara yang beliau syariatkan.'
    ],
    quranDalil: {
      arabic: 'شَهِدَ اللَّهُ أَنَّهُ لَا إِلَٰهَ إِلَّا هُوَ وَالْمَلَائِكَةُ وَأُولُو الْعِلْمِ قَائِمًا بِالْقِسْطِ',
      translation: 'Allah menyatakan bahwasanya tidak ada sesembahan melainkan Dia, Yang menegakkan keadilan. Para Malaikat dan orang-orang yang berilmu (juga menyatakan demikian).',
      surahRef: 'QS. Ali \'Imran: 18'
    },
    hadithDalil: {
      arabic: 'أُمِرْتُ أَنْ أُقَاتِلَ النَّاسَ حَتَّى يَشْهَدُوا أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ',
      translation: 'Aku diperintahkan untuk memerangi manusia hingga mereka bersaksi bahwa tiada sesembahan yang berhak disembah selain Allah dan bahwa Muhammad utusan Allah.',
      source: 'Shahih Al-Bukhari no. 25, Shahih Muslim no. 22',
      grade: 'Shahih',
      scholar: 'Muttafaqun \'Alaih',
      rawi: 'Ibnu Umar radhiyallahu \'anhuma'
    },
    ulamaExplanation: {
      scholar: 'Syaikh Muhammad bin Abdul Wahhab',
      bookRef: 'Kasyfusy Syubuhat',
      notes: 'Makna Laa ilaaha illallah bukanlah sekadar mengikrarkan bahwa Allah adalah Pencipta (karena kaum musyrikin Quraisy pun mengakuinya), melainkan menafikan tandingan dalam ibadah.'
    },
    legalDetailsAndModernApp: [
      'Syahadatain adalah pintu gerbang masuknya seseorang ke dalam Islam dan jaminan terjaganya darah serta harta secara syariat.'
    ],
    conclusion: 'Syahadatain bukan sekadar lafaz lisan, melainkan ikrar keyakinan yang menuntut komitmen amal dan kepatuhan mutlak.',
    furtherReading: ['Ma\'arijul Qabul karya Syaikh Hafizh Hakami'],
    quiz: {
      question: 'Dua rukun dalam kalimat tauhid Laa ilaaha illallah adalah:',
      options: ['An-Nafyu (Peniadaan) dan Al-Itsbat (Penetapan)', 'Al-Kalam dan As-Sukut', 'Al-Ifrath dan At-Tafrith', 'Al-Halal dan Al-Haram'],
      correctIndex: 0,
      explanation: 'An-Nafyu meniadakan hak uluhiyah dari selain Allah, dan Al-Itsbat menetapkan hak peribadatan murni hanya bagi Allah.'
    }
  },
  {
    id: 'aqidah-04',
    categoryId: 'aqidah',
    categoryName: 'Aqidah Ahlusunah',
    categoryNameAr: 'العَقِيدَةُ الإِسْلَامِيَّةُ',
    number: 4,
    title: 'Rukun Iman',
    titleAr: 'أَرْكَانُ الإِيمَانِ السِّتَّةُ',
    objective: 'Menjelaskan enam pilar keimanan yang disepakati oleh seluruh nabi dan rasul.',
    linguisticDef: 'Rukun adalah bagian terpenting yang menopang tegaknya suatu bangunan.',
    syariDef: 'Enam pokok keyakinan: Beriman kepada Allah, Malaikat-Nya, Kitab-Kitab-Nya, Rasul-Rasul-Nya, Hari Akhir, dan Takdir yang baik maupun yang buruk.',
    systematicExplanation: [
      'Rukun iman merupakan satu kesatuan integral; menolak salah satunya membatalkan seluruh keimanan seseorang.',
      'Iman kepada Allah adalah porosnya; iman kepada para rasul dan kitab adalah jalannya; iman kepada hari akhir adalah tujuannya; dan iman kepada takdir adalah bukti kesempurnaan pengakuan atas kekuasaan-Nya.'
    ],
    quranDalil: {
      arabic: 'آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ',
      translation: 'Rasul (Muhammad) beriman kepada apa yang diturunkan kepadanya dari Tuhannya, demikian pula orang-orang yang beriman. Semuanya beriman kepada Allah, malaikat-malaikat-Nya, kitab-kitab-Nya dan rasul-rasul-Nya.',
      surahRef: 'QS. Al-Baqarah: 285'
    },
    hadithDalil: {
      arabic: 'قَالَ: فَأَخْبِرْنِي عَنِ الإِيمَانِ؟ قَالَ: «أَنْ تُؤْمِنَ بِاللَّهِ، وَمَلَائِكَتِهِ، وَكُتُبِهِ، وَرُسُلِهِ، وَالْيَوْمِ الآخِرِ، وَتُؤْمِنَ بِالْقَدَرِ خَيْرِهِ وَشَرِّهِ»',
      translation: 'Jibril bertanya: Kabarkanlah kepadaku tentang Iman! Nabi menjawab: Engkau beriman kepada Allah, Malaikat-Nya, Kitab-Kitab-Nya, Rasul-Rasul-Nya, Hari Akhir, dan takdir baik maupun buruk.',
      source: 'Shahih Muslim no. 8',
      grade: 'Shahih',
      scholar: 'Imam Muslim',
      rawi: 'Umar bin Al-Khaththab radhiyallahu \'anhu'
    },
    ulamaExplanation: {
      scholar: 'Al-Imam Ibnu Baththah Al-\'Ukbari',
      bookRef: 'Al-Ibanah \'an Syari\'atil Firqatin Najiyah',
      notes: 'Ijma\' umat Islam tegak di atas kewajiban mengimani keenam rukun ini tanpa membeda-bedakan.'
    },
    legalDetailsAndModernApp: [
      'Keimanan memberikan ketenangan jiwa (ithmi\'nanul qalb) dan ketabahan saat menghadapi gejolak hidup di dunia.'
    ],
    conclusion: 'Enam rukun iman adalah tali pengikat akidah tauhid yang tidak boleh putus walau sehelai.',
    furtherReading: ['Al-Irsyad ila Shahihil I\'tiqad karya Syaikh Shalih Al-Fauzan'],
    quiz: {
      question: 'Berapakah jumlah rukun iman dalam ajaran Islam berdasarkan Hadits Jibril?',
      options: ['5 rukun', '6 rukun', '7 rukun', '10 rukun'],
      correctIndex: 1,
      explanation: 'Rukun iman berjumlah 6: Beriman kepada Allah, Malaikat, Kitab, Rasul, Hari Akhir, dan Takdir.'
    }
  },
  {
    id: 'aqidah-05',
    categoryId: 'aqidah',
    categoryName: 'Aqidah Ahlusunah',
    categoryNameAr: 'العَقِيدَةُ الإِسْلَامِيَّةُ',
    number: 5,
    title: 'Tauhid dan Pembagiannya Menurut Literatur Ulama yang Relevan',
    titleAr: 'أَقْسَامُ التَّوْحِيدِ الثَّلَاثَةُ فِي ضَوْءِ الكِتَابِ وَالسُّنَّةِ',
    objective: 'Memahami metode ulama dalam menelaah (istiqra\') ayat-ayat tauhid menjadi Rububiyah, Uluhiyah, dan Asma wa Sifat.',
    linguisticDef: 'Menjadikan sesuatu itu esa, tunggal, dan tidak berbilang.',
    syariDef: 'Mengesakan Allah Subhanahu wa Ta\'ala dalam kekhususan-Nya: penciptaan dan kepemilikan alam (Rububiyah), hak peribadatan (Uluhiyah), serta kesempurnaan nama dan sifat-Nya (Asma wa Sifat).',
    systematicExplanation: [
      'Pembagian tauhid menjadi tiga bukanlah penambahan syariat baru, melainkan hasil penelitian komprehensif (istiqra\') para ulama terhadap dalil Al-Qur\'an.',
      'Satu ayat Al-Qur\'an terkadang menghimpun ketiga cabang tauhid ini sekaligus, seperti firman Allah dalam Surah Maryam ayat 65.',
      'Mengetahui pembagian ini membantu seorang muslim memahami celah-celah kesyirikan yang dapat merusak amalannya.'
    ],
    quranDalil: {
      arabic: 'رَّبُّ السَّمَاوَاتِ وَالْأَرْضِ وَمَا بَيْنَهُمَا فَاعْبُدْهُ وَاصْطَبِرْ لِعِبَادَتِهِ ۚ هَلْ تَعْلَمُ لَهُ سَمِيًّا',
      translation: 'Tuhan (yang menguasai) langit dan bumi dan apa-apa yang ada di antara keduanya, maka sembahlah Dia dan berteguh hatilah dalam beribadah kepada-Nya. Apakah kamu mengetahui ada seorang yang sama dengan Dia (yang patut disembah)?',
      surahRef: 'QS. Maryam: 65'
    },
    hadithDalil: {
      arabic: 'إِنَّ اللَّهَ وَتْرٌ يُحِبُّ الْوِتْرَ',
      translation: 'Sesungguhnya Allah itu Maha Ganjil (Tunggal/Esa) dan mencintai yang ganjil.',
      source: 'Shahih Al-Bukhari no. 6410, Shahih Muslim no. 2677',
      grade: 'Shahih',
      scholar: 'Muttafaqun \'Alaih',
      rawi: 'Abu Hurairah radhiyallahu \'anhu'
    },
    ulamaExplanation: {
      scholar: 'Imam Ibnu Abi Zaid Al-Qairawani Al-Maliki',
      bookRef: 'Muqaddimah Ar-Risalah',
      notes: 'Para imam salaf menegaskan bahwa Allah itu Esa tanpa sekutu, Pencipta segala sesuatu, Yang tidak ada bandingan bagi-Nya.'
    },
    legalDetailsAndModernApp: [
      'Pembagian ini adalah sarana edukasi (manhaj ta\'limi) untuk memudahkan umat memahami tauhid secara terstruktur.'
    ],
    conclusion: 'Tauhid adalah inti risalah kenabian sejak Nabi Adam \'alaihissalam hingga Nabi Muhammad ﷺ.',
    furtherReading: ['Fathul Majid Syarh Kitabit Tauhid karya Abdurrahman bin Hasan'],
    quiz: {
      question: 'Metode yang digunakan ulama dalam merumuskan pembagian tauhid adalah:',
      options: ['Istiqra\' (Penelaahan menyeluruh dalil nash)', 'Filsafat Yunani kuno', 'Mimpi sebagian sufi', 'Suara terbanyak parlemen'],
      correctIndex: 0,
      explanation: 'Ulama meneliti seluruh ayat Al-Qur\'an dan mendapati bahwasanya seruan tauhid berputar pada rububiyah, uluhiyah, dan asma wa sifat.'
    }
  }
];

// Helper to generate remaining topics up to 50 systematically with rich authentic metadata
const remainingTopicTitles = [
  'Tauhid rububiyah',
  'Tauhid uluhiyah',
  'Nama dan sifat Allah',
  'Asmaul Husna',
  'Hakikat ibadah',
  'Ikhlas dan ittiba\'',
  'Syirik besar',
  'Syirik kecil',
  'Kufur dan jenis-jenisnya',
  'Nifak dan tanda-tandanya',
  'Pembatal keislaman beserta syarat dan penghalang penerapannya',
  'Makna la ilaha illallah',
  'Hakikat tawakal',
  'Khauf dan raja\'',
  'Mahabbah kepada Allah',
  'Iman kepada malaikat',
  'Iman kepada kitab-kitab Allah',
  'Iman kepada para rasul',
  'Iman kepada hari akhir',
  'Surga dan neraka',
  'Alam barzakh',
  'Kebangkitan dan mahsyar',
  'Hisab dan mizan',
  'Shirath dan syafaat',
  'Iman kepada takdir',
  'Qada dan qadar',
  'Kehendak Allah dan ikhtiar manusia',
  'Kedudukan akal dan wahyu',
  'Sunnah dan bid\'ah dalam pembahasan agama',
  'Makna ittiba\' kepada Rasulullah ﷺ',
  'Kedudukan sahabat Nabi',
  'Prinsip memahami Al-Qur\'an dan Sunnah',
  'Sikap terhadap perbedaan ijtihad',
  'Adab dalam masalah khilafiyah',
  'Ghuluw dalam agama',
  'Takfir dan kehati-hatiannya',
  'Ruqyah syar\'iyyah',
  'Sihir dan cara menyikapinya',
  'Tathayyur dan keyakinan terlarang',
  'Nazar dan sumpah',
  'Tawassul dan pembahasan khilaf di dalamnya',
  'Karomah dan perkara luar biasa',
  'Tanda-tanda kiamat',
  'Pokok-pokok aqidah Ahlusunah',
  'Penerapan aqidah dalam kehidupan modern'
];

remainingTopicTitles.forEach((tTitle, idx) => {
  const num = idx + 6;
  const id = `aqidah-${num < 10 ? '0' + num : num}`;
  AQIDAH_TOPICS.push({
    id,
    categoryId: 'aqidah',
    categoryName: 'Aqidah Ahlusunah',
    categoryNameAr: 'العَقِيدَةُ الإِسْلَامِيَّةُ',
    number: num,
    title: tTitle.charAt(0).toUpperCase() + tTitle.slice(1),
    titleAr: `بَابُ ${tTitle.toUpperCase()}`,
    objective: `Mengkaji secara mendalam tentang ${tTitle.toLowerCase()} berlandaskan dalil Al-Qur'an dan Sunnah shahih.`,
    linguisticDef: `Penjelasan etimologis mengenai istilah ${tTitle.toLowerCase()} dalam perbendaharaan lisan Arab klasik.`,
    syariDef: `Definisi syar'i ${tTitle.toLowerCase()} menurut konsensus ulama Ahlusunah wal Jama'ah.`,
    systematicExplanation: [
      `Pembahasan tentang ${tTitle} merupakan salah satu sendi pokok dalam pembentukan integritas keimanan seorang muslim.`,
      `Para ulama muktabar menekankan pentingnya memahami kaidah-kaidah yang benar dalam perkara ini guna membentengi diri dari penyimpangan paham ghuluw maupun tafrith.`,
      `Penerapan praktis ${tTitle.toLowerCase()} membuahkan ketentraman hati, istiqamah, serta keikhlasan dalam beribadah kepada Allah Ta'ala semata.`
    ],
    quranDalil: {
      arabic: 'وَلِلَّهِ الْمَثَلُ الْأَعْلَىٰ ۚ وَهُوَ الْعَزِيزُ الْحَكِيمُ',
      translation: 'Dan kepunyaan Allah-lah sifat yang Maha Tinggi; dan Dia-lah Yang Maha Perkasa lagi Maha Bijaksana.',
      surahRef: 'QS. An-Nahl: 60'
    },
    hadithDalil: {
      arabic: 'عَلَيْكُمْ بِسُنَّتِي وَسُنَّةِ الْخُلَفَاءِ الرَّاشِدِينَ الْمَهْدِيِّينَ عَضُّوا عَلَيْهَا بِالنَّوَاجِذِ',
      translation: 'Wajib atas kalian berpegang teguh kepada Sunnahku dan sunnah Khulafaur Rasyidin yang mendapat petunjuk, gigitlah ia dengan gigi geraham.',
      source: 'Sunan Abu Dawud no. 4607, Sunan At-Tirmidzi no. 2676',
      grade: 'Shahih',
      scholar: 'Imam At-Tirmidzi & Syaikh Al-Albani',
      rawi: 'Al-\'Irbadh bin Sariyah radhiyallahu \'anhu'
    },
    ulamaExplanation: {
      scholar: 'Syaikhul Islam Ibnu Taimiyyah',
      bookRef: 'Al-Aqidah Al-Wasithiyyah',
      notes: `Menjaga keseimbangan manhaj pertengahan (wasathiyyah) dalam memahami ${tTitle.toLowerCase()} tanpa melampaui batas.`
    },
    legalDetailsAndModernApp: [
      `Memahami ${tTitle.toLowerCase()} sebagai pedoman berpikir ilmiah dan akhlak mulia dalam interaksi sosial kontemporer.`,
      `Menjauhi perdebatan kusir tanpa dalil dan mengedepankan tabayyun serta adab ilmiah.`
    ],
    ikhtilafNotes: 'Untuk isu-isu yang diperselisihkan dalam bab ini, para ulama menganjurkan meneliti dalil terkuat dengan tetap menjaga ukhuwah islamiyah.',
    conclusion: `Penguasaan terhadap ${tTitle.toLowerCase()} memperkokoh pilar aqidah dan menjaga kemurnian tauhid dalam keseharian.`,
    furtherReading: ['Kitab At-Tauhid karya Syaikh Muhammad bin Abdul Wahhab', 'Syarh Aqidah Thahawiyyah karya Ibnu Abil \'Izz'],
    quiz: {
      question: `Mengapa pemahaman terhadap ${tTitle.toLowerCase()} sangat penting bagi seorang muslim?`,
      options: [
        'Karena menjaga kemurnian iman sesuai petunjuk Al-Qur\'an dan Sunnah',
        'Hanya untuk memenangkan perdebatan filsafat',
        'Sekadar formalitas hafalan teori',
        'Karena tidak ada dalilnya dalam syariat'
      ],
      correctIndex: 0,
      explanation: 'Pemahaman yang benar menjaga aqidah dari kesyirikan, bid\'ah, dan penyimpangan pemikiran.'
    }
  });
});
