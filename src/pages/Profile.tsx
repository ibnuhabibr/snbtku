import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import LoadingSpinner from "@/components/LoadingSpinner";
import { updateProfile, updatePassword, updateEmail } from "firebase/auth";
import { resetPassword } from "@/lib/firebase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  User, 
  Trophy, 
  Target, 
  Calendar,
  Clock,
  BookOpen,
  Award,
  TrendingUp,
  Settings,
  Edit,
  Camera,
  Mail,
  Phone,
  MapPin,
  School,
  Star,
  Flame,
  Zap,
  Crown,
  Medal,
  Shield
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navigation from '@/components/Navigation';
import HappyAvatarSelector from '@/components/HappyAvatarSelector';
import { useAuth } from "@/contexts/AuthContext";
import { logoutUser } from "@/lib/firebase";
import { useToast } from "@/components/ui/use-toast";

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

const Profile = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const { currentUser, loading: authLoading } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState("/api/placeholder/150/150");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Settings form states
  const [profileForm, setProfileForm] = useState({
    displayName: '',
    email: '',
    bio: '',
    asalDaerah: '',
    asalSMA: '',
    ptnImpian: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    marketing: false,
  });

  // Initialize form with user data
  useEffect(() => {
    if (currentUser) {
      const userId = currentUser.uid;
      const additionalData = getAdditionalProfileData(userId);
      
      setProfileForm({
        displayName: additionalData.displayName || currentUser.displayName || '',
        email: currentUser.email || '',
        bio: additionalData.bio,
        asalDaerah: additionalData.asalDaerah,
        asalSMA: additionalData.asalSMA,
        ptnImpian: additionalData.ptnImpian
      });
      setSelectedAvatar(currentUser.photoURL || "/api/placeholder/150/150");
    }
  }, [currentUser]);

  // Handle URL tab parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'settings') {
      setActiveTab('settings');
    }
  }, [searchParams]);

  // Avatar options
  const avatarOptions = [
    // Superhero Characters
    { name: "🦸 Captain", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Captain" },
    { name: "⚡ Thunder", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thunder" },
    { name: "🔥 Phoenix", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Phoenix" },
    { name: "❄️ Frost", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Frost" },
    { name: "🌟 Cosmic", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cosmic" },
    { name: "🎭 Shadow", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Shadow" },
    
    // Cute Animals Style
    { name: "🐱 Kitty", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kitty" },
    { name: "🐼 Panda", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Panda" },
    { name: "🦊 Foxy", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Foxy" },
    { name: "🐨 Koala", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Koala" },
    { name: "🦄 Unicorn", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Unicorn" },
    { name: "🐸 Froggy", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Froggy" },
    
    // Cool Professions
    { name: "🎨 Artist", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Artist" },
    { name: "🚀 Astronaut", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Astronaut" },
    { name: "🎵 Musician", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Musician" },
    { name: "🔬 Scientist", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Scientist" },
    { name: "🎮 Gamer", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gamer" },
    { name: "📚 Scholar", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Scholar" },
    
    // Fantasy Characters
    { name: "🧙 Wizard", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Wizard" },
    { name: "🏴‍☠️ Pirate", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pirate" }
  ];

  // Handle avatar selection
  const handleAvatarSelect = async (avatarUrl: string) => {
    try {
      setLoading(true);
      if (currentUser) {
        await updateProfile(currentUser, {
          photoURL: avatarUrl
        });
        setSelectedAvatar(avatarUrl);
        setShowAvatarModal(false);
        toast({
          title: "Avatar berhasil diubah",
          description: "Avatar profil Anda telah berhasil diperbarui.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Gagal mengubah avatar",
        description: "Terjadi kesalahan saat mengubah avatar. Silakan coba lagi.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Settings handlers
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (name: string, checked: boolean) => {
    setNotifications((prev) => ({ ...prev, [name]: checked }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setLoading(true);
    try {
      // Update display name
      if (profileForm.displayName !== currentUser.displayName) {
        await updateProfile(currentUser, {
          displayName: profileForm.displayName,
        });
      }

      // Update email
      if (profileForm.email !== currentUser.email) {
        await updateEmail(currentUser, profileForm.email);
      }

      // Store additional profile data in localStorage for demo purposes
      // In a real app, this would be stored in Firestore
      const additionalProfileData = {
        bio: profileForm.bio,
        asalDaerah: profileForm.asalDaerah,
        asalSMA: profileForm.asalSMA,
        ptnImpian: profileForm.ptnImpian
      };
      localStorage.setItem(`profile_${currentUser.uid}`, JSON.stringify(additionalProfileData));

      toast({
        title: 'Profil diperbarui',
        description: 'Informasi profil Anda telah berhasil diperbarui.',
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Gagal memperbarui profil',
        description: 'Terjadi kesalahan saat memperbarui profil. Silakan coba lagi.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Kata sandi tidak cocok',
        description: 'Kata sandi baru dan konfirmasi kata sandi harus sama.',
      });
      return;
    }

    setLoading(true);
    try {
      await updatePassword(currentUser, passwordForm.newPassword);
      toast({
        title: 'Kata sandi diperbarui',
        description: 'Kata sandi Anda telah berhasil diperbarui.',
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Gagal memperbarui kata sandi',
        description: 'Terjadi kesalahan saat memperbarui kata sandi.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!currentUser?.email) return;
    
    setLoading(true);
    try {
      await resetPassword(currentUser.email);
      toast({
        title: 'Email reset dikirim',
        description: 'Silakan periksa email Anda untuk instruksi reset kata sandi.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Gagal mengirim email reset',
        description: 'Terjadi kesalahan saat mengirim email reset.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast({
        title: "Berhasil logout",
        description: "Anda telah berhasil keluar dari akun.",
      });
      navigate('/');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Gagal logout",
        description: "Terjadi kesalahan saat logout. Silakan coba lagi.",
      });
    }
  };

  // Load additional profile data from localStorage
  const getAdditionalProfileData = (userId: string) => {
    try {
      const savedData = localStorage.getItem(`profile_${userId}`);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        return {
          bio: parsed.bio || '',
          asalDaerah: parsed.asalDaerah || '',
          asalSMA: parsed.asalSMA || '',
          ptnImpian: parsed.ptnImpian || '',
          displayName: parsed.displayName || ''
        };
      }
    } catch (error) {
      console.error('Error loading additional profile data:', error);
    }
    return {
      bio: '',
      asalDaerah: '',
      asalSMA: '',
      ptnImpian: '',
      displayName: ''
    };
  };

  const additionalProfileData = currentUser ? getAdditionalProfileData(currentUser.uid) : {};

  const userProfile = {
    name: additionalProfileData.displayName || currentUser?.displayName || "Pengguna",
    email: currentUser?.email || "",
    phone: "+62 812-3456-7890",
    school: "SMA Negeri 1 Jakarta",
    grade: "12 IPA",
    location: "Jakarta, Indonesia",
    joinDate: currentUser?.metadata?.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : "15 Januari 2024",
    avatar: selectedAvatar,
    level: 15,
    xp: 2847,
    xpToNext: 3000,
    rank: 42,
    totalUsers: 15847,
    bio: additionalProfileData.bio || '',
    asalDaerah: additionalProfileData.asalDaerah || '',
    asalSMA: additionalProfileData.asalSMA || '',
    ptnImpian: additionalProfileData.ptnImpian || ''
  };

  const studyStats = {
    totalStudyTime: "127 jam",
    questionsAnswered: 2847,
    correctAnswers: 2156,
    accuracy: 75.7,
    tryOutsTaken: 23,
    averageScore: 542,
    bestScore: 687,
    currentStreak: 12,
    longestStreak: 28,
    materialsCompleted: 45
  };

  const achievements = [
    {
      id: 1,
      title: "First Steps",
      description: "Menyelesaikan latihan pertama",
      icon: "👶",
      earned: true,
      earnedDate: "15 Jan 2024",
      rarity: "common"
    },
    {
      id: 2,
      title: "Speed Demon",
      description: "Menyelesaikan 50 soal dalam 1 hari",
      icon: "⚡",
      earned: true,
      earnedDate: "22 Jan 2024",
      rarity: "rare"
    },
    {
      id: 3,
      title: "Streak Master",
      description: "Belajar selama 7 hari berturut-turut",
      icon: "🔥",
      earned: true,
      earnedDate: "28 Jan 2024",
      rarity: "epic"
    },
    {
      id: 4,
      title: "Perfect Score",
      description: "Mendapat skor 100% di try out",
      icon: "🎯",
      earned: true,
      earnedDate: "5 Feb 2024",
      rarity: "legendary"
    },
    {
      id: 5,
      title: "Knowledge Seeker",
      description: "Membaca 100 materi pembelajaran",
      icon: "📚",
      earned: false,
      progress: 45,
      total: 100,
      rarity: "rare"
    },
    {
      id: 6,
      title: "Champion",
      description: "Masuk top 10 leaderboard",
      icon: "👑",
      earned: false,
      progress: 42,
      total: 10,
      rarity: "legendary"
    },
    {
      id: 7,
      title: "Early Bird",
      description: "Belajar sebelum jam 6 pagi",
      icon: "🌅",
      earned: true,
      earnedDate: "10 Feb 2024",
      rarity: "common"
    },
    {
      id: 8,
      title: "Night Owl",
      description: "Belajar setelah jam 11 malam",
      icon: "🦉",
      earned: true,
      earnedDate: "12 Feb 2024",
      rarity: "common"
    },
    {
      id: 9,
      title: "Math Wizard",
      description: "Jawab 500 soal matematika dengan benar",
      icon: "🧙‍♂️",
      earned: true,
      earnedDate: "15 Feb 2024",
      rarity: "epic"
    },
    {
      id: 10,
      title: "Speed Reader",
      description: "Selesaikan 10 materi dalam 1 hari",
      icon: "📖",
      earned: false,
      progress: 7,
      total: 10,
      rarity: "rare"
    },
    {
      id: 11,
      title: "Consistency King",
      description: "Belajar 30 hari berturut-turut",
      icon: "⭐",
      earned: false,
      progress: 12,
      total: 30,
      rarity: "legendary"
    },
    {
      id: 12,
      title: "Quiz Master",
      description: "Jawab 1000 soal dengan akurasi >90%",
      icon: "🎓",
      earned: false,
      progress: 756,
      total: 1000,
      rarity: "epic"
    },
    {
      id: 13,
      title: "Social Butterfly",
      description: "Bergabung dengan 5 grup belajar",
      icon: "🦋",
      earned: true,
      earnedDate: "20 Feb 2024",
      rarity: "rare"
    },
    {
      id: 14,
      title: "Helping Hand",
      description: "Bantu 50 teman dengan menjawab pertanyaan",
      icon: "🤝",
      earned: false,
      progress: 23,
      total: 50,
      rarity: "rare"
    },
    {
      id: 15,
      title: "SNBT Veteran",
      description: "Ikuti 100 try out SNBT",
      icon: "🏆",
      earned: false,
      progress: 23,
      total: 100,
      rarity: "legendary"
    },
    {
      id: 16,
      title: "Perfectionist",
      description: "Dapatkan skor 100% di 5 try out berbeda",
      icon: "💎",
      earned: false,
      progress: 1,
      total: 5,
      rarity: "legendary"
    },
    {
      id: 17,
      title: "Study Buddy",
      description: "Belajar bersama teman selama 10 sesi",
      icon: "👥",
      earned: true,
      earnedDate: "25 Feb 2024",
      rarity: "common"
    },
    {
      id: 18,
      title: "Time Manager",
      description: "Selesaikan try out dalam waktu kurang dari target",
      icon: "⏰",
      earned: true,
      earnedDate: "28 Feb 2024",
      rarity: "rare"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: "practice",
      title: "Menyelesaikan 25 soal TPS",
      score: "20/25 benar",
      time: "2 jam lalu",
      xpGained: 50
    },
    {
      id: 2,
      type: "tryout",
      title: "Try Out SNBT #15",
      score: "578 poin",
      time: "1 hari lalu",
      xpGained: 120
    },
    {
      id: 3,
      type: "material",
      title: "Membaca: Fungsi Kuadrat",
      score: "Selesai",
      time: "2 hari lalu",
      xpGained: 30
    },
    {
      id: 4,
      type: "achievement",
      title: "Mendapat badge Perfect Score",
      score: "Legendary",
      time: "3 hari lalu",
      xpGained: 200
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "rare":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "epic":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "legendary":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "practice":
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      case "tryout":
        return <Target className="h-4 w-4 text-green-500" />;
      case "material":
        return <BookOpen className="h-4 w-4 text-purple-500" />;
      case "achievement":
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  // Show loading state while authentication is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
        <Navigation />
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground">Memuat profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 overflow-x-hidden">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-x-hidden">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                  <AvatarFallback className="text-2xl">
                    {userProfile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="sm" 
                  className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                  onClick={() => setShowAvatarModal(true)}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                  <h1 className="text-3xl font-bold">{userProfile.name}</h1>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Crown className="h-3 w-3" />
                      Level {userProfile.level}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Rank #{userProfile.rank}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {userProfile.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {userProfile.asalDaerah || 'Asal daerah belum diisi'}
                  </div>
                  <div className="flex items-center gap-2">
                    <School className="h-4 w-4" />
                    {userProfile.asalSMA || 'Asal SMA belum diisi'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    {userProfile.ptnImpian || 'PTN impian belum diisi'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Bergabung {userProfile.joinDate}
                  </div>
                </div>
                
                {/* XP Progress */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progress ke Level {userProfile.level + 1}</span>
                    <span className="text-sm text-muted-foreground">
                      {userProfile.xp.toLocaleString()} / {userProfile.xpToNext.toLocaleString()} XP
                    </span>
                  </div>
                  <Progress value={(userProfile.xp / userProfile.xpToNext) * 100} className="h-2" />
                </div>
                

              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="space-y-6">
              {/* Study Statistics */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Statistik Belajar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Clock className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                        <div className="text-2xl font-bold text-blue-700">{studyStats.totalStudyTime}</div>
                        <div className="text-sm text-blue-600">Total Belajar</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <BookOpen className="h-6 w-6 mx-auto mb-2 text-green-500" />
                        <div className="text-2xl font-bold text-green-700">{studyStats.questionsAnswered.toLocaleString()}</div>
                        <div className="text-sm text-green-600">Soal Dikerjakan</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <Target className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                        <div className="text-2xl font-bold text-purple-700">{studyStats.accuracy}%</div>
                        <div className="text-sm text-purple-600">Akurasi</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <Trophy className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                        <div className="text-2xl font-bold text-yellow-700">{studyStats.tryOutsTaken}</div>
                        <div className="text-sm text-yellow-600">Try Out</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <Star className="h-6 w-6 mx-auto mb-2 text-red-500" />
                        <div className="text-2xl font-bold text-red-700">{studyStats.bestScore}</div>
                        <div className="text-sm text-red-600">Skor Terbaik</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <Flame className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                        <div className="text-2xl font-bold text-orange-700">{studyStats.currentStreak}</div>
                        <div className="text-sm text-orange-600">Streak Hari</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats */}
              <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Quick Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Ranking Global</span>
                      <Badge variant="secondary">#{userProfile.rank} / {userProfile.totalUsers.toLocaleString()}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Streak Terpanjang</span>
                      <Badge variant="outline">{studyStats.longestStreak} hari</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Rata-rata Skor</span>
                      <Badge className="bg-green-100 text-green-800">{studyStats.averageScore}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Materi Selesai</span>
                      <Badge variant="secondary">{studyStats.materialsCompleted}</Badge>
                    </div>
                  </CardContent>
                </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <Card 
                  key={achievement.id} 
                  className={`${achievement.earned ? 'border-2' : 'opacity-60'} ${achievement.earned ? getRarityColor(achievement.rarity) : ''}`}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">{achievement.icon}</div>
                    <h3 className="font-semibold mb-2">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                    
                    {achievement.earned ? (
                      <div>
                        <Badge className={getRarityColor(achievement.rarity)} variant="outline">
                          {achievement.rarity.toUpperCase()}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-2">
                          Diraih: {achievement.earnedDate}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <Progress 
                          value={(achievement.progress! / achievement.total!) * 100} 
                          className="mb-2" 
                        />
                        <p className="text-xs text-muted-foreground">
                          {achievement.progress} / {achievement.total}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Aktivitas Terbaru</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="p-2 bg-background rounded-full">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{activity.title}</h4>
                        <p className="text-sm text-muted-foreground">{activity.score}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">+{activity.xpGained} XP</Badge>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="space-y-6">
              {/* Profile Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Profil</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                          <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-semibold">{userProfile.name}</h3>
                          <p className="text-muted-foreground">{userProfile.email}</p>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">Informasi Profil</h4>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setIsEditing(!isEditing)}
                          >
                            {isEditing ? 'Batal' : 'Edit Profil'}
                          </Button>
                        </div>

                        {isEditing ? (
                          <form onSubmit={handleProfileSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="displayName">Nama Tampilan</Label>
                                <Input
                                  id="displayName"
                                  name="displayName"
                                  value={profileForm.displayName}
                                  onChange={handleProfileChange}
                                  placeholder="Masukkan nama tampilan"
                                />
                              </div>
                              <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                  id="email"
                                  name="email"
                                  type="email"
                                  value={profileForm.email}
                                  onChange={handleProfileChange}
                                  placeholder="Masukkan email"
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="bio">Bio</Label>
                              <Input
                                id="bio"
                                name="bio"
                                value={profileForm.bio}
                                onChange={handleProfileChange}
                                placeholder="Ceritakan tentang diri Anda"
                              />
                            </div>
                            <div>
                              <Label htmlFor="asalDaerah">Asal Daerah</Label>
                              <Input
                                id="asalDaerah"
                                name="asalDaerah"
                                value={profileForm.asalDaerah}
                                onChange={handleProfileChange}
                                placeholder="Contoh: Jakarta, Bandung, Surabaya"
                              />
                            </div>
                            <div>
                              <Label htmlFor="asalSMA">Asal SMA</Label>
                              <Input
                                id="asalSMA"
                                name="asalSMA"
                                value={profileForm.asalSMA}
                                onChange={handleProfileChange}
                                placeholder="Contoh: SMAN 1 Jakarta"
                              />
                            </div>
                            <div>
                              <Label htmlFor="ptnImpian">PTN Impian</Label>
                              <Select value={profileForm.ptnImpian} onValueChange={(value) => setProfileForm(prev => ({ ...prev, ptnImpian: value }))}>
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
                            <div className="flex gap-2">
                              <Button type="submit" disabled={loading}>
                                {loading ? <LoadingSpinner /> : 'Simpan Perubahan'}
                              </Button>
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setIsEditing(false)}
                              >
                                Batal
                              </Button>
                            </div>
                          </form>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Nama Tampilan</Label>
                              <p className="text-sm text-muted-foreground mt-1">{userProfile.name}</p>
                            </div>
                            <div>
                              <Label>Email</Label>
                              <p className="text-sm text-muted-foreground mt-1">{userProfile.email}</p>
                            </div>
                            <div>
                              <Label>Bio</Label>
                              <p className="text-sm text-muted-foreground mt-1">{userProfile.bio || 'Belum diisi'}</p>
                            </div>
                            <div>
                              <Label>Asal Daerah</Label>
                              <p className="text-sm text-muted-foreground mt-1">{userProfile.asalDaerah || 'Belum diisi'}</p>
                            </div>
                            <div>
                              <Label>Asal SMA</Label>
                              <p className="text-sm text-muted-foreground mt-1">{userProfile.asalSMA || 'Belum diisi'}</p>
                            </div>
                            <div>
                              <Label>PTN Impian</Label>
                              <p className="text-sm text-muted-foreground mt-1">{userProfile.ptnImpian || 'Belum diisi'}</p>
                            </div>
                          </div>
                        )}
                      </div>
                </CardContent>
              </Card>

              {/* Password Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Ubah Kata Sandi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Pastikan kata sandi Anda kuat dan unik untuk keamanan akun.
                        </p>
                      </div>

                      <Separator />

                      <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="currentPassword">Kata Sandi Saat Ini</Label>
                          <Input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            value={passwordForm.currentPassword}
                            onChange={handlePasswordChange}
                            placeholder="Masukkan kata sandi saat ini"
                          />
                        </div>
                        <div>
                          <Label htmlFor="newPassword">Kata Sandi Baru</Label>
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange}
                            placeholder="Masukkan kata sandi baru"
                          />
                        </div>
                        <div>
                          <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi Baru</Label>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordChange}
                            placeholder="Konfirmasi kata sandi baru"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit" disabled={loading}>
                            {loading ? <LoadingSpinner /> : 'Ubah Kata Sandi'}
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={handleResetPassword}
                            disabled={loading}
                          >
                            Reset via Email
                          </Button>
                        </div>
                      </form>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Preferensi Notifikasi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Kelola bagaimana Anda ingin menerima notifikasi dari kami.
                        </p>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Notifikasi Email</Label>
                            <p className="text-sm text-muted-foreground">
                              Terima update dan pengingat via email
                            </p>
                          </div>
                          <Switch
                            checked={notifications.email}
                            onCheckedChange={(checked) => 
                              handleNotificationChange('email', checked)
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Notifikasi Push</Label>
                            <p className="text-sm text-muted-foreground">
                              Terima notifikasi langsung di browser
                            </p>
                          </div>
                          <Switch
                            checked={notifications.push}
                            onCheckedChange={(checked) => 
                              handleNotificationChange('push', checked)
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Email Marketing</Label>
                            <p className="text-sm text-muted-foreground">
                              Terima tips belajar dan penawaran khusus
                            </p>
                          </div>
                          <Switch
                            checked={notifications.marketing}
                            onCheckedChange={(checked) => 
                              handleNotificationChange('marketing', checked)
                            }
                          />
                        </div>
                      </div>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-destructive">Zona Bahaya</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={handleLogout}
                            disabled={loading}
                          >
                            {loading ? <LoadingSpinner /> : 'Logout'}
                          </Button>
                          <Button 
                            variant="destructive" 
                            className="w-full"
                            disabled={loading}
                          >
                            Hapus Akun
                          </Button>
                        </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Happy Avatar Selection */}
      <HappyAvatarSelector
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        onSelect={handleAvatarSelect}
        currentAvatar={selectedAvatar}
      />
    </div>
  );
};

export default Profile;