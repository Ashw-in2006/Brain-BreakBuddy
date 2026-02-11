// src/components/UserSearch.tsx
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, UserPlus, UserCheck, Flame } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserSearchProps {
  currentUserId: string;
}

export default function UserSearch({ currentUserId }: UserSearchProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [followedUsers, setFollowedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFollowedUsers();
  }, [currentUserId]);

  const fetchFollowedUsers = async () => {
    if (!currentUserId) return;
    
    const { data: follows } = await supabase
      .from('user_follows')
      .select('following_id')
      .eq('follower_id', currentUserId);

    if (follows) {
      setFollowedUsers(follows.map(f => f.following_id));
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const { data: users, error } = await supabase
        .from('profiles')
        .select('id, username, name, avatar_url, current_streak, bio')
        .or(`username.ilike.%${searchQuery}%,name.ilike.%${searchQuery}%`)
        .neq('id', currentUserId)
        .limit(10);

      if (error) throw error;
      
      setSearchResults(users || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Search failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId: string) => {
    if (!currentUserId) return;
    
    try {
      const { error } = await supabase
        .from('user_follows')
        .insert({
          follower_id: currentUserId,
          following_id: userId,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      setFollowedUsers([...followedUsers, userId]);
      
      toast({
        title: "Success!",
        description: "You are now following this user.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Follow failed",
        description: error.message,
      });
    }
  };

  const handleUnfollow = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_follows')
        .delete()
        .eq('follower_id', currentUserId)
        .eq('following_id', userId);

      if (error) throw error;

      setFollowedUsers(followedUsers.filter(id => id !== userId));
      
      toast({
        title: "Unfollowed",
        description: "You have unfollowed this user.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Unfollow failed",
        description: error.message,
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search users by username or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch} disabled={loading || !searchQuery.trim()}>
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">Search Results</h3>
            <div className="space-y-3">
              {searchResults.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {user.username?.charAt(0) || user.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name || 'Anonymous'}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>@{user.username || 'user'}</span>
                        {user.current_streak > 0 && (
                          <span className="flex items-center gap-1">
                            <Flame className="w-3 h-3 text-orange-500" />
                            {user.current_streak} day streak
                          </span>
                        )}
                      </div>
                      {user.bio && <p className="text-xs text-gray-500 mt-1 truncate">{user.bio}</p>}
                    </div>
                  </div>
                  
                  {followedUsers.includes(user.id) ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnfollow(user.id)}
                      className="flex items-center gap-2"
                    >
                      <UserCheck className="w-4 h-4" />
                      Following
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleFollow(user.id)}
                      className="flex items-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      Follow
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Users to Follow */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Suggested Users</h3>
          <div className="space-y-3">
            {/* This would fetch random users from database */}
            <div className="text-center py-4">
              <p className="text-gray-600">Search for users to follow them!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}