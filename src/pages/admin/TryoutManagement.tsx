import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Plus, 
  Trash2, 
  Search, 
  Filter,
  Clock,
  FileText,
  Save,
  Eye,
  Settings
} from "lucide-react";
import AdminNavigation from "@/components/AdminNavigation";
import { ITryoutPackageSNBT, ITryoutBlock, ISoal, TSubtestSNBT } from "@/types/konten";
import { dummySoal, getSoalBySubtest, getJumlahSoalPerSubtest } from '@/data/dummySoal';

// Data bank soal dari file dummy
const mockBankSoal: ISoal[] = dummySoal;

const subtestOptions: TSubtestSNBT[] = [
  "Penalaran Umum",
  "Pengetahuan & Pemahaman Umum",
  "Pemahaman Bacaan & Menulis",
  "Pengetahuan Kuantitatif",
  "Literasi B. Indonesia",
  "Literasi B. Inggris",
  "Penalaran Matematika"
];

interface BlockFormData extends Omit<ITryoutBlock, 'soal_ids' | 'subtests_included'> {
  soal_ids: string[];
  subtests_included: TSubtestSNBT[];
}

const TryoutManagement = () => {
  // State untuk form paket utama
  const [packageForm, setPackageForm] = useState({
    id: "",
    judul: "",
    deskripsi: "",
    tingkat_kesulitan: "Campuran" as const
  });

  // State untuk blok-blok
  const [blocks, setBlocks] = useState<BlockFormData[]>([]);

  // State untuk modal pemilihan soal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBlockIndex, setCurrentBlockIndex] = useState<number | null>(null);
  const [selectedSoals, setSelectedSoals] = useState<string[]>([]);
  const [filterSubtest, setFilterSubtest] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter soal berdasarkan subtest dan search
  const filteredSoals = mockBankSoal.filter(soal => {
    const matchSubtest = filterSubtest === "all" || soal.subtest === filterSubtest;
    const matchSearch = soal.pertanyaan.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       soal.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSubtest && matchSearch;
  });

  // Statistik soal per subtest
  const jumlahSoalPerSubtest = getJumlahSoalPerSubtest();

  // Fungsi untuk menambah blok baru
  const addNewBlock = () => {
    const newBlock: BlockFormData = {
      urutan: blocks.length + 1,
      nama_block: "",
      deskripsi: "",
      waktu_pengerjaan_menit: 0,
      soal_ids: [],
      instruksi_khusus: "",
      break_setelah_blok: 0,
      subtests_included: []
    };
    setBlocks([...blocks, newBlock]);
  };

  // Fungsi untuk menghapus blok
  const removeBlock = (index: number) => {
    const updatedBlocks = blocks.filter((_, i) => i !== index);
    // Update urutan blok
    const reorderedBlocks = updatedBlocks.map((block, i) => ({
      ...block,
      urutan: i + 1
    }));
    setBlocks(reorderedBlocks);
  };

  // Fungsi untuk update data blok
  const updateBlock = (index: number, field: keyof BlockFormData, value: any) => {
    const updatedBlocks = [...blocks];
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      [field]: value
    };
    setBlocks(updatedBlocks);
  };

  // Fungsi untuk membuka modal pemilihan soal
  const openSoalModal = (blockIndex: number) => {
    setCurrentBlockIndex(blockIndex);
    setSelectedSoals(blocks[blockIndex].soal_ids);
    setIsModalOpen(true);
  };

  // Fungsi untuk menyimpan pilihan soal
  const saveSoalSelection = () => {
    if (currentBlockIndex !== null) {
      const selectedSoalObjects = mockBankSoal.filter(soal => selectedSoals.includes(soal.id));
      const subtestsIncluded = [...new Set(selectedSoalObjects.map(soal => soal.subtest))] as TSubtestSNBT[];
      
      updateBlock(currentBlockIndex, 'soal_ids', selectedSoals);
      updateBlock(currentBlockIndex, 'subtests_included', subtestsIncluded);
    }
    setIsModalOpen(false);
    setCurrentBlockIndex(null);
  };

  // Fungsi untuk toggle pilihan soal
  const toggleSoalSelection = (soalId: string) => {
    setSelectedSoals(prev => 
      prev.includes(soalId) 
        ? prev.filter(id => id !== soalId)
        : [...prev, soalId]
    );
  };

  // Fungsi untuk menyimpan paket try out
  const savePackage = () => {
    // Validasi form
    if (!packageForm.id || !packageForm.judul) {
      alert("ID dan Judul paket harus diisi!");
      return;
    }

    if (blocks.length === 0) {
      alert("Minimal harus ada satu blok pengerjaan!");
      return;
    }

    // Validasi setiap blok
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      if (!block.nama_block || block.waktu_pengerjaan_menit <= 0) {
        alert(`Blok ${i + 1}: Nama blok dan waktu pengerjaan harus diisi dengan benar!`);
        return;
      }
      if (block.soal_ids.length === 0) {
        alert(`Blok ${i + 1}: Harus memilih minimal satu soal!`);
        return;
      }
    }

    // Buat objek ITryoutPackageSNBT
    const totalWaktu = blocks.reduce((sum, block) => sum + block.waktu_pengerjaan_menit, 0);
    const totalSoal = blocks.reduce((sum, block) => sum + block.soal_ids.length, 0);

    const tryoutPackage: ITryoutPackageSNBT = {
      id: packageForm.id,
      judul: packageForm.judul,
      deskripsi: packageForm.deskripsi,
      total_waktu: totalWaktu,
      total_soal: totalSoal,
      blocks: blocks.map(block => ({
        urutan: block.urutan,
        nama_block: block.nama_block,
        deskripsi: block.deskripsi,
        waktu_pengerjaan_menit: block.waktu_pengerjaan_menit,
        soal_ids: block.soal_ids,
        instruksi_khusus: block.instruksi_khusus,
        break_setelah_blok: block.break_setelah_blok,
        subtests_included: block.subtests_included
      })),
      tingkat_kesulitan: packageForm.tingkat_kesulitan,
      kategori: "Simulasi Lengkap",
      metadata: {
        pembuat: "Admin",
        tahun_soal: new Date().getFullYear(),
        versi: "1.0",
        tags: ["simulasi", "utbk", "snbt"]
      },
      published: false,
      created_at: new Date(),
      updated_at: new Date()
    };

    console.log("Paket Try Out SNBT berhasil dibuat:", tryoutPackage);
    alert("Paket Try Out berhasil disimpan! Lihat console untuk detail struktur data.");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manajemen Try Out SNBT</h1>
          <p className="text-gray-600">Buat dan kelola paket simulasi UTBK-SNBT dengan sistem blok pengerjaan</p>
        </div>

        {/* Form Paket Utama */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Informasi Paket Try Out
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="package-id">ID Paket *</Label>
                <Input
                  id="package-id"
                  placeholder="Contoh: SNBT-SIM-01"
                  value={packageForm.id}
                  onChange={(e) => setPackageForm(prev => ({ ...prev, id: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="package-title">Judul Paket *</Label>
                <Input
                  id="package-title"
                  placeholder="Contoh: Simulasi UTBK-SNBT Premium #1"
                  value={packageForm.judul}
                  onChange={(e) => setPackageForm(prev => ({ ...prev, judul: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="package-description">Deskripsi</Label>
              <Textarea
                id="package-description"
                placeholder="Deskripsi singkat tentang paket try out ini..."
                value={packageForm.deskripsi}
                onChange={(e) => setPackageForm(prev => ({ ...prev, deskripsi: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="difficulty">Tingkat Kesulitan</Label>
              <Select value={packageForm.tingkat_kesulitan} onValueChange={(value: any) => setPackageForm(prev => ({ ...prev, tingkat_kesulitan: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mudah">Mudah</SelectItem>
                  <SelectItem value="Sedang">Sedang</SelectItem>
                  <SelectItem value="Sulit">Sulit</SelectItem>
                  <SelectItem value="Campuran">Campuran</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Builder untuk Blok */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Blok Pengerjaan ({blocks.length})
              </div>
              <Button onClick={addNewBlock} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Tambah Blok Pengerjaan
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {blocks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Belum ada blok pengerjaan. Klik "Tambah Blok Pengerjaan" untuk memulai.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {blocks.map((block, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-lg">
                        <span>Blok {block.urutan}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeBlock(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Urutan Blok</Label>
                          <Input
                            type="number"
                            value={block.urutan}
                            onChange={(e) => updateBlock(index, 'urutan', parseInt(e.target.value) || 1)}
                            min="1"
                          />
                        </div>
                        <div>
                          <Label>Nama Blok *</Label>
                          <Input
                            placeholder="Contoh: TPS atau Literasi & Penalaran Matematika"
                            value={block.nama_block}
                            onChange={(e) => updateBlock(index, 'nama_block', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Waktu Pengerjaan (menit) *</Label>
                          <Input
                            type="number"
                            value={block.waktu_pengerjaan_menit}
                            onChange={(e) => updateBlock(index, 'waktu_pengerjaan_menit', parseInt(e.target.value) || 0)}
                            min="1"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label>Deskripsi Blok</Label>
                        <Textarea
                          placeholder="Deskripsi singkat tentang blok ini..."
                          value={block.deskripsi}
                          onChange={(e) => updateBlock(index, 'deskripsi', e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Instruksi Khusus</Label>
                          <Textarea
                            placeholder="Instruksi khusus untuk blok ini..."
                            value={block.instruksi_khusus}
                            onChange={(e) => updateBlock(index, 'instruksi_khusus', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Waktu Istirahat Setelah Blok (menit)</Label>
                          <Input
                            type="number"
                            value={block.break_setelah_blok}
                            onChange={(e) => updateBlock(index, 'break_setelah_blok', parseInt(e.target.value) || 0)}
                            min="0"
                          />
                        </div>
                      </div>

                      {/* Pemilihan Soal */}
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-medium">Soal dalam Blok</h4>
                            <p className="text-sm text-gray-600">
                              {block.soal_ids.length} soal dipilih
                              {block.subtests_included.length > 0 && (
                                <span className="ml-2">
                                  • Subtest: {block.subtests_included.join(", ")}
                                </span>
                              )}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => openSoalModal(index)}
                            className="flex items-center gap-2"
                          >
                            <Search className="h-4 w-4" />
                            Pilih Soal
                          </Button>
                        </div>
                        
                        {block.soal_ids.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {block.soal_ids.map(soalId => {
                              const soal = mockBankSoal.find(s => s.id === soalId);
                              return soal ? (
                                <Badge key={soalId} variant="secondary" className="text-xs">
                                  {soal.id} - {soal.subtest}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ringkasan dan Tombol Simpan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Ringkasan Paket
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{blocks.length}</div>
                <div className="text-sm text-gray-600">Total Blok</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {blocks.reduce((sum, block) => sum + block.soal_ids.length, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Soal</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 flex items-center justify-center gap-1">
                  <Clock className="h-5 w-5" />
                  {blocks.reduce((sum, block) => sum + block.waktu_pengerjaan_menit, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Waktu (menit)</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {blocks.reduce((sum, block) => sum + (block.break_setelah_blok || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Total Istirahat (menit)</div>
              </div>
            </div>
            
            <Button 
              onClick={savePackage} 
              className="w-full flex items-center justify-center gap-2"
              size="lg"
            >
              <Save className="h-5 w-5" />
              Simpan Paket Try Out
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Modal Pemilihan Soal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Pilih Soal untuk Blok {currentBlockIndex !== null ? blocks[currentBlockIndex]?.urutan : ''}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Filter dan Search */}
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Cari soal berdasarkan ID atau pertanyaan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={filterSubtest} onValueChange={setFilterSubtest}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Filter Subtest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Subtest</SelectItem>
                  {subtestOptions.map(subtest => (
                    <SelectItem key={subtest} value={subtest}>{subtest}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Counter */}
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium">
                {selectedSoals.length} soal dipilih dari {filteredSoals.length} soal tersedia
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedSoals([])}
                >
                  Hapus Semua
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedSoals(filteredSoals.map(s => s.id))}
                >
                  Pilih Semua
                </Button>
              </div>
            </div>

            {/* Tabel Soal */}
            <div className="border rounded-lg overflow-hidden max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Pilih</TableHead>
                    <TableHead>ID Soal</TableHead>
                    <TableHead>Subtest</TableHead>
                    <TableHead>Pertanyaan</TableHead>
                    <TableHead>Kesulitan</TableHead>
                    <TableHead>Waktu (detik)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSoals.map(soal => (
                    <TableRow key={soal.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedSoals.includes(soal.id)}
                          onCheckedChange={() => toggleSoalSelection(soal.id)}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-sm">{soal.id}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {soal.subtest}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-md truncate">{soal.pertanyaan}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={soal.tingkat_kesulitan === 'HOTS' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {soal.tingkat_kesulitan}
                        </Badge>
                      </TableCell>
                      <TableCell>{soal.waktu_pengerjaan_detik}s</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Tombol Aksi */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Batal
              </Button>
              <Button onClick={saveSoalSelection}>
                Simpan Pilihan ({selectedSoals.length} soal)
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TryoutManagement;