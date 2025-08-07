import { ISoal, TSubtestSNBT } from '@/types/konten';

// Data dummy untuk bank soal SNBT
export const dummySoal: ISoal[] = [
  // Penalaran Umum
  {
    id: 'PU001',
    subtest: 'penalaran_umum',
    pertanyaan: 'Semua mahasiswa rajin belajar. Budi adalah mahasiswa. Kesimpulan yang tepat adalah...',
    pilihan_jawaban: [
      { id: 'A', teks: 'Budi rajin belajar' },
      { id: 'B', teks: 'Budi tidak rajin belajar' },
      { id: 'C', teks: 'Budi mungkin rajin belajar' },
      { id: 'D', teks: 'Tidak dapat disimpulkan' }
    ],
    jawaban_benar: 'A',
    pembahasan: 'Berdasarkan silogisme, jika semua mahasiswa rajin belajar dan Budi adalah mahasiswa, maka Budi pasti rajin belajar.',
    tingkat_kesulitan: 'mudah',
    estimasi_waktu_detik: 90,
    tags: ['logika', 'silogisme']
  },
  {
    id: 'PU002',
    subtest: 'penalaran_umum',
    pertanyaan: 'Dalam sebuah kompetisi, jika A lebih cepat dari B, dan B lebih cepat dari C, maka...',
    pilihan_jawaban: [
      { id: 'A', teks: 'A lebih cepat dari C' },
      { id: 'B', teks: 'C lebih cepat dari A' },
      { id: 'C', teks: 'A sama cepat dengan C' },
      { id: 'D', teks: 'Tidak dapat ditentukan' }
    ],
    jawaban_benar: 'A',
    pembahasan: 'Ini adalah contoh hubungan transitif. Jika A > B dan B > C, maka A > C.',
    tingkat_kesulitan: 'mudah',
    estimasi_waktu_detik: 75,
    tags: ['logika', 'perbandingan']
  },
  {
    id: 'PU003',
    subtest: 'penalaran_umum',
    pertanyaan: 'Sebuah pola: 2, 6, 12, 20, 30, ... Angka selanjutnya adalah...',
    pilihan_jawaban: [
      { id: 'A', teks: '40' },
      { id: 'B', teks: '42' },
      { id: 'C', teks: '44' },
      { id: 'D', teks: '46' }
    ],
    jawaban_benar: 'B',
    pembahasan: 'Pola: n(n+1) dimana n = 1,2,3,4,5,6... Untuk n=6: 6×7 = 42',
    tingkat_kesulitan: 'sedang',
    estimasi_waktu_detik: 120,
    tags: ['pola', 'matematika']
  },

  // Pengetahuan dan Pemahaman Umum
  {
    id: 'PPU001',
    subtest: 'pengetahuan_pemahaman_umum',
    pertanyaan: 'Pancasila sebagai dasar negara Indonesia ditetapkan pada tanggal...',
    pilihan_jawaban: [
      { id: 'A', teks: '17 Agustus 1945' },
      { id: 'B', teks: '18 Agustus 1945' },
      { id: 'C', teks: '1 Juni 1945' },
      { id: 'D', teks: '22 Juni 1945' }
    ],
    jawaban_benar: 'B',
    pembahasan: 'Pancasila ditetapkan sebagai dasar negara pada 18 Agustus 1945 dalam sidang PPKI.',
    tingkat_kesulitan: 'mudah',
    estimasi_waktu_detik: 60,
    tags: ['sejarah', 'pancasila']
  },
  {
    id: 'PPU002',
    subtest: 'pengetahuan_pemahaman_umum',
    pertanyaan: 'Proses fotosintesis pada tumbuhan menghasilkan...',
    pilihan_jawaban: [
      { id: 'A', teks: 'Karbon dioksida dan air' },
      { id: 'B', teks: 'Oksigen dan glukosa' },
      { id: 'C', teks: 'Nitrogen dan protein' },
      { id: 'D', teks: 'Hidrogen dan karbohidrat' }
    ],
    jawaban_benar: 'B',
    pembahasan: 'Fotosintesis mengubah CO2 dan H2O menjadi glukosa (C6H12O6) dan oksigen (O2) dengan bantuan sinar matahari.',
    tingkat_kesulitan: 'mudah',
    estimasi_waktu_detik: 75,
    tags: ['biologi', 'fotosintesis']
  },

  // Kemampuan Memahami Bacaan dan Menulis
  {
    id: 'KMBM001',
    subtest: 'kemampuan_memahami_bacaan_menulis',
    pertanyaan: 'Bacalah paragraf berikut!\n\n"Teknologi artificial intelligence (AI) semakin berkembang pesat. Namun, perkembangan ini juga menimbulkan kekhawatiran tentang masa depan pekerjaan manusia. Banyak ahli berpendapat bahwa AI akan menggantikan berbagai profesi."\n\nIde pokok paragraf tersebut adalah...',
    pilihan_jawaban: [
      { id: 'A', teks: 'Teknologi AI berkembang sangat pesat' },
      { id: 'B', teks: 'AI menimbulkan kekhawatiran tentang pekerjaan' },
      { id: 'C', teks: 'Perkembangan AI dan dampaknya terhadap pekerjaan' },
      { id: 'D', teks: 'Ahli berpendapat AI akan menggantikan profesi' }
    ],
    jawaban_benar: 'C',
    pembahasan: 'Ide pokok mencakup keseluruhan isi paragraf: perkembangan AI yang pesat dan dampaknya terhadap kekhawatiran tentang masa depan pekerjaan.',
    tingkat_kesulitan: 'sedang',
    estimasi_waktu_detik: 150,
    tags: ['membaca', 'ide_pokok']
  },

  // Pengetahuan Kuantitatif
  {
    id: 'PK001',
    subtest: 'pengetahuan_kuantitatif',
    pertanyaan: 'Jika 2x + 3y = 12 dan x - y = 1, maka nilai x + y adalah...',
    pilihan_jawaban: [
      { id: 'A', teks: '3' },
      { id: 'B', teks: '4' },
      { id: 'C', teks: '5' },
      { id: 'D', teks: '6' }
    ],
    jawaban_benar: 'C',
    pembahasan: 'Dari x - y = 1, maka x = y + 1. Substitusi ke persamaan pertama: 2(y+1) + 3y = 12, sehingga 5y = 10, y = 2, x = 3. Jadi x + y = 5.',
    tingkat_kesulitan: 'sedang',
    estimasi_waktu_detik: 180,
    tags: ['aljabar', 'sistem_persamaan']
  },
  {
    id: 'PK002',
    subtest: 'pengetahuan_kuantitatif',
    pertanyaan: 'Luas segitiga dengan alas 8 cm dan tinggi 6 cm adalah...',
    pilihan_jawaban: [
      { id: 'A', teks: '24 cm²' },
      { id: 'B', teks: '28 cm²' },
      { id: 'C', teks: '32 cm²' },
      { id: 'D', teks: '48 cm²' }
    ],
    jawaban_benar: 'A',
    pembahasan: 'Luas segitiga = ½ × alas × tinggi = ½ × 8 × 6 = 24 cm²',
    tingkat_kesulitan: 'mudah',
    estimasi_waktu_detik: 90,
    tags: ['geometri', 'luas']
  },

  // Literasi dalam Bahasa Indonesia
  {
    id: 'LBI001',
    subtest: 'literasi_bahasa_indonesia',
    pertanyaan: 'Kalimat yang menggunakan kata baku adalah...',
    pilihan_jawaban: [
      { id: 'A', teks: 'Dia merubah jadwal rapat' },
      { id: 'B', teks: 'Dia mengubah jadwal rapat' },
      { id: 'C', teks: 'Dia ngerubah jadwal rapat' },
      { id: 'D', teks: 'Dia rubah jadwal rapat' }
    ],
    jawaban_benar: 'B',
    pembahasan: 'Kata baku yang benar adalah "mengubah", bukan "merubah". Awalan "me-" + "ubah" = "mengubah".',
    tingkat_kesulitan: 'mudah',
    estimasi_waktu_detik: 60,
    tags: ['bahasa', 'kata_baku']
  },

  // Literasi dalam Bahasa Inggris
  {
    id: 'LBE001',
    subtest: 'literasi_bahasa_inggris',
    pertanyaan: 'Choose the correct sentence:',
    pilihan_jawaban: [
      { id: 'A', teks: 'She have been studying for three hours' },
      { id: 'B', teks: 'She has been studying for three hours' },
      { id: 'C', teks: 'She had been studying for three hours' },
      { id: 'D', teks: 'She having been studying for three hours' }
    ],
    jawaban_benar: 'B',
    pembahasan: 'Present perfect continuous tense menggunakan "has/have + been + V-ing". Untuk subjek "she" menggunakan "has".',
    tingkat_kesulitan: 'sedang',
    estimasi_waktu_detik: 90,
    tags: ['grammar', 'tenses']
  },

  // Penalaran Matematika
  {
    id: 'PM001',
    subtest: 'penalaran_matematika',
    pertanyaan: 'Sebuah toko memberikan diskon 20% untuk pembelian di atas Rp 100.000. Jika seseorang membeli barang seharga Rp 150.000, berapa yang harus dibayar?',
    pilihan_jawaban: [
      { id: 'A', teks: 'Rp 120.000' },
      { id: 'B', teks: 'Rp 125.000' },
      { id: 'C', teks: 'Rp 130.000' },
      { id: 'D', teks: 'Rp 135.000' }
    ],
    jawaban_benar: 'A',
    pembahasan: 'Diskon 20% dari Rp 150.000 = 0.2 × 150.000 = Rp 30.000. Yang harus dibayar = 150.000 - 30.000 = Rp 120.000',
    tingkat_kesulitan: 'mudah',
    estimasi_waktu_detik: 120,
    tags: ['aritmatika', 'persentase']
  }
];

// Fungsi helper untuk mendapatkan soal berdasarkan subtest
export const getSoalBySubtest = (subtest: TSubtestSNBT): ISoal[] => {
  return dummySoal.filter(soal => soal.subtest === subtest);
};

// Fungsi helper untuk mendapatkan jumlah soal per subtest
export const getJumlahSoalPerSubtest = (): Record<TSubtestSNBT, number> => {
  const result = {} as Record<TSubtestSNBT, number>;
  
  const subtests: TSubtestSNBT[] = [
    'penalaran_umum',
    'pengetahuan_pemahaman_umum', 
    'kemampuan_memahami_bacaan_menulis',
    'pengetahuan_kuantitatif',
    'literasi_bahasa_indonesia',
    'literasi_bahasa_inggris',
    'penalaran_matematika'
  ];
  
  subtests.forEach(subtest => {
    result[subtest] = getSoalBySubtest(subtest).length;
  });
  
  return result;
};