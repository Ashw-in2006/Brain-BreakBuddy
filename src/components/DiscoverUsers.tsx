// src/components/DiscoverUsers.tsx
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, UserCheck, Flame, Trophy, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DiscoverUsersProps {
  currentUserId: string;
  onFollowChange?: () => void;
}

export default function DiscoverUsers({ currentUserId, onFollowChange }: DiscoverUsersProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [followedUsers, setFollowedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchFollowedUsers();
    fetchSuggestedUsers();
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

  const fetchSuggestedUsers = async () => {
    try {
      const { data: users, error } = await supabase
        .from('profiles')
        .select('id, username, name, avatar_url, current_streak, total_correct, bio')
        .neq('id', currentUserId)
        .limit(5);

      if (!error && users) {
        setSuggestedUsers(users);
      }
    } catch (error) {
      console.error('Error fetching suggested users:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const { data: users, error } = await supabase
        .from('profiles')
        .select('id, username, name, avatar_url, current_streak, total_correct, bio')
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
      onFollowChange?.();
      
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
      onFollowChange?.();
      
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

  const renderUserCard = (user: any, showFollowButton = true) => (
    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-all">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg">
            {user.username?.charAt(0) || user.name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold">{user.name || 'Anonymous'}</p>
            <p className="text-sm text-gray-500">@{user.username || 'username'}</p>
          </div>
          <div className="flex items-center gap-4 mt-1">
            <span className="flex items-center gap-1 text-sm text-gray-600">
              <Flame className="w-4 h-4 text-orange-500" />
              {user.current_streak || 0} day streak
            </span>
            <span className="flex items-center gap-1 text-sm text-gray-600">
              <Trophy className="w-4 h-4 text-yellow-500" />
              {user.total_correct || 0} points
            </span>
          </div>
          {user.bio && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-1">{user.bio}</p>
          )}
        </div>
      </div>
      
      {showFollowButton && (
        followedUsers.includes(user.id) ? (
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
        )
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Find People
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search by username or name..."
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
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {searchResults.map(user => renderUserCard(user))}
          </CardContent>
        </Card>
      )}

      {/* Suggested Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Suggested for You
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {suggestedUsers.length > 0 ? (
            suggestedUsers.map(user => renderUserCard(user))
          ) : (
            <div className="text-center py-6">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No suggested users yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}