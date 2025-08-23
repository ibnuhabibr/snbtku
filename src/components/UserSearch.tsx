import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Users, Trophy, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useToast } from '../hooks/use-toast';
import { api } from '../services/api';

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

interface UserSearchProps {
  onUserSelect?: (user: User) => void;
  showAddFriend?: boolean;
}

const UserSearch: React.FC<UserSearchProps> = ({ onUserSelect, showAddFriend = true }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchType, setSearchType] = useState<'unique_id' | 'name' | null>(null);
  const { toast } = useToast();

  const searchUsers = async (query: string) => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      setSearchType(null);
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.get(`/users/search?query=${encodeURIComponent(query)}`);
      const data = response.data;

      setSearchResults(data.users || []);
      setSearchType(data.searchType);
    } catch (error: any) {
      console.error('Search error:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to search users',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendFriendRequest = async (targetUserId: string, userName: string) => {
    try {
      const response = await api.post('/users/friends/request', { targetUserId });
      const data = response.data;

      toast({
        title: 'Success',
        description: data.message || `Friend request sent to ${userName}!`,
      });
    } catch (error: any) {
      console.error('Friend request error:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to send friend request',
        variant: 'destructive',
      });
    }
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
    });
  };

  const getLevelColor = (level: number) => {
    if (level >= 50) return 'bg-purple-500';
    if (level >= 30) return 'bg-blue-500';
    if (level >= 15) return 'bg-green-500';
    if (level >= 5) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Cari Pengguna
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Cari berdasarkan ID unik (contoh: ABC12345) atau nama..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {searchQuery.trim().length >= 2 && (
          <div className="text-sm text-gray-600">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Mencari...
              </div>
            ) : (
              <div>
                {searchType === 'unique_id' && 'Pencarian berdasarkan ID unik'}
                {searchType === 'name' && 'Pencarian berdasarkan nama'}
                {searchResults.length > 0 && ` - ${searchResults.length} hasil ditemukan`}
              </div>
            )}
          </div>
        )}

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {searchResults.map((user) => (
            <Card key={user.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div 
                    className="flex items-center gap-3 flex-1"
                    onClick={() => onUserSelect?.(user)}
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar_url} alt={user.full_name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                        {user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {user.full_name}
                        </h3>
                        <Badge 
                          variant="secondary" 
                          className={`${getLevelColor(user.level)} text-white text-xs`}
                        >
                          Level {user.level}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <span className="font-mono font-semibold text-blue-600">
                            #{user.unique_id}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Trophy className="h-3 w-3" />
                          <span>{user.xp.toLocaleString()} XP</span>
                        </div>
                        
                        {user.school_name && (
                          <div className="flex items-center gap-1 truncate">
                            <span className="truncate">{user.school_name}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                        {user.grade_level && (
                          <span>Kelas {user.grade_level}</span>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Bergabung {formatJoinDate(user.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {showAddFriend && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        sendFriendRequest(user.id, user.full_name);
                      }}
                      className="ml-3 flex items-center gap-1"
                    >
                      <UserPlus className="h-4 w-4" />
                      Tambah Teman
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {searchQuery.trim().length >= 2 && searchResults.length === 0 && !isLoading && (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium mb-1">Tidak ada pengguna ditemukan</p>
            <p className="text-sm">
              Coba cari dengan ID unik (contoh: ABC12345) atau nama yang berbeda
            </p>
          </div>
        )}

        {searchQuery.trim().length < 2 && (
          <div className="text-center py-8 text-gray-500">
            <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium mb-1">Cari Pengguna</p>
            <p className="text-sm">
              Masukkan ID unik atau nama pengguna untuk mencari teman baru
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserSearch;