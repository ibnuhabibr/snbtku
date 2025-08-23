import React, { useState } from 'react';
import { Users, Search, MessageCircle, Trophy, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import UserSearch from '../components/UserSearch';
import FriendsList from '../components/FriendsList';
import Navigation from '../components/Navigation';

interface User {
  id: string;
  unique_id: string;
  full_name: string;
  avatar_url?: string;
  school_name?: string;
  grade_level?: string;
  level: number;
  xp: number;
  created_at: string;
}

const SocialPage: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('friends');

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    // TODO: Navigate to user profile or show user details modal
    console.log('Selected user:', user);
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getLevelColor = (level: number) => {
    if (level >= 50) return 'bg-purple-500';
    if (level >= 30) return 'bg-blue-500';
    if (level >= 15) return 'bg-green-500';
    if (level >= 5) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      <div className="max-w-6xl mx-auto p-4 pt-20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Komunitas Belajar
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Temukan teman belajar, berbagi pengalaman, dan tingkatkan prestasi bersama-sama!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Pengguna</p>
                  <p className="text-3xl font-bold">12,847</p>
                </div>
                <Users className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Aktif Hari Ini</p>
                  <p className="text-3xl font-bold">3,241</p>
                </div>
                <MessageCircle className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Top Performers</p>
                  <p className="text-3xl font-bold">856</p>
                </div>
                <Trophy className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="friends" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Teman Saya
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Cari Teman
            </TabsTrigger>
          </TabsList>

          <TabsContent value="friends" className="space-y-6">
            <FriendsList 
              onFriendSelect={handleUserSelect}
              showActions={true}
            />
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <UserSearch 
              onUserSelect={handleUserSelect}
              showAddFriend={true}
            />
            
            {/* Quick Tips */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Tips Pencarian
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-blue-700 space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Gunakan <strong>ID unik</strong> (contoh: ABC12345) untuk pencarian yang lebih akurat</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Cari berdasarkan <strong>nama lengkap</strong> untuk menemukan teman sekelas</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Tambahkan teman untuk berbagi progress dan saling memotivasi</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Selected User Modal/Card (if needed) */}
        {selectedUser && (
          <Card className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 md:w-96 z-50 shadow-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Profil Pengguna</CardTitle>
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  ×
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                  {selectedUser.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedUser.full_name}</h3>
                <p className="text-blue-600 font-mono font-semibold">#{selectedUser.unique_id}</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Level:</span>
                  <Badge className={`${getLevelColor(selectedUser.level)} text-white`}>
                    Level {selectedUser.level}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">XP:</span>
                  <span className="font-semibold">{selectedUser.xp.toLocaleString()}</span>
                </div>
                
                {selectedUser.school_name && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Sekolah:</span>
                    <span className="font-medium text-right flex-1 ml-2 truncate">{selectedUser.school_name}</span>
                  </div>
                )}
                
                {selectedUser.grade_level && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Kelas:</span>
                    <span className="font-medium">{selectedUser.grade_level}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Bergabung:</span>
                  <span className="font-medium">{formatJoinDate(selectedUser.created_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Backdrop for modal */}
        {selectedUser && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSelectedUser(null)}
          ></div>
        )}
      </div>
    </div>
  );
};

export default SocialPage;