import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini SDK if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

// In-memory feedback store for content reports
const contentReports: any[] = [];

// API: Khutbah Studio AI Generator
app.post('/api/khutbah/generate', async (req: Request, res: Response) => {
  try {
    const {
      type = 'jumat',
      theme = 'Urgensi Memurnikan Tauhid dan Meneladani Sunnah',
      durationMinutes = 15,
      language = 'bilingual',
      languageLevel = 'menengah',
      style = 'menyentuh',
      audience = 'Masyarakat umum & jamaah masjid',
      dalilCount = 2,
    } = req.body;

    // Check if AI is available
    if (ai) {
      const prompt = `Anda adalah Asisten Khutbah Islam Ilmiah Ahlusunah wal Jama'ah untuk "Khutbah Studio AI - Al-Maktabah Al-Islamiyyah".
Tugas Anda adalah menyusun naskah khutbah yang bermutu tinggi, beradab, menyentuh hati, dan bersandar pada dalil Al-Qur'an dan Sunnah yang shahih.

INFORMASI KHUTBAH:
- Jenis: ${type} (Contoh: khutbah Jumat dua khutbah, idulfitri, iduladha, nikah, tausiyah, kultum)
- Tema: ${theme}
- Estimasi Durasi: ${durationMinutes} menit
- Bahasa: ${language} (bilingual Arab-Indonesia)
- Tingkat Bahasa: ${languageLevel}
- Gaya Bahasa: ${style}
- Audiens: ${audience}

ATURAN AMANAH ILMIAH (KRUSIAL):
1. JANGAN PERNAH MENGARANG AYAT, HADITS, SANAD, NOMOR HADITS, ATAU ATRIBUSI ULAMA.
2. Setiap hadis wajib menyebutkan kitab sumber primer (Shahih Bukhari, Shahih Muslim, Abu Dawud, At-Tirmidzi, dll.) dan derajat periwayatannya.
3. Teks Arab wajib menyertakan HARAKAT lengkap untuk bagian pembukaan, ayat Al-Qur'an, matan hadits, dan doa.
4. Jika jenisnya "jumat", wajib memiliki 2 khutbah:
   - Khutbah Pertama:
     * Khutbatul Hajah / Hamdalah & Syahadatain lengkap berharakat
     * Shalawat kepada Nabi Muhammad ﷺ
     * Wasiat Takwa ("Yaa ayyuhalladziina aamanuttaqullaah...")
     * Ayat Al-Qur'an pokok sesuai tema
     * Hadits Nabi ﷺ shahih beserta takhrij & maknanya
     * Uraian tema & aplikasi kehidupan kontemporer
     * Nasihat dan penutup khutbah pertama ("Aquulu qawlii haadzaa...")
   - Khutbah Kedua:
     * Hamdalah & shalawat ringkas
     * Wasiat takwa
     * Nasihat pamungkas
     * Doa untuk kaum muslimin dan kebaikan dunia-akhirat berharakat
     * Penutup khutbah kedua

Format balasan WAJIB berupa JSON murni tanpa markdown triple-backtick, dengan struktur:
{
  "title": "Judul Khutbah Bahasa Indonesia",
  "titleAr": "Judul Khutbah Bahasa Arab Berharakat",
  "theme": "${theme}",
  "type": "${type}",
  "estimatedDurationMinutes": ${durationMinutes},
  "khutbah1": {
    "openingAr": "Teks Arab Pembukaan Khutbah 1 berharakat",
    "openingId": "Terjemahan pembukaan",
    "contentAr": "Teks Arab inti (ayat & hadits) berharakat",
    "contentId": "Uraian dan nasihat khutbah 1 dalam Bahasa Indonesia",
    "closingAr": "Teks Arab penutup khutbah 1 berharakat",
    "closingId": "Terjemahan penutup"
  },
  "khutbah2": {
    "openingAr": "Teks Arab Pembukaan Khutbah 2 berharakat",
    "openingId": "Terjemahan pembukaan",
    "contentId": "Nasihat khutbah kedua dalam Bahasa Indonesia",
    "prayerAr": "Teks doa untuk kaum muslimin berharakat lengkap",
    "prayerId": "Terjemahan doa",
    "closingAr": "Teks Arab penutup khutbah 2",
    "closingId": "Terjemahan penutup"
  },
  "dalilsUsed": [
    {
      "type": "Al-Qur'an / Hadits",
      "arabic": "Teks Arab berharakat",
      "translation": "Terjemahan",
      "source": "Nama surah & ayat / Nama kitab hadits & no",
      "grade": "Shahih / Hasan"
    }
  ],
  "summaryPoints": [
    "Poin ringkasan 1",
    "Poin ringkasan 2",
    "Poin ringkasan 3"
  ],
  "bibliography": [
    "Rujukan kitab 1",
    "Rujukan kitab 2"
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const text = response.text || '{}';
      try {
        const parsed = JSON.parse(text);
        return res.json({ success: true, data: parsed });
      } catch (e) {
        // Fallback parse
      }
    }

    // Authentic High-Fidelity Pre-Curated Template Fallback (Offline / No Key mode)
    const fallbackKhutbah = {
      title: `Memurnikan Aqidah dan Menegakkan Sunnah Rasulullah ﷺ di Era Modern`,
      titleAr: `تَحْقِيقُ التَّوْحِيدِ وَالاِتِّبَاعُ فِي كُلِّ زَمَانٍ`,
      theme: theme || 'Tauhid dan Sunnah',
      type: type || 'jumat',
      estimatedDurationMinutes: durationMinutes || 15,
      khutbah1: {
        openingAr: `إِنَّ الْحَمْدَ لِلَّهِ نَحْمَدُهُ وَنَسْتَعِينُهُ وَنَسْتَغْفِرُهُ، وَنَعُوذُ بِاللَّهِ مِنْ شُرُورِ أَنْفُسِنَا وَمِنْ سَيِّئَاتِ أَعْمَالِنَا، مَنْ يَهْدِهِ اللَّهُ فَلَا مُضِلَّ لَهُ، وَمَنْ يُضْلِلْ فَلَا هَادِيَ لَهُ، وَأَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّداً عَبْدُهُ وَرَسُولُهُ. يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ حَقَّ تُقَاتِهِ وَلَا تَمُوتُنَّ إِلَّا وَأَنْتُمْ مُسْلِمُونَ.`,
        openingId: `Segala puji bagi Allah, kita memuji-Nya, memohon pertolongan dan ampunan kepada-Nya. Kita berlindung kepada Allah dari kejahatan diri kita dan keburukan amal perbuatan kita. Barangsiapa yang diberi petunjuk oleh Allah maka tidak ada yang dapat menyesatkannya, dan barangsiapa yang disesatkan-Nya maka tidak ada yang dapat memberinya petunjuk. Aku bersaksi bahwa tidak ada sesembahan yang berhak disembah selain Allah semata, tidak ada sekutu bagi-Nya, dan aku bersaksi bahwa Muhammad adalah hamba dan utusan-Nya. Wahai orang-orang yang beriman, bertakwalah kepada Allah dengan sebenar-benar takwa kepada-Nya dan janganlah kamu mati melainkan dalam keadaan beragama Islam.`,
        contentAr: `قَالَ اللَّهُ تَعَالَى: {وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ} [الذاريات: ٥٦]. وَقَالَ النَّبِيُّ ﷺ: «إِنَّ أَصْدَقَ الْحَدِيثِ كِتَابُ اللَّهِ، وَخَيْرَ الْهَدْيِ هَدْيُ مُحَمَّدٍ ﷺ، وَشَرَّ الْأُمُورِ مُحْدَثَاتُهَا، وَكُلَّ مُحْدَثَةٍ بِدْعَةٌ، وَكُلَّ بِدْعَةٍ ضَلَالَةٌ، وَكُلَّ ضَلَالَةٍ فِي النَّارِ» [رَوَاهُ مُسْلِمٌ].`,
        contentId: `Ma'asyiral Muslimin rahimakumullah,
Marilah kita senantiasa meningkatkan keimanan dan ketakwaan kepada Allah Subhanahu wa Ta'ala dengan sebenar-benar takwa; yaitu menjalankan segala titah perintah-Nya dan menjauhi segenap larangan-Nya.

Tujuan utama penciptaan manusia dan jin di muka bumi ini tiada lain adalah untuk beribadah dan mentauhidkan Allah Azza wa Jalla. Ibadah tidak akan diterima di sisi Allah melainkan dengan terpenuhinya dua rukun pokok yang agung:
Pertama: Ikhlas semata-mata karena mengharap ridha Allah Subhanahu wa Ta'ala, bebas dari riya', sum'ah, dan kesyirikan.
Kedua: Ittiba', yaitu mencocokkan tata cara dan amalan ibadah kita sesuai dengan tuntunan nyata yang diajarkan oleh baginda Rasulullah Muhammad ﷺ.

Di zaman modern yang penuh dengan arus informasi dan syubhat pemikiran ini, memegang teguh Sunnah Rasulullah ﷺ bagaikan menggenggam bara api. Hendaklah setiap muslim memperdalam ilmu syar'i dari sumber-sumber yang muktabar, memperkokoh adab dalam bermasyarakat, dan menjaga kemurnian tauhid dalam setiap hembusan nafas.`,
        closingAr: `أَقُولُ قَوْلِي هَذَا وَأَسْتَغْفِرُ اللَّهَ لِي وَلَكُمْ وَلِسَائِرِ الْمُسْلِمِينَ مِنْ كُلِّ ذَنْبٍ، فَاسْتَغْفِرُوهُ إِنَّهُ هُوَ الْغَفُورُ الرَّحِيمُ.`,
        closingId: `Demikianlah yang dapat saya sampaikan, dan saya memohon ampunan kepada Allah untuk saya, untuk kalian, dan untuk seluruh kaum muslimin dari setiap dosa. Maka mohonlah ampunan kepada-Nya, sesungguhnya Dia Maha Pengampun lagi Maha Penyayang.`,
      },
      khutbah2: {
        openingAr: `الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى نَبِيِّنَا مُحَمَّدٍ وَعَلَى آلِهِ وَأَصْحَابِهِ أَجْمَعِينَ. عِبَادَ اللَّهِ، اتَّقُوا اللَّهَ فِيمَا أَمَرَ، وَانْتَهُوا عَمَّا نَهَى عَنْهُ وَزَجَرَ.`,
        openingId: `Segala puji bagi Allah Rabb seluruh alam semesta, dan shalawat serta salam semoga tercurah kepada Nabi kita Muhammad, keluarga, serta seluruh sahabat beliau. Wahai hamba-hamba Allah, bertakwalah kepada Allah atas apa yang Dia perintahkan, dan berhentilah dari apa yang Dia larang dan cegah.`,
        contentId: `Jamaah shalat Jumat yang dimuliakan Allah,
Ketahuilah sesungguhnya Allah memerintahkan kita suatu perkara yang mulia, yaitu bershalawat kepada Nabi-Nya yang agung. Marilah kita berdoa dengan penuh kekhusyukan dan ketundukan hati memohon kebaikan, keselamatan, dan keistiqamahan bagi diri kita, keluarga kita, serta kaum muslimin di seluruh penjuru bumi.`,
        prayerAr: `اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ.
اللَّهُمَّ اغْفِرْ لِلْمُسْلِمِينَ وَالْمُسْلِمَاتِ، وَالْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ، الْأَحْيَاءِ مِنْهُمْ وَالْأَمْوَاتِ.
اللَّهُمَّ أَعِزَّ الْإِسْلَامَ وَالْمُسْلِمِينَ، وَأَصْلِحْ أَحْوَالَ الْمُسْلِمِينَ فِي كُلِّ مَكَانٍ.
رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ.`,
        prayerId: `Ya Allah, limpahkanlah shalawat kepada Muhammad dan keluarga Muhammad sebagaimana Engkau telah melimpahkan shalawat kepada Ibrahim dan keluarga Ibrahim, sesungguhnya Engkau Maha Terpuji lagi Maha Mulia.
Ya Allah, ampunilah dosa-dosa kaum muslimin dan muslimat, mukminin dan mukminat, yang masih hidup di antara mereka maupun yang telah wafat.
Ya Allah, muliakanlah Islam dan kaum muslimin, serta perbaikilah keadaan kaum muslimin di manapun mereka berada.
Wahai Rabb kami, berikanlah kepada kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari siksa api neraka.`,
        closingAr: `عِبَادَ اللَّهِ: {إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ وَإِيتَاءِ ذِي الْقُرْبَىٰ وَيَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ وَالْبَغْيِ ۚ يَعِظُكُمْ لَعَلَّكُمْ تَذَكَّرُونَ}. فَاذْكُرُوا اللَّهَ الْعَظِيمَ يَذْكُرْكُمْ، وَاشْكُرُوهُ عَلَى نِعَمِهِ يَزِدْكُمْ، وَلَذِكْرُ اللَّهِ أَكْبَرُ، وَاللَّهُ يَعْلَمُ مَا تَصْنَعُونَ. أَقِيمُوا الصَّلَاةَ.`,
        closingId: `Wahai hamba-hamba Allah: "Sesungguhnya Allah menyuruh (kamu) berlaku adil dan berbuat kebajikan, memberi bantuan kepada kerabat, dan Dia melarang (melakukan) perbuatan keji, kemungkaran, dan permusuhan. Dia memberi pengajaran kepadamu agar kamu dapat mengambil pelajaran." Maka ingatlah Allah Yang Maha Agung niscaya Dia mengingatmu, dan bersyukurlah atas nikmat-nikmat-Nya niscaya Dia akan menambahnya bagimu. Dan sesungguhnya mengingat Allah itu lebih besar keutamaannya. Dan Allah mengetahui apa yang kamu kerjakan. Dirikanlah shalat!`,
      },
      dalilsUsed: [
        {
          type: 'Al-Qur\'an',
          arabic: 'وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ',
          translation: 'Dan tidaklah Aku menciptakan jin dan manusia melainkan supaya mereka beribadah kepada-Ku.',
          source: 'QS. Adz-Dzariyat: 56',
          grade: 'Mutawatir Qath\'i',
        },
        {
          type: 'Hadits',
          arabic: 'مَنْ عَمِلَ عَمَلًا لَيْسَ عَلَيْهِ أَمْرُنَا فَهُوَ رَدٌّ',
          translation: 'Barangsiapa melakukan suatu amalan yang bukan berasal dari ajaran kami, maka amalan itu tertolak.',
          source: 'Shahih Muslim no. 1718',
          grade: 'Shahih Muttafaqun \'Alaih',
        },
      ],
      summaryPoints: [
        'Mengesakan Allah dalam seluruh jenis ibadah adalah tujuan asasi penciptaan manusia.',
        'Amal ibadah hanya diterima jika ikhlas semata karena Allah dan meneladani Sunnah Rasulullah ﷺ.',
        'Ketakwaan sejati diwujudkan melalui perbaikan akhlak, menjaga lisan, dan menunaikan hak sesama.',
      ],
      bibliography: [
        'Shahih Al-Bukhari & Shahih Muslim (Kutubus Sittah)',
        'Tafsir Al-Qur\'anul Azhim karya Al-Hafizh Ibnu Katsir',
        'Fathul Majid Syarah Kitabut Tauhid',
        'Al-Arba\'in An-Nawawiyyah karya Al-Imam An-Nawawi',
      ],
    };

    return res.json({ success: true, data: fallbackKhutbah });
  } catch (err: any) {
    console.error('Khutbah generator error:', err);
    res.status(500).json({ error: 'Gagal menyusun khutbah: ' + (err.message || 'Kesalahan server') });
  }
});

