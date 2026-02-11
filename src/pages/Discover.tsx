// src/pages/Discover.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, UserPlus, UserCheck, Flame, Trophy, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Discover() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [followedUsers, setFollowedUsers] = useState<string[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log('Current user:', user);
        setUserId(user.id);
        await Promise.all([
          fetchAllUsers(user.id),
          fetchFollowedUsers(user.id)
        ]);
      } else {
        console.log('No user logged in');
        navigate('/auth');
      }
      setInitialLoading(false);
    };
    initialize();
  }, []);

  const fetchAllUsers = async (uid: string) => {
    try {
      console.log('Fetching all users except:', uid);
      
      const { data: users, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', uid)
        .order('current_streak', { ascending: false });

      console.log('Query result:', { users, error });

      if (error) {
        console.error('Supabase error:', error);
        toast({
          variant: "destructive",
          title: "Error loading users",
          description: error.message,
        });
        return;
      }

      if (users && users.length > 0) {
        console.log(`Found ${users.length} users:`, users);
        setAllUsers(users);
      } else {
        console.log('No users found in profiles table');
        setAllUsers([]);
      }
    } catch (error) {
      console.error('Exception in fetchAllUsers:', error);
    }
  };

  const fetchFollowedUsers = async (uid: string) => {
    try {
      const { data: follows, error } = await supabase
        .from('user_follows')
        .select('following_id')
        .eq('follower_id', uid);

      if (!error && follows) {
        setFollowedUsers(follows.map(f => f.following_id));
      }
    } catch (error) {
      console.error('Error fetching followed users:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const { data: users, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`username.ilike.%${searchQuery}%,name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
        .neq('id', userId);

      if (!error && users) {
        setSearchResults(users);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (targetUserId: string) => {
    try {
      const { error } = await supabase
        .from('user_follows')
        .insert({
          follower_id: userId,
          following_id: targetUserId,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Follow error:', error);
        toast({
          variant: "destructive",
          title: "Follow failed",
          description: error.message,
        });
        return;
      }

      setFollowedUsers([...followedUsers, targetUserId]);
      toast({
        title: "Success!",
        description: "You are now following this user.",
      });
    } catch (error) {
      console.error('Follow error:', error);
    }
  };

  const handleUnfollow = async (targetUserId: string) => {
    try {
      const { error } = await supabase
        .from('user_follows')
        .delete()
        .eq('follower_id', userId)
        .eq('following_id', targetUserId);

      if (!error) {
        setFollowedUsers(followedUsers.filter(id => id !== targetUserId));
        toast({
          title: "Unfollowed",
          description: "You have unfollowed this user.",
        });
      }
    } catch (error) {
      console.error('Unfollow error:', error);
    }
  };

  const renderUserCard = (user: any) => (
    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-all">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg">
            {user.username?.charAt(0)?.toUpperCase() || user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold">{user.name || user.username || 'Anonymous'}</p>
            <p className="text-sm text-gray-500">@{user.username || user.email?.split('@')[0] || 'user'}</p>
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
            <p className="text-sm text-gray-500 mt-1">{user.bio}</p>
          )}
        </div>
      </div>
      
      {followedUsers.includes(user.id) ? (
        <Button variant="outline" size="sm" onClick={() => handleUnfollow(user.id)}>
          <UserCheck className="w-4 h-4 mr-2" />
          Following
        </Button>
      ) : (
        <Button size="sm" onClick={() => handleFollow(user.id)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Follow
        </Button>
      )}
    </div>
  );

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 bg-card/80 backdrop-blur-lg border-b shadow-sm z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Discover People</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Search Card */}
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
                  placeholder="Search by username, name, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Search Results ({searchResults.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {searchResults.map(renderUserCard)}
            </CardContent>
          </Card>
        )}

        {/* All Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              All Users ({allUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {allUsers.length > 0 ? (
              allUsers.map(renderUserCard)
            ) : (
              <div className="text-center py-12">
                <Users className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h3 className="font-semibold text-xl mb-2">No other users found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  You're the first one here! 🎉 Share the app with friends to start following them.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}