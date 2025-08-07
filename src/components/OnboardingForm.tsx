import React, { useState } from 'react';
import { X, User, MapPin, School, Trophy } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface OnboardingFormProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  onComplete: () => void;
}

interface OnboardingData {
  displayName: string;
  asalDaerah: string;
  asalSMA: string;
  ptnImpian: string;
}

const universitas = [
  'Institut Pertanian Bogor',
  'Institut Seni Budaya Indonesia (ISBI) Aceh',
  'Institut Seni Budaya Indonesia (ISBI) Bandung',
  'Institut Seni Budaya Indonesia (ISBI) Tanah Papua',
  'Institut Seni Indonesia (ISI) Denpasar',
  'Institut Seni Indonesia (ISI) Padang Panjang',
  'Institut Seni Indonesia (ISI) Surakarta',
  'Institut Seni Indonesia (ISI) Yogyakarta',
  'Institut Teknologi Bandung',
  'Institut Teknologi BJ. Habibie Sulawesi Selatan',
  'Institut Teknologi Kalimantan',
  'Institut Teknologi Sepuluh Nopember',
  'Institut Teknologi Sumatera',
  'Politeknik Elektronika Negeri Surabaya (PENS)',
  'Politeknik Manufaktur Bandung',
  'Politeknik Manufaktur Negeri Bangka Belitung',
  'Politeknik Maritim Negeri Indonesia',
  'Politeknik Negeri Ambon',
  'Politeknik Negeri Bali',
  'Politeknik Negeri Balikpapan',
  'Politeknik Negeri Bandung',
  'Politeknik Negeri Banjarmasin',
  'Politeknik Negeri Batam',
  'Politeknik Negeri Banyuwangi',
  'Politeknik Negeri Bengkalis',
  'Politeknik Negeri Cilacap',
  'Politeknik Negeri Fakfak',
  'Politeknik Negeri Indramayu',
  'Politeknik Negeri Jakarta',
  'Politeknik Negeri Jember',
  'Politeknik Negeri Ketapang',
  'Politeknik Negeri Kupang',
  'Politeknik Negeri Lampung',
  'Politeknik Negeri Lhokseumawe',
  'Politeknik Negeri Madiun',
  'Politeknik Negeri Madura',
  'Politeknik Negeri Malang',
  'Politeknik Negeri Manado',
  'Politeknik Negeri Media Kreatif',
  'Politeknik Negeri Medan',
  'Politeknik Negeri Nunukan',
  'Politeknik Negeri Nusa Utara',
  'Politeknik Negeri Padang',
  'Politeknik Negeri Pontianak',
  'Politeknik Negeri Sambas',
  'Politeknik Negeri Samarinda',
  'Politeknik Negeri Semarang',
  'Politeknik Negeri Sriwijaya',
  'Politeknik Negeri Subang',
  'Politeknik Negeri Tanah Laut',
  'Politeknik Negeri Ujung Pandang',
  'Politeknik Perikanan Negeri Tual',
  'Politeknik Perkapalan Negeri Surabaya',
  'Politeknik Pertanian Negeri Kupang',
  'Politeknik Pertanian Negeri Pangkajene Kepulauan',
  'Politeknik Pertanian Negeri Payakumbuh',
  'Politeknik Pertanian Negeri Samarinda',
  'UIN Alauddin',
  'UIN Antasari Banjarmasin',
  'UIN Ar-Raniry',
  'UIN Datokarama Palu',
  'UIN Imam Bonjol Padang',
  'UIN Jakarta',
  'UIN K.H. Abdurrahman Wahid Pekalongan',
  'UIN Mahmud Yunus Batusangkar',
  'UIN Malang',
  'UIN Mataram',
  'UIN Profesor Kiai Haji Saifuddin Zuhri Purwokerto',
  'UIN Raden Fatah',
  'UIN Raden Intan Lampung',
  'UIN Raden Mas Said Surakarta',
  'UIN Salatiga',
  'UIN Sjech M. Djamil Djambek Bukittinggi',
  'UIN Sultan Aji Muhammad Idris Samarinda',
  'UIN Sultan Maulana Hasanuddin Banten',
  'UIN Sultan Syarif Kasim',
  'UIN Sultan Thaha Saifuddin Jambi',
  'UIN Sumatera Utara',
  'UIN Sunan Ampel Surabaya',
  'UIN Sunan Gunung Djati',
  'UIN Sunan Kalijaga',
  'UIN Syekh Ali Hasan Ahmad Addary Padangsidimpuan',
  'UIN Walisongo',
  'Universitas Airlangga',
  'Universitas Andalas',
  'Universitas Bangka Belitung',
  'Universitas Bengkulu',
  'Universitas Borneo Tarakan',
  'Universitas Brawijaya',
  'Universitas Cenderawasih',
  'Universitas Diponegoro',
  'Universitas Gadjah Mada',
  'Universitas Haluoleo',
  'Universitas Hasanuddin',
  'Universitas Indonesia',
  'Universitas Jambi',
  'Universitas Jember',
  'Universitas Jenderal Soedirman',
  'Universitas Khairun',
  'Universitas Lambung Mangkurat',
  'Universitas Lampung',
  'Universitas Malikussaleh',
  'Universitas Maritim Raja Ali Haji',
  'Universitas Mataram',
  'Universitas Mulawarman',
  'Universitas Musamus Merauke',
  'Universitas Negeri Gorontalo',
  'Universitas Negeri Jakarta',
  'Universitas Negeri Makassar',
  'Universitas Negeri Malang',
  'Universitas Negeri Manado',
  'Universitas Negeri Medan',
  'Universitas Negeri Padang',
  'Universitas Negeri Semarang',
  'Universitas Negeri Surabaya',
  'Universitas Negeri Yogyakarta',
  'Universitas Nusa Cendana',
  'Universitas Padjadjaran',
  'Universitas Palangkaraya',
  'Universitas Papua',
  'Universitas Pattimura',
  'Universitas Pendidikan Ganesha',
  'Universitas Pendidikan Indonesia',
  'Universitas Riau',
  'Universitas Sam Ratulangi',
  'Universitas Samudra',
  'Universitas Sebelas Maret',
  'Universitas Sembilan Belas November Kolaka',
  'Universitas Siliwangi',
  'Universitas Singaperbangsa Karawang',
  'Universitas Sriwijaya',
  'Universitas Sulawesi Barat',
  'Universitas Sultan Ageng Tirtayasa',
  'Universitas Sumatera Utara',
  'Universitas Syiah Kuala',
  'Universitas Tadulako',
  'Universitas Tanjungpura',
  'Universitas Teuku Umar',
  'Universitas Tidar',
  'Universitas Timor',
  'Universitas Trunojoyo Madura',
  'Universitas Udayana',
  'UPN "Veteran" Jakarta',
  'UPN "Veteran" Jawa Timur',
  'UPN "Veteran" Yogyakarta'
];

