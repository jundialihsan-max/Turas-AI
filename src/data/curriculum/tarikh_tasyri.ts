import { CurriculumTopic } from './types';

const TARIKH_TASYRI_TOPIC_NAMES = [
  'Pengertian tarikh tasyri\'',
  'Hukum pada masa Rasulullah ﷺ',
  'Sumber hukum pada masa Nabi',
  'Fatwa sahabat',
  'Ijtihad sahabat',
  'Perkembangan fikih pada masa Khulafaur Rasyidin',
  'Fikih pada masa tabi\'in',
  'Lahirnya pusat-pusat ilmu fikih',
  'Pembentukan mazhab fikih',
  'Sejarah kodifikasi fikih',
  'Pengertian ushul fikih',
  'Al-Qur\'an sebagai sumber hukum',
  'Sunnah sebagai sumber hukum',
  'Ijma\'',
  'Qiyas',
  'Istishab',
  'Maslahah mursalah',
  'Sadd adz-dzara\'i',
  'Istihsan',
  '\'Urf',
  'Maqashid syariah',
  'Al-ahkam al-khamsah',
  'Perintah dan larangan',
  'Lafaz umum dan khusus',
  'Mutlaq dan muqayyad',
  'Dalalah lafaz',
  'Mafhum mukhalafah',
  'Nasikh dan mansukh',
  'Ta\'arudh dan tarjih',
  'Ijtihad',
  'Taqlid',
  'Ittiba\'',
  'Fatwa',
  'Adab mufti dan mustafti',
  'Syarat seorang mujtahid',
  'Kaidah fikih',
  'Al-umur bi maqashidiha',
  'Al-yaqin la yazulu bisy-syakk',
  'Al-masyaqqah tajlibut taisir',
  'Adh-dharar yuzal',
  'Al-adah muhakkamah',
  'Perbedaan hukum dan fatwa',
  'Perbedaan pendapat ulama',
  'Perubahan fatwa dan konteks',
  'Fikih minoritas dan konteks masyarakat',
  'Transaksi digital',
  'Keuangan kontemporer',
  'Kedokteran dan hukum Islam',
  'Etika penerapan hukum syariat',
  'Studi kasus penerapan ushul fikih'
];

export const TARIKH_TASYRI_TOPICS: CurriculumTopic[] = TARIKH_TASYRI_TOPIC_NAMES.map((name, index) => {
  const num = index + 1;
  const id = `tarikh-tasyri-${num < 10 ? '0' + num : num}`;

  return {
    id,
    categoryId: 'tarikh_tasyri',
    categoryName: 'Tarikh Tasyri\' dan Ushul Fikih',
    categoryNameAr: 'تَارِيخُ التَّشْرِيعِ وَأُصُولُ الفِقْهِ',
    number: num,
    title: name,
    titleAr: `أُصُولُ ${name.toUpperCase()}`,
    objective: `Menguasai metodologi istinbath hukum syar'i, perkembangan sejarah legislasi Islam, dan kaidah qawa'id fiqhiyyah seputar ${name.toLowerCase()}.`,
    linguisticDef: `Ushul bermakna fondasi dasar tempat berpijaknya cabang; Tasyri' bermakna penetapan hukum dan jalan syariat.`,
    syariDef: `Kaidah-kaidah dan sarana metodologis yang digunakan oleh mujtahid untuk mengeluarkan hukum fikih praktis dari dalil-dalil tafshili Al-Qur'an dan Sunnah.`,
    systematicExplanation: [
      `Materi "${name}" merupakan instrumen akal ilmiah yang menjaga ijtihad hukum agar tidak serampangan dan senantiasa berpijak pada maqashid syariah.`,
      `Imam Asy-Syafi'i adalah peletak batu pertama kodifikasi ushul fikih dalam kitab monumentalnya "Ar-Risalah".`,
      `Memahami kaidah ini sangat krusial dalam menghadapi permasalahan kontemporer (seperti fintech syariah, bioetika kedokteran, dan transaksi digital).`
    ],
    quranDalil: {
      arabic: 'وَلَوْ رَدُّوهُ إِلَى الرَّسُولِ وَإِلَىٰ أُولِي الْأَمْرِ مِنْهُمْ لَعَلِمَهُ الَّذِينَ يَسْتَنبِطُونَهُ مِنْهُمْ',
      translation: 'Dan kalau mereka menyerahkannya kepada Rasul dan Ulil Amri di antara mereka, tentulah orang-orang yang ingin mengetahui kebenarannya akan dapat mengetahuinya dari mereka (orang-orang yang mampu melakukan istinbath).',
      surahRef: 'QS. An-Nisa\': 83'
    },
    hadithDalil: {
      arabic: 'إِذَا حَكَمَ الْحَاكِمُ فَاجْتَهَدَ ثُمَّ أَصَابَ فَلَهُ أَجْرَانِ، وَإِذَا حَكَمَ فَاجْتَهَدَ ثُمَّ أَخْطَأَ فَلَهُ أَجْرٌ',
      translation: 'Apabila seorang hakim (mujtahid) menghukumi lalu berijtihad dan benar, maka baginya dua pahala. Dan apabila ia berijtihad lalu keliru, maka baginya satu pahala.',
      source: 'Shahih Al-Bukhari no. 7352, Shahih Muslim no. 1716',
      grade: 'Shahih',
      scholar: 'Muttafaqun \'Alaih',
      rawi: 'Amr bin Al-\'Ash radhiyallahu \'anhu'
    },
    ulamaExplanation: {
      scholar: 'Al-Imam Asy-Syathibi',
      bookRef: 'Al-Muwafaqat fi Ushulisy Syari\'ah',
      notes: `Hukum syariat dibangun di atas kemaslahatan hamba di dunia dan akhirat; kaidah mengenai ${name.toLowerCase()} menjaga keselarasan teks dan tujuan syariat (maqashid).`
    },
    legalDetailsAndModernApp: [
      `Menjadikan kaidah ushul fikih sebagai filter epistemologi dalam menyikapi fatwa-fatwa institusi kontemporer (DSN-MUI, Majma\' Fiqh Islami, dll.).`,
      `Menumbuhkan adab berfatwa dan menghargai keragaman ijtihad yang sah.`
    ],
    ikhtilafNotes: 'Dua aliran utama dalam ushul fikih: Thariqah Al-Mutakallimin (Syafi\'iyyah, Malikiyyah, Hanabilah) yang membangun kaidah secara teoretis, dan Thariqah Al-Fuqaha (Hanafiyyah) yang membangun kaidah dari furu\' imam mazhab.',
    conclusion: `Ushul fikih adalah logika syariat yang membimbing nalar hukum Islam melintasi ruang dan zaman.`,
    furtherReading: ['Ar-Risalah karya Imam Asy-Syafi\'i', 'Al-Waraqat karya Imam Al-Haramain Al-Juwaini'],
    quiz: {
      question: `Siapakah imam mazhab yang pertama kali membukukan kaidah ilmu ushul fikih dalam kitab Ar-Risalah?`,
      options: [
        'Imam Muhammad bin Idris Asy-Syafi\'i',
        'Imam Abu Hanifah An-Nu\'man',
        'Imam Malik bin Anas',
        'Imam Ahmad bin Hanbal'
      ],
      correctIndex: 0,
      explanation: 'Imam Asy-Syafi\'i diakui secara aklamasi sebagai peletak dasar kodifikasi disiplin ilmu ushul fikih.'
    }
  };
});
