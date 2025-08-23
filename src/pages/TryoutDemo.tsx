import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, ArrowLeft } from 'lucide-react';
import TryoutPlayer from '@/components/TryoutPlayer';
import { ITryoutPackageSNBT } from '@/types/konten';
import { dummySoal } from '@/data/dummySoal';
import Navigation from '@/components/Navigation';

// Data dummy paket tryout untuk demo
const dummyPaketTryout: ITryoutPackageSNBT = {
  id: 'DEMO-001',
  judul: 'Simulasi UTBK-SNBT Demo 2024',
  deskripsi: 'Paket simulasi lengkap untuk demo TryoutPlayer',
  blocks: [
    {
      urutan: 1,
      nama_block: 'Tes Potensi Skolastik (TPS)',
      deskripsi: 'Tes kemampuan penalaran dan pemahaman umum',
      waktu_pengerjaan_menit: 5, // Shortened for demo
      soal_ids: ['PU001', 'PU002', 'PPU001', 'KMBM001', 'PK001'],
      subtests_included: ['Penalaran Umum', 'Pengetahuan & Pemahaman Umum', 'Pemahaman Bacaan & Menulis', 'Pengetahuan Kuantitatif']
    },
    {
      urutan: 2,
      nama_block: 'Literasi dalam Bahasa Indonesia dan Inggris',
      deskripsi: 'Tes kemampuan literasi bahasa Indonesia dan Inggris',
      waktu_pengerjaan_menit: 3, // Shortened for demo
      soal_ids: ['LBI001', 'LBE001', 'PPU002'],
      subtests_included: ['Literasi B. Indonesia', 'Literasi B. Inggris']
    },
    {
      urutan: 3,
      nama_block: 'Penalaran Matematika',
      deskripsi: 'Tes kemampuan penalaran matematika',
      waktu_pengerjaan_menit: 2, // Shortened for demo
      soal_ids: ['PM001', 'PK002', 'PU003'],
      subtests_included: ['Penalaran Matematika']
    }
  ],
  total_waktu: 10,
  total_soal: 11,
  tingkat_kesulitan: 'Mudah',
  kategori: 'Simulasi Lengkap',
  metadata: {
    pembuat: 'System',
    tahun_soal: 2024,
    versi: '1.0',
    tags: ['demo', 'simulasi']
  },
  published: true,
  created_at: new Date(),
  updated_at: new Date()
};

const TryoutDemo = () => {
  const [isStarted, setIsStarted] = useState(false);

  if (isStarted) {
    return (
      <div>
        <TryoutPlayer paketTryout={dummyPaketTryout} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">Demo TryoutPlayer</h1>
          <p className="text-muted-foreground">
            Halaman demo untuk menguji komponen TryoutPlayer dengan data simulasi UTBK-SNBT
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{dummyPaketTryout.judul}</CardTitle>
            <p className="text-muted-foreground">{dummyPaketTryout.deskripsi}</p>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6">
              {/* Package info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{dummyPaketTryout.blocks.length}</div>
                  <div className="text-sm text-muted-foreground">Blok Pengerjaan</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{dummyPaketTryout.total_soal}</div>
                  <div className="text-sm text-muted-foreground">Total Soal</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{dummyPaketTryout.total_waktu}</div>
                  <div className="text-sm text-muted-foreground">Menit</div>
                </div>
              </div>

              {/* Block details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Detail Blok Pengerjaan:</h3>
                {dummyPaketTryout.blocks.map((block, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">Blok {block.urutan}: {block.nama_block}</h4>
                        <p className="text-sm text-muted-foreground">
                          {block.soal_ids.length} soal • {block.waktu_pengerjaan_menit} menit
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">Subtest yang diujikan:</p>
                      <div className="flex flex-wrap gap-2">
                        {[...new Set(block.soal_ids.map(soalId => dummySoal.find(s => s.id === soalId)?.subtest).filter(Boolean))].map(subtest => (
                          <span 
                            key={subtest} 
                            className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs"
                          >
                            {subtest?.replace(/_/g, ' ').toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Instructions */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Petunjuk Demo:</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Waktu pengerjaan telah diperpendek untuk keperluan demo</li>
                  <li>• Anda dapat bernavigasi antar soal dalam satu blok</li>
                  <li>• Ketika waktu blok habis, akan otomatis pindah ke blok selanjutnya</li>
                  <li>• Gunakan tombol "Ragu-ragu" untuk menandai soal yang meragukan</li>
                  <li>• Setelah selesai, Anda akan melihat hasil sementara</li>
                </ul>
              </div>

              {/* Start button */}
              <div className="text-center pt-4">
                <Button 
                  size="lg" 
                  onClick={() => setIsStarted(true)}
                  className="px-8"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Mulai Simulasi Demo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TryoutDemo;