const OnboardingForm: React.FC<OnboardingFormProps> = ({ isOpen, onClose, userEmail, onComplete }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<OnboardingData>({
    displayName: '',
    asalDaerah: '',
    asalSMA: '',
    ptnImpian: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof OnboardingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simpan data ke localStorage (untuk demo)
      const userId = userEmail.replace(/[^a-zA-Z0-9]/g, '_'); // Sanitize email untuk key
      const profileData = {
        displayName: formData.displayName,
        bio: '',
        asalDaerah: formData.asalDaerah,
        asalSMA: formData.asalSMA,
        ptnImpian: formData.ptnImpian,
        completedOnboarding: true
      };
      
      localStorage.setItem(`profile_${userId}`, JSON.stringify(profileData));
      
      toast({
        title: 'Berhasil!',
        description: 'Profil berhasil disimpan!'
      });
      onComplete();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal menyimpan profil'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    // Tandai bahwa user sudah melewati onboarding
    const userId = userEmail.replace(/[^a-zA-Z0-9]/g, '_');
    localStorage.setItem(`onboarding_${userId}`, 'skipped');
    onComplete();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Lengkapi Profil Anda</h2>
            <p className="text-sm text-gray-600 mt-1">Isi data diri untuk pengalaman yang lebih personal</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={userEmail}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Email tidak dapat diubah</p>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Nama Lengkap
            </label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => handleInputChange('displayName', e.target.value)}
              placeholder="Masukkan nama lengkap Anda"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Asal Daerah */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Asal Daerah
            </label>
            <input
              type="text"
              value={formData.asalDaerah}
              onChange={(e) => handleInputChange('asalDaerah', e.target.value)}
              placeholder="Contoh: Jakarta, Bandung, Surabaya"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Asal SMA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <School className="w-4 h-4 inline mr-1" />
              Asal SMA
            </label>
            <input
              type="text"
              value={formData.asalSMA}
              onChange={(e) => handleInputChange('asalSMA', e.target.value)}
              placeholder="Contoh: SMAN 1 Jakarta"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* PTN Impian */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Trophy className="w-4 h-4 inline mr-1" />
              PTN Impian
            </label>
            <Select value={formData.ptnImpian} onValueChange={(value) => handleInputChange('ptnImpian', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih PTN impian Anda" />
              </SelectTrigger>
              <SelectContent className="max-h-60 bg-white">
                {universitas.map((univ) => (
                  <SelectItem key={univ} value={univ}>
                    {univ}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Note */}
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-700">
              💡 Semua field bersifat opsional. Anda dapat mengisi atau melewatinya dan melengkapi nanti di halaman profil.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Lewati
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnboardingForm;