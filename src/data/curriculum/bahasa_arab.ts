import { CurriculumTopic } from './types';

const BAHASA_ARAB_TOPIC_NAMES = [
  'Huruf hijaiyah',
  'Harakat dan pelafalan',
  'Isim, fi\'il, dan huruf',
  'Jumlah ismiyyah',
  'Jumlah fi\'liyyah',
  'Mubtada dan khabar',
  'Fa\'il dan na\'ibul fa\'il',
  'Maf\'ul bih',
  'Idhafah',
  'Na\'at dan man\'ut',
  'Athaf',
  'Taukid dan badal',
  'Kana wa akhawatuha',
  'Inna wa akhawatuha',
  'Huruf jar',
  'Zharaf zaman dan makan',
  'Hal',
  'Tamyiz',
  'Mustatsna',
  'Munada',
  'Fi\'il madhi',
  'Fi\'il mudhari\'',
  'Fi\'il amr',
  'Marfu\'atul asma\'',
  'Manshubatul asma\'',
  'Majruratul asma\'',
  'Majzumatul fi\'il',
  'Fi\'il shahih dan mu\'tal',
  'Fi\'il mujarrad dan mazid',
  'Wazan fi\'il',
  'Mashdar',
  'Isim fa\'il',
  'Isim maf\'ul',
  'Isim alat',
  'Isim zaman dan makan',
  'Isim tafdhil',
  'Fi\'il lazim dan muta\'addi',
  'Fi\'il mabni lil ma\'lum dan majhul',
  'Jumlah syarthiyyah',
  'Asma\'ul isyarah',
  'Isim maushul',
  'Dhamir',
  'Adawat istifham',
  'Nafi dan itsbat',
  'Kaidah penulisan Arab',
  'Pemahaman teks kitab gundul',
  'I\'rab ayat Al-Qur\'an',
  'Analisis gramatikal hadis',
  'Hiwar dan percakapan akademik',
  'Latihan membaca kitab Arab klasik'
];

export const BAHASA_ARAB_TOPICS: CurriculumTopic[] = BAHASA_ARAB_TOPIC_NAMES.map((name, index) => {
  const num = index + 1;
  const id = `bahasa-arab-${num < 10 ? '0' + num : num}`;

  return {
    id,
    categoryId: 'bahasa_arab',
    categoryName: 'Bahasa Arab (Nahwu & Sharaf)',
    categoryNameAr: 'اللُّغَةُ العَرَبِيَّةُ (النَّحْوُ وَالصَّرْفُ)',
    number: num,
    title: name,
    titleAr: `بَابُ ${name.toUpperCase()}`,
    objective: `Menguasai kaidah sintaksis (Nahwu) dan morfologi (Sharaf) seputar ${name.toLowerCase()} sebagai kunci memahami teks Al-Qur'an, Hadits, dan kitab kuning.`,
    linguisticDef: `An-Nahwu bermakna arah, jalan, atau semisal; Ash-Sharf bermakna perubahan bentuk asal kata untuk melahirkan aneka makna.`,
    syariDef: `Ilmu perangkat bahasa Arab yang membahas kedudukan akhir kata (i\'rab dan bina\') serta timbangan perubahan pola kata (shighat dan wazan).`,
    systematicExplanation: [
      `Materi "${name}" merupakan instrumen wajib bagi penuntut ilmu syar'i. Tanpa penguasaan kaidah ini, seseorang rawan melakukan lahn (salah baca) yang dapat mengubah makna hukum.`,
      `Imam Umar bin Al-Khattab radhiyallahu \'anhu berpesan: "Pelajarilah bahasa Arab, sesungguhnya ia adalah bagian dari agamamu."`,
      `Bab ini melatih ketajaman membaca kitab tanpa harakat (kitab gundul) dengan menganalisis amil, ma\'mul, dan tanda i\'rab secara presisi.`
    ],
    quranDalil: {
      arabic: 'إِنَّا أَنزَلْنَاهُ قُرْآنًا عَرَبِيًّا لَّعَلَّكُمْ تَعْقِلُونَ',
      translation: 'Sesungguhnya Kami menurunkannya berupa Al-Qur\'an dengan berbahasa Arab, agar kamu memahaminya.',
      surahRef: 'QS. Yusuf: 2'
    },
    hadithDalil: {
      arabic: 'أَعْرِبُوا الْقُرْآنَ كَيْمَا تَعْقِلُوهُ',
      translation: 'I\'rab-lah (jelaskan kedudukan tata bahasa) Al-Qur\'an itu agar kalian memahaminya secara mendalam.',
      source: 'Riwayat Ibnu Abi Syaibah dalam Al-Mushannaf',
      grade: 'Hasan',
      scholar: 'Atsar shahih dari para sahabat dan tabi\'in',
      rawi: 'Abdullah bin Umar radhiyallahu \'anhuma'
    },
    ulamaExplanation: {
      scholar: 'Ibnu Ajurrum rahimahullah',
      bookRef: 'Al-Ajurrumiyyah fi \'Ilmin Nahwi',
      notes: `Kaidah ${name.toLowerCase()} disusun secara ringkas dan padat untuk memudahkan santri pemula menapaki tangga gramatika Arab klasik.`
    },
    legalDetailsAndModernApp: [
      `Menerapkan kaidah ini saat membaca mushaf Al-Qur\'an, meneliti terjemahan, dan membaca doa harian dengan makhraj serta harakat yang benar.`,
      `Menumbuhkan rasa bangga dan cinta terhadap bahasa Al-Qur'an.`
    ],
    ikhtilafNotes: 'Perbedaan mazhab gramatika antara Mazhab Bashrah (mengutamakan qiyas dan analogi logis) dan Mazhab Kufah (mengutamakan keluasan penukilan sima\'i bangsa Arab Badui).',
    conclusion: `Bahasa Arab adalah kunci pembuka khazanah keilmuan Islam, dan menguasai ${name.toLowerCase()} adalah keniscayaan bagi penuntut ilmu.`,
    furtherReading: ['Matan Al-Ajurrumiyyah', 'Alfiyyah Ibnu Malik beserta Syarah Ibnu \'Aqil'],
    quiz: {
      question: `Apakah fungsi pokok ilmu Nahwu dalam kaitannya dengan teks bahasa Arab?`,
      options: [
        'Mengetahui kedudukan kata dan perubahan harakat akhir (i\'rab)',
        'Mengetahui silsilah para khalifah',
        'Menghitung jumlah halaman kitab',
        'Menentukan jadwal shalat'
      ],
      correctIndex: 0,
      explanation: 'Ilmu Nahwu fokus meneliti keadaan akhir setiap kata dalam kalimat bahasa Arab (marfu\', manshub, majrur, atau majzum).'
    }
  };
});
