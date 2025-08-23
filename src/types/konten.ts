/**
 * Types dan Interfaces untuk Platform Simulasi UTBK-SNBT
 * Dirancang untuk meniru struktur ujian UTBK yang sesungguhnya
 * dengan sistem blok pengerjaan yang terpisah
 */

// 1. Tipe Dasar untuk 7 Subtes Resmi UTBK-SNBT
export type TSubtestSNBT = 
  | 'Penalaran Umum' 
  | 'Pengetahuan & Pemahaman Umum' 
  | 'Pemahaman Bacaan & Menulis' 
  | 'Pengetahuan Kuantitatif' 
  | 'Literasi B. Indonesia' 
  | 'Literasi B. Inggris' 
  | 'Penalaran Matematika';

// 2. Interface untuk Bank Soal dengan fokus kualitas HOTS
export interface ISoal {
  id: string; // Contoh: 'PK201-HOTS'
  subtest: TSubtestSNBT;
  pertanyaan: string;
  pilihan_jawaban: {
    A: string;
    B: string;
    C: string;
    D: string;
    E: string;
  };
  jawaban_benar: 'A' | 'B' | 'C' | 'D' | 'E';
  pembahasan: string;
  tingkat_kesulitan: 'Mudah' | 'Sedang' | 'Sulit' | 'HOTS';
  kategori_kognitif: 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6'; // Taksonomi Bloom
  waktu_pengerjaan_detik: number; // Estimasi waktu ideal
  tags: string[]; // Tag untuk kategorisasi lebih detail
  created_at: Date;
  updated_at: Date;
}

// 3. Interface untuk Materi Belajar
export interface IMateri {
  id: string;
  subtest: TSubtestSNBT;
  judul: string;
  deskripsi: string;
  konten: {
    teori: string;
    contoh_soal: ISoal[];
    tips_strategi: string[];
    video_url?: string;
  };
  urutan: number;
  estimasi_waktu_belajar: number; // dalam menit
  prerequisite_materi?: string[]; // ID materi yang harus dipelajari dulu
  published: boolean;
  created_at: Date;
  updated_at: Date;
}

// 4. Interface untuk Study Journey
export interface IStudyJourney {
  id: string;
  user_id: string;
  target_skor: {
    [key in TSubtestSNBT]: number;
  };
  jadwal_belajar: {
    hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu';
    subtest: TSubtestSNBT;
    materi_ids: string[];
    durasi_menit: number;
  }[];
  progress: {
    materi_selesai: string[];
    tryout_selesai: string[];
    skor_terakhir: {
      [key in TSubtestSNBT]: number;
    };
  };
  created_at: Date;
  updated_at: Date;
}

// 5. [PERUBAHAN BESAR] Interface untuk Blok Pengerjaan Try Out
// UTBK terdiri dari beberapa blok waktu, ini definisinya
export interface ITryoutBlock {
  urutan: number;
  nama_block: string; // Contoh: 'Tes Potensi Skolastik (TPS)'
  deskripsi: string; // Penjelasan singkat tentang blok ini
  waktu_pengerjaan_menit: number; // Waktu spesifik untuk blok ini
  soal_ids: string[]; // Kumpulan ID soal untuk blok ini
  instruksi_khusus?: string; // Instruksi khusus untuk blok ini
  break_setelah_blok?: number; // Waktu istirahat setelah blok (dalam menit)
  subtests_included: TSubtestSNBT[]; // Subtest yang ada dalam blok ini
}

