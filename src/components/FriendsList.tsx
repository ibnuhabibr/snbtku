import React, { useState, useEffect } from 'react';
import { Users, Trophy, Clock, MessageCircle, UserMinus, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useToast } from '../hooks/use-toast';
import { api } from '../services/api';

interface Friend {
  id: string;
  unique_id: string;
  full_name: string;
  avatar_url?: string;
  school_name?: string;
  grade_level?: string;
  level: number;
  xp: number;
  created_at: string;
  friendship_date?: string;
  is_online?: boolean;
}

interface FriendsListProps {
  onFriendSelect?: (friend: Friend) => void;
  showActions?: boolean;
}

const FriendsList: React.FC<FriendsListProps> = ({ onFriendSelect, showActions = true }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchFriends = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/users/friends');
      
      setFriends(response.data.friends || []);
    } catch (error: any) {
      console.error('Fetch friends error:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to load friends',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFriend = async (friendId: string, friendName: string) => {
    try {
      await api.delete(`/users/friends/${friendId}`);

      setFriends(friends.filter(friend => friend.id !== friendId));
      toast({
        title: 'Success',
        description: `${friendName} has been removed from your friends`,
      });
    } catch (error: any) {
      console.error('Remove friend error:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to remove friend',
        variant: 'destructive',
      });
    }
  };



  const formatFriendshipDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
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

  useEffect(() => {
    fetchFriends();
  }, []);

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Daftar Teman
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Memuat daftar teman...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Daftar Teman
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {friends.length} teman
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {friends.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-xl font-medium mb-2">Belum ada teman</p>
            <p className="text-sm">
              Mulai cari dan tambahkan teman untuk belajar bersama!
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {friends.map((friend) => (
              <Card key={friend.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div 
                      className="flex items-center gap-3 flex-1 cursor-pointer"
                      onClick={() => onFriendSelect?.(friend)}
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={friend.avatar_url} alt={friend.full_name} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                            {friend.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {friend.is_online && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {friend.full_name}
                          </h3>
                          <Badge 
                            variant="secondary" 
                            className={`${getLevelColor(friend.level)} text-white text-xs`}
                          >
                            Level {friend.level}
                          </Badge>
                          {friend.level >= 30 && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <span className="font-mono font-semibold text-blue-600">
                              #{friend.unique_id}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Trophy className="h-3 w-3" />
                            <span>{friend.xp.toLocaleString()} XP</span>
                          </div>
                          
                          {friend.school_name && (
                            <div className="flex items-center gap-1 truncate">
                              <span className="truncate">{friend.school_name}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                          {friend.grade_level && (
                            <span>Kelas {friend.grade_level}</span>
                          )}
                          {friend.friendship_date && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>Berteman sejak {formatFriendshipDate(friend.friendship_date)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {showActions && (
                      <div className="flex items-center gap-2 ml-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Implement chat functionality
                            toast({
                              title: 'Coming Soon',
                              description: 'Chat feature will be available soon!',
                            });
                          }}
                          className="flex items-center gap-1"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Chat
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Apakah Anda yakin ingin menghapus ${friend.full_name} dari daftar teman?`)) {
                              removeFriend(friend.id, friend.full_name);
                            }
                          }}
                          className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <UserMinus className="h-4 w-4" />
                          Hapus
                        </Button>
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
  );
};

export default FriendsList;