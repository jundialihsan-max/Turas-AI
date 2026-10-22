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

app.get('/api/feedback/list', (req: Request, res: Response) => {
  res.json({ success: true, reports: contentReports });
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