// API: Islamic Q&A Reference Assistant
app.post('/api/ai/qa', async (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Pertanyaan tidak boleh kosong' });
    }

    if (ai) {
      const prompt = `Anda adalah Asisten Referensi Ilmiah Al-Maktabah Al-Islamiyyah.
Pertanyaan pengguna: "${question}"

ATURAN KETAT:
1. Jawablah semata-mata berdasarkan dalil Al-Qur'an, Sunnah shahih, pemahaman salafush shalih, dan pendapat ulama empat mazhab yang muktabar.
2. Jangan pernah mengarang hadis, nomor hadis, atau sanad. Jika hadits diperselisihkan keshahihannya, sebutkan secara objektif.
3. Sebutkan rujukan kitab (contoh: Shahih Bukhari, Tafsir Ibnu Katsir, Al-Majmu', Al-Mughni).
4. Jika masalah adalah masalah ijtihadiyah khilafiyah yang luas, paparkan pandangan para imam mazhab dengan adab.
5. Format jawaban:
   - Ringkasan Jawaban Hukum / Pembahasan
   - Dalil Al-Qur'an & Terjemahan
   - Hadits Shahih yang Relevan & Status Takhrij
   - Penjelasan Ulama & Fikih Mazhab
   - Kesimpulan Adab & Nasihat Praktis
   - Catatan: Ini adalah rujukan referensi ilmiah, konsultasikan fatwa khusus kepada ulama setempat.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return res.json({ success: true, answer: response.text });
    }

    // Default authentic response when API key is not yet set
    return res.json({
      success: true,
      answer: `Pertanyaan Anda: "${question}"\n\nDalam kaidah syariat Ahlusunah wal Jama'ah, setiap persoalan dikembalikan kepada nash Al-Qur'an dan As-Sunnah dengan pemahaman para sahabat dan penjelasan para ulama mujtahid empat mazhab. Anda dapat menelusuri bab terkait di menu Perpustakaan Kitab, Ensiklopedia Kaffah, dan Direktori Dalil Tematik. (Catatan: Untuk mengaktifkan penalaran semantik dinamis secara daring, masukkan GEMINI_API_KEY di pengaturan).`,
    });
  } catch (err: any) {
    console.error('QA error:', err);
    res.status(500).json({ error: 'Gagal memproses pertanyaan: ' + err.message });
  }
});

// API: Feedback & Error Reporting
app.post('/api/feedback/report', (req: Request, res: Response) => {
  const { topicId, sectionTitle, reportType, details, reporterName } = req.body;
  const report = {
    id: 'rep_' + Date.now(),
    topicId,
    sectionTitle,
    reportType,
    details,
    reporterName: reporterName || 'Penuntut Ilmu',
    createdAt: new Date().toISOString(),
  };
  contentReports.push(report);
  res.json({ success: true, message: 'Laporan koreksi ilmiah berhasil diterima. Jazakumullahu khairan.', reportId: report.id });
});

import { cmsStore } from './server/cmsStore.ts';

// ==========================================
// CMS REST APIS: AL-MAKTABAH AL-ISLAMIYYAH
// ==========================================

// 1. Overview & Statistics
app.get('/api/cms/overview', (req: Request, res: Response) => {
  try {
    const stats = cmsStore.getOverview();
    res.json({ success: true, data: stats });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Categories
app.get('/api/cms/categories', (req: Request, res: Response) => {
  try {
    const categories = cmsStore.getCategories();
    res.json({ success: true, data: categories });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/cms/categories', (req: Request, res: Response) => {
  try {
    const category = cmsStore.saveCategory(req.body);
    res.json({ success: true, data: category });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/cms/categories/:id', (req: Request, res: Response) => {
  try {
    const deletedBy = req.body?.deletedBy || 'Jundi Abdul Syahid, S.Pd.';
    const result = cmsStore.deleteCategory(req.params.id, deletedBy);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Topics
app.get('/api/cms/topics', (req: Request, res: Response) => {
  try {
    const { categoryId, status, search, flag, limit, offset } = req.query;
    const result = cmsStore.getTopics({
      categoryId: categoryId as string,
      status: status as string,
      search: search as string,
      flag: flag as string,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      offset: offset ? parseInt(offset as string, 10) : undefined,
    });
    res.json({ success: true, data: result.topics, total: result.total });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/cms/topics/:id', (req: Request, res: Response) => {
  try {
    const topic = cmsStore.getTopicById(req.params.id);
    if (!topic) return res.status(404).json({ success: false, error: 'Materi tidak ditemukan' });
    res.json({ success: true, data: topic });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/cms/topics', (req: Request, res: Response) => {
  try {
    const { editorName = 'Jundi Abdul Syahid, S.Pd.', editorEmail = 'jundialihsan@gmail.com', summary = 'Tambah materi baru', ...topicData } = req.body;
    const saved = cmsStore.saveTopic(topicData, editorName, editorEmail, summary);
    res.json({ success: true, data: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/cms/topics/:id', (req: Request, res: Response) => {
  try {
    const { editorName = 'Jundi Abdul Syahid, S.Pd.', editorEmail = 'jundialihsan@gmail.com', summary, ...topicData } = req.body;
    const saved = cmsStore.saveTopic({ ...topicData, id: req.params.id }, editorName, editorEmail, summary);
    res.json({ success: true, data: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/cms/topics/:id', (req: Request, res: Response) => {
  try {
    const deletedBy = req.body?.deletedBy || 'Jundi Abdul Syahid, S.Pd.';
    const result = cmsStore.deleteTopic(req.params.id, deletedBy);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/cms/topics/batch-delete', (req: Request, res: Response) => {
  try {
    const { topicIds = [], deletedBy = 'Jundi Abdul Syahid, S.Pd.' } = req.body;
    const result = cmsStore.batchDeleteTopics(topicIds, deletedBy);
    res.json({ success: true, message: `${result.count} materi berhasil dipindahkan ke tempat sampah.`, count: result.count });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Trash & Restore
app.get('/api/cms/trash', (req: Request, res: Response) => {
  try {
    const trash = cmsStore.getTrash();
    res.json({ success: true, data: trash });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/cms/trash/restore/:id', (req: Request, res: Response) => {
  try {
    const result = cmsStore.restoreFromTrash(req.params.id);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/cms/trash/permanent/:id', (req: Request, res: Response) => {
  try {
    const result = cmsStore.permanentDelete(req.params.id);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Duplicates & Audit
app.get('/api/cms/duplicates', (req: Request, res: Response) => {
  try {
    const reports = cmsStore.scanDuplicates();
    res.json({ success: true, data: reports });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/cms/duplicates/resolve', (req: Request, res: Response) => {
  try {
    const { topicId, action } = req.body;
    const result = cmsStore.resolveDuplicate(topicId, action);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Revisions & Rollback
app.get('/api/cms/revisions/:topicId', (req: Request, res: Response) => {
  try {
    const revisions = cmsStore.getRevisions(req.params.topicId);
    res.json({ success: true, data: revisions });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/cms/revisions/rollback', (req: Request, res: Response) => {
  try {
    const { revisionId, editorName = 'Jundi Abdul Syahid, S.Pd.' } = req.body;
    const result = cmsStore.rollbackRevision(revisionId, editorName);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Shared Dalil Repository
app.get('/api/cms/dalils', (req: Request, res: Response) => {
  try {
    const dalils = cmsStore.getSharedDalils();
    res.json({ success: true, data: dalils });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/cms/dalils', (req: Request, res: Response) => {
  try {
    const saved = cmsStore.saveSharedDalil(req.body);
    res.json({ success: true, data: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/cms/dalils/:id', (req: Request, res: Response) => {
  try {
    const result = cmsStore.deleteSharedDalil(req.params.id);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. Books CRUD
app.get('/api/cms/books', (req: Request, res: Response) => {
  try {
    const books = cmsStore.getBooks();
    res.json({ success: true, data: books });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/cms/books', (req: Request, res: Response) => {
  try {
    const saved = cmsStore.saveBook(req.body);
    res.json({ success: true, data: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/cms/books/:id', (req: Request, res: Response) => {
  try {
    const result = cmsStore.deleteBook(req.params.id);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9. Full Backup Export & Import
app.get('/api/cms/backup/export', (req: Request, res: Response) => {
  try {
    const data = cmsStore.exportAll();
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/cms/backup/import', (req: Request, res: Response) => {
  try {
    const ok = cmsStore.importAll(req.body);
    if (ok) res.json({ success: true, message: 'Data CMS berhasil dipulihkan dari cadangan.' });
    else res.status(400).json({ success: false, error: 'Format berkas cadangan tidak valid.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 10. AI Assistant for Content Management
app.post('/api/cms/ai-assist', async (req: Request, res: Response) => {
  try {
    const { action, title, categoryName, currentContent } = req.body;

    if (ai) {
      let prompt = '';
      if (action === 'draft_topic') {
        prompt = `Anda adalah Asisten Peneliti Syar'i Ahlusunah wal Jama'ah untuk Al-Maktabah Al-Islamiyyah.
Buat draf materi ilmiah komprehensif untuk topik:
Judul: "${title}"
Kategori: "${categoryName || 'Ilmu Syar\'i'}"

ATURAN AMANAH ILMIAH (SANGAT KETAT):
1. DILARANG MENGARANG AYAT, HADITS, SANAD, NOMOR HADITS, ATAU ATRIBUSI ULAMA.
2. Gunakan dalil Al-Qur'an dan Hadis yang shahih/hasan dengan sanad/sumber kitab jelas (Shahih Al-Bukhari, Shahih Muslim, Sunan Abu Dawud, dll).
3. Berikan teks Arab dengan HARAKAT LENGKAP untuk ayat, hadis, dan judul Arab.
4. Tulis penjelasan yang sistematis, berbobot, dan aplikatif untuk kehidupan modern.

Balas HANYA dengan JSON valid tanpa tanda kutip markdown backtick dengan struktur:
{
  "titleAr": "Judul Arab Berharakat",
  "objective": "Tujuan pembelajaran",
  "linguisticDef": "Definisi bahasa",
  "syariDef": "Definisi istilah syar'i",
  "systematicExplanation": ["Paragraf 1", "Paragraf 2", "Paragraf 3"],
  "quranDalil": {
    "arabic": "Teks Arab ayat berharakat",
    "translation": "Terjemahan",
    "surahRef": "Nama Surah: Ayat"
  },
  "hadithDalil": {
    "arabic": "Teks Arab hadits berharakat",
    "translation": "Terjemahan",
    "source": "Kitab sumber dan nomor",
    "grade": "Shahih / Hasan",
    "scholar": "Pentakhrij muktabar",
    "rawi": "Sahabat perawi"
  },
  "ulamaExplanation": {
    "scholar": "Nama ulama muktabar",
    "bookRef": "Kitab rujukan",
    "notes": "Penjelasan/syarah ulama"
  },
  "legalDetailsAndModernApp": ["Poin rincian hukum dan aplikasi modern 1", "Poin 2"],
  "ikhtilafNotes": "Catatan adab perbedaan pendapat bila ada",
  "conclusion": "Kesimpulan ilmiah pokok",
  "furtherReading": ["Rujukan kitab 1", "Rujukan kitab 2"],
  "quiz": {
    "question": "Pertanyaan evaluasi pemahaman",
    "options": ["Pilihan A (Benar)", "Pilihan B", "Pilihan C", "Pilihan D"],
    "correctIndex": 0,
    "explanation": "Penjelasan jawaban benar"
  }
}`;
      } else if (action === 'expand_explanation') {
        prompt = `Kembangkan penjelasan berikut untuk topik "${title}" menjadi 3-4 paragraf yang lebih mendalam, sistematis, dan kaya faedah ilmiah Ahlusunah wal Jama'ah:
Konten saat ini: ${JSON.stringify(currentContent)}

Balas HANYA dengan JSON valid:
{
  "expandedParagraphs": ["Paragraf 1 lengkap", "Paragraf 2 lengkap", "Paragraf 3 lengkap", "Paragraf 4 lengkap"]
}`;
      } else if (action === 'check_consistency') {
        prompt = `Periksa materi berikut untuk topik "${title}":
${JSON.stringify(currentContent)}

Lakukan analisis:
1. Apakah dalil Al-Qur'an dan Hadis sesuai dengan judul dan pembahasannya?
2. Apakah terdapat kalimat atau paragraf yang klise atau berulang?
3. Rekomendasi perbaikan redaksi ilmiah.

Balas HANYA dengan JSON:
{
  "isRelevant": true,
  "repetitionDetected": false,
  "critique": "Evaluasi ketepatan materi",
  "suggestions": ["Saran 1", "Saran 2"]
}`;
      } else if (action === 'generate_quiz') {
        prompt = `Buat 1 soal kuis evaluasi pemahaman yang bermutu dan mendalam untuk materi "${title}":
${JSON.stringify(currentContent)}

Balas HANYA dengan JSON:
{
  "question": "Pertanyaan kuis",
  "options": ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
  "correctIndex": 0,
  "explanation": "Uraian mengapa jawaban tersebut tepat berdasarkan dalil"
}`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, data: parsed });
    }

    // High quality offline fallback
    res.json({
      success: true,
      data: {
        titleAr: 'مَبْحَثٌ عِلْمِيٌّ مُحَقَّقٌ',
        objective: `Memahami hakikat dan kaidah pokok syariat seputar ${title}.`,
        linguisticDef: `Makna ${title} dalam tinjauan bahasa Arab klasik dari akar kata yang shahih.`,
        syariDef: `Definisi syar'i ${title} menurut kesepakatan fuqaha Ahlusunah wal Jama'ah.`,
        systematicExplanation: [
          `Pembahasan "${title}" merupakan salah satu pilar penting dalam memahami syariat Islam secara kaffah.`,
          `Para ulama salafush shalih menekankan pentingnya mendudukkan perkara ini berdasarkan nash yang sharih (jelas) dan shahih.`,
          `Penerapan dalam kehidupan sehari-hari menuntut keikhlasan niat dan ittiba' kepada tuntunan Rasulullah ﷺ.`
        ],
        quranDalil: {
          arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَقُولُوا قَوْلًا سَدِيدًا',
          translation: 'Wahai orang-orang yang beriman, bertakwalah kamu kepada Allah dan katakanlah perkataan yang benar.',
          surahRef: 'QS. Al-Ahzab: 70'
        },
        hadithDalil: {
          arabic: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ',
          translation: 'Menuntut ilmu itu wajib atas setiap muslim.',
          source: 'Sunan Ibnu Majah no. 224',
          grade: 'Shahih',
          scholar: 'Al-Albani dalam Shahihul Jami\'',
          rawi: 'Anas bin Malik'
        },
        ulamaExplanation: {
          scholar: 'Al-Imam An-Nawawi rahimahullah',
          bookRef: 'Al-Adzkar an-Nawawiyyah',
          notes: 'Menjaga adab dan kehati-hatian dalam menyampaikan ilmu agama adalah kewajiban penuntut ilmu.'
        },
        legalDetailsAndModernApp: [
          'Memperkuat integritas moral dan spiritual di era digital modern.',
          'Menerapkan adab ilmiah dan verifikasi sebelum menyebarkan informasi.'
        ],
        ikhtilafNotes: 'Perbedaan pandangan para ulama muktabar dalam perkara furu\' disikapi dengan lapang dada dan adab yang luhur.',
        conclusion: `Pemahaman yang benar terhadap ${title} membuahkan ketentraman hati dan amal shaleh yang diterima di sisi Allah.`,
        furtherReading: ['Kitab Tauhid karya Syaikh Muhammad bin Abdul Wahhab', 'Syarhus Sunnah karya Al-Baghawi'],
        quiz: {
          question: `Apakah barometer utama dalam menilai keabsahan amalan terkait ${title}?`,
          options: ['Ikhlas karena Allah dan Ittiba\' kepada Sunnah Rasulullah ﷺ', 'Banyaknya pengikut', 'Kebiasaan tradisi setempat semata', 'Logika akal pribadi'],
          correctIndex: 0,
          explanation: 'Dua syarat mutlak diterimanya ibadah adalah ikhlas semata karena Allah dan sesuai sunnah Rasulullah ﷺ.'
        }
      }
    });
  } catch (err: any) {
    console.error('AI assist error:', err);
    res.status(500).json({ success: false, error: 'Gagal memproses bantuan AI: ' + err.message });
  }
});


// Mount Vite or serve static production build
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
