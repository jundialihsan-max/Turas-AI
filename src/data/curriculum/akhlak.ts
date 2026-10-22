import { CurriculumTopic } from './types';

const AKHLAK_TOPIC_NAMES = [
  'Ikhlas',
  'Niat',
  'Taubat',
  'Sabar',
  'Syukur',
  'Tawakal',
  'Khauf',
  'Raja\'',
  'Mahabbah',
  'Zuhud',
  'Wara\'',
  'Qana\'ah',
  'Tawadhu',
  'Menjaga lisan',
  'Kejujuran',
  'Amanah',
  'Menepati janji',
  'Menjaga kehormatan',
  'Menahan amarah',
  'Memaafkan',
  'Berbakti kepada orang tua',
  'Hak pasangan',
  'Mendidik anak',
  'Silaturahmi',
  'Hak tetangga',
  'Adab bertamu',
  'Adab makan dan minum',
  'Adab tidur',
  'Adab berpakaian',
  'Adab masjid',
  'Adab membaca Al-Qur\'an',
  'Adab menuntut ilmu',
  'Adab guru dan murid',
  'Adab berbeda pendapat',
  'Menjauhi ghibah',
  'Menjauhi namimah',
  'Hasad dan terapinya',
  'Riya\'',
  'Ujub',
  'Takabur',
  'Cinta dunia',
  'Muhasabah',
  'Mengelola waktu',
  'Persaudaraan Islam',
  'Kepemimpinan yang amanah',
  'Adab bermedia sosial',
  'Etika bekerja',
  'Adab berdakwah',
  'Keseimbangan hak dan kewajiban',
  'Pembentukan karakter muslim'
];

export const AKHLAK_TOPICS: CurriculumTopic[] = AKHLAK_TOPIC_NAMES.map((name, index) => {
  const num = index + 1;
  const id = `akhlak-${num < 10 ? '0' + num : num}`;

  return {
    id,
    categoryId: 'akhlak',
    categoryName: 'Akhlak, Tazkiyah, dan Adab',
    categoryNameAr: 'الأَخْلَاقُ وَتَزْكِيَةُ النُّفُوسِ',
    number: num,
    title: name,
    titleAr: `بَابُ ${name.toUpperCase()}`,
    objective: `Membangun keluhuran budi pekerti, menyucikan kalbu dari penyakit hati, dan mempraktikkan adab islami seputar ${name.toLowerCase()}.`,
    linguisticDef: `Al-Akhlaq adalah bentuk jamak dari khuluq yang bermakna tabiat, perangai batin, dan watak dasar manusia.`,
    syariDef: `Kondisi kejiwaan yang tertanam kokoh yang melahirkan perbuatan-perbuatan luhur dengan mudah tanpa memerlukan pertimbangan yang dipaksakan, berlandaskan petunjuk wahyu.`,
    systematicExplanation: [
      `Materi "${name}" merupakan inti dari misi kerasulan Nabi Muhammad ﷺ yang bersabda: "Sesungguhnya aku diutus hanyalah untuk menyempurnakan kemuliaan akhlak."`,
      `Para ulama tazkiyatun nufus seperti Ibnu Qayyim Al-Jauziyyah dan Ibnu Qudamah Al-Maqdisi menguraikan tahapan penyucian jiwa dari noda dosa dan penyakit hati.`,
      `Penerapan nyata akhlak ini tercermin dalam kejujuran, kerendahan hati, empati sosial, dan etika berinteraksi di ruang publik maupun digital.`
    ],
    quranDalil: {
      arabic: 'وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ',
      translation: 'Dan sesungguhnya kamu benar-benar berbudi pekerti yang agung.',
      surahRef: 'QS. Al-Qalam: 4'
    },
    hadithDalil: {
      arabic: 'إِنَّمَا بُعِثْتُ لِأُتَمِّمَ صَالِحَ الْأَخْلَاقِ',
      translation: 'Sesungguhnya aku diutus hanyalah untuk menyempurnakan kemuliaan akhlak manusia.',
      source: 'Al-Adabul Mufrad karya Imam Al-Bukhari no. 273, Musnad Ahmad no. 8952',
      grade: 'Shahih',
      scholar: 'Dishahihkan oleh Al-Hakim, Adz-Dzahabi, dan Syaikh Al-Albani',
      rawi: 'Abu Hurairah radhiyallahu \'anhu'
    },
    ulamaExplanation: {
      scholar: 'Imam Ibnu Qayyim Al-Jauziyyah',
      bookRef: 'Madarijus Salikin baina Manazil Iyyaka Na\'budu wa Iyyaka Nasta\'in',
      notes: `Agama ini seluruhnya adalah akhlak. Barangsiapa yang bertambah akhlak mulianya, niscaya bertambah pula kualitas agamanya.`
    },
    legalDetailsAndModernApp: [
      `Menerapkan adab bermedia sosial yang santun, menjauhi ghibah daring dan penyebaran hoaks, serta memelihara silaturahmi di dunia nyata.`,
      `Menyeimbangkan antara penguasaan ilmu syar'i dan kelembutan adab terhadap sesama muslim.`
    ],
    ikhtilafNotes: 'Para ulama sepakat atas kewajiban membersihkan hati dari sifat tercela (radza\'il) dan menghiasinya dengan sifat terpuji (fadha\'il).',
    conclusion: `Akhlak mulia adalah buah termanis dari pohon aqidah tauhid yang menghujam kuat ke dalam dada.`,
    furtherReading: ['Mukhtashar Minhajul Qashidin', 'Al-Wabilush Shayyib minal Kalimit Thayyib'],
    quiz: {
      question: `Apakah tujuan utama diutusnya Rasulullah ﷺ menurut sabda beliau yang diriwayatkan dalam Al-Adabul Mufrad?`,
      options: [
        'Menyempurnakan kemuliaan akhlak manusia',
        'Membangun istana megah',
        'Mencari kedudukan politik duniawi',
        'Menghimpun harta kekayaan'
      ],
      correctIndex: 0,
      explanation: 'Rasulullah ﷺ menegaskan bahwa misi utama beliau adalah menyempurnakan budi pekerti yang luhur.'
    }
  };
});