// 6. [PERUBAHAN BESAR] Interface untuk Paket Try Out Lengkap
// Ini adalah paket utuh yang terdiri dari beberapa blok
export interface ITryoutPackageSNBT {
  id: string; // Contoh: 'SNBT-SIM-01'
  judul: string; // Contoh: 'Simulasi UTBK-SNBT Premium #1'
  deskripsi: string;
  total_waktu: number; // Akumulasi waktu dari semua blok
  total_soal: number; // Total jumlah soal dalam paket
  blocks: ITryoutBlock[]; // Paket Try Out sekarang terdiri dari beberapa Blok
  tingkat_kesulitan: 'Mudah' | 'Sedang' | 'Sulit' | 'Campuran';
  kategori: 'Simulasi Lengkap' | 'Latihan Subtest' | 'Try Out Khusus';
  metadata: {
    pembuat: string;
    tahun_soal: number;
    versi: string;
    tags: string[];
  };
  statistik?: {
    jumlah_peserta: number;
    rata_rata_skor: number;
    skor_tertinggi: number;
    skor_terendah: number;
  };
  published: boolean;
  jadwal_tersedia?: {
    mulai: Date;
    selesai: Date;
  };
  created_at: Date;
  updated_at: Date;
}

// 7. Interface untuk Hasil Try Out per Blok
export interface IHasilTryoutBlock {
  block_id: string;
  nama_block: string;
  waktu_mulai: Date;
  waktu_selesai: Date;
  durasi_pengerjaan: number; // dalam detik
  jawaban_user: {
    soal_id: string;
    jawaban: 'A' | 'B' | 'C' | 'D' | 'E' | null;
    waktu_jawab: number; // waktu yang digunakan untuk menjawab (detik)
    ragu_ragu: boolean;
  }[];
  skor_per_subtest: {
    [key in TSubtestSNBT]?: {
      benar: number;
      salah: number;
      kosong: number;
      skor: number;
    };
  };
}

// 8. Interface untuk Hasil Try Out Lengkap
export interface IHasilTryoutLengkap {
  id: string;
  user_id: string;
  tryout_package_id: string;
  waktu_mulai: Date;
  waktu_selesai: Date;
  status: 'Sedang Dikerjakan' | 'Selesai' | 'Dibatalkan' | 'Timeout';
  hasil_per_block: IHasilTryoutBlock[];
  skor_total: number;
  skor_per_subtest: {
    [key in TSubtestSNBT]: {
      benar: number;
      salah: number;
      kosong: number;
      skor: number;
      persentil: number;
    };
  };
  ranking: {
    posisi: number;
    dari_total: number;
    persentil: number;
  };
  analisis: {
    kekuatan: TSubtestSNBT[];
    kelemahan: TSubtestSNBT[];
    rekomendasi: string[];
  };
  created_at: Date;
  updated_at: Date;
}

// 9. Interface untuk Sesi Try Out (untuk tracking real-time)
export interface ISesiTryout {
  id: string;
  user_id: string;
  tryout_package_id: string;
  block_aktif: number; // Index blok yang sedang dikerjakan
  soal_aktif: number; // Index soal dalam blok yang sedang dikerjakan
  waktu_mulai_sesi: Date;
  waktu_mulai_block: Date;
  jawaban_sementara: {
    [soal_id: string]: {
      jawaban: 'A' | 'B' | 'C' | 'D' | 'E' | null;
      ragu_ragu: boolean;
      waktu_jawab: number;
    };
  };
  status: 'Menunggu' | 'Sedang Mengerjakan' | 'Istirahat' | 'Selesai';
  break_hingga?: Date; // Waktu berakhirnya istirahat
  created_at: Date;
  updated_at: Date;
}

// 10. Utility Types
export type TKategoriSoal = 'HOTS' | 'MOTS' | 'LOTS';
export type TStatusTryout = 'Draft' | 'Published' | 'Archived';
export type TJenisTryout = 'Gratis' | 'Premium' | 'Berbayar';

// 11. Interface untuk Konfigurasi Sistem
export interface IKonfigurasiSistem {
  waktu_default_per_soal: number; // dalam detik
  waktu_istirahat_antar_blok: number; // dalam menit
  batas_waktu_toleransi: number; // toleransi waktu tambahan dalam detik
  auto_submit: boolean; // otomatis submit ketika waktu habis
  allow_review: boolean; // izinkan review jawaban dalam blok
  shuffle_soal: boolean; // acak urutan soal
  shuffle_pilihan: boolean; // acak urutan pilihan jawaban
}

// Types are exported individually above, no need for default export