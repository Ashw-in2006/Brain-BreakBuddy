// src/pages/Leaderboard.tsx
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, UserPlus, Users, Flame, Crown, Target } from "lucide-react";

export default function Leaderboard() {
  const [weeklyRankings, setWeeklyRankings] = useState<any[]>([]);
  const [followedUsers, setFollowedUsers] = useState<any[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Get user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        fetchWeeklyLeaderboard();
        fetchFollowedUsers();
      }
    };
    getUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  // Call fetch functions when user changes
  useEffect(() => {
    if (user) {
      fetchWeeklyLeaderboard();
      fetchFollowedUsers();
    }
  }, [user]);

  // Get start of current week
  const getWeekStart = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(now.setDate(diff)).toISOString().split('T')[0];
  };

  const fetchWeeklyLeaderboard = async () => {
    const weekStart = getWeekStart();
    
    try {
      // Try to get data from a weekly scores table
      const { data: rankings, error } = await supabase
        .from('user_weekly_scores')
        .select(`
          user_id,
          score,
          streak_days,
          profiles:user_id (
            username,
            avatar_url,
            full_name
          )
        `)
        .gte('week_start', weekStart)
        .order('score', { ascending: false })
        .limit(20);

      if (!error && rankings) {
        setWeeklyRankings(rankings);
        
        // Find current user rank
        const userIndex = rankings.findIndex((r: any) => r.user_id === user?.id);
        if (userIndex !== -1) {
          setCurrentUserRank({
            rank: userIndex + 1,
            ...rankings[userIndex]
          });
        }
      } else {
        // Fallback: Get data from profiles table if weekly_scores doesn't exist
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, avatar_url, current_streak, total_correct')
          .order('total_correct', { ascending: false })
          .limit(10);

        if (!profilesError && profiles) {
          const rankingsData = profiles.map((profile: any, index: number) => ({
            user_id: profile.id,
            score: profile.total_correct || 0,
            streak_days: profile.current_streak || 0,
            profiles: {
              username: profile.username,
              avatar_url: profile.avatar_url,
              full_name: profile.username
            }
          }));
          setWeeklyRankings(rankingsData);
        }
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowedUsers = async () => {
    if (!user) return;
    
    try {
      const { data: follows, error } = await supabase
        .from('user_follows')
        .select(`
          following_id,
          profiles:following_id (
            username,
            avatar_url,
            current_streak,
            total_correct
          )
        `)
        .eq('follower_id', user.id)
        .limit(5);

      if (!error && follows) {
        setFollowedUsers(follows);
      } else {
        // If table doesn't exist, show sample users to follow
        const { data: sampleUsers } = await supabase
          .from('profiles')
          .select('id, username, avatar_url, current_streak, total_correct')
          .neq('id', user.id)
          .limit(3);

        if (sampleUsers) {
          const sampleFollows = sampleUsers.map((profile: any) => ({
            following_id: profile.id,
            profiles: {
              username: profile.username,
              avatar_url: profile.avatar_url,
              current_streak: profile.current_streak || 0,
              total_correct: profile.total_correct || 0
            }
          }));
          setFollowedUsers(sampleFollows);
        }
      }
    } catch (error) {
      console.error('Error fetching followed users:', error);
    }
  };

  const handleFollow = async (userId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_follows')
        .insert({
          follower_id: user.id,
          following_id: userId,
          created_at: new Date().toISOString()
        });

      if (!error) {
        fetchFollowedUsers();
        alert('Successfully followed user!');
      }
    } catch (error) {
      console.error('Error following user:', error);
      alert('You need to create the user_follows table in Supabase first');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Loading Leaderboard...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-500" />
          Weekly Leaderboard
          <Crown className="w-8 h-8 text-yellow-400" />
        </h1>
        <p className="text-gray-600">See who's leading this week's challenge!</p>
      </div>

      {/* Current User Rank Card */}
      {currentUserRank && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Your Current Rank</h3>
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg">
                    <span className="text-2xl font-bold">#{currentUserRank.rank}</span>
                  </div>
                  <div>
                    <p className="font-medium">{currentUserRank.profiles?.username}</p>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        Score: {currentUserRank.score || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="w-4 h-4 text-orange-500" />
                        {currentUserRank.streak_days || 0} day streak
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                <AvatarImage src={currentUserRank.profiles?.avatar_url} />
                <AvatarFallback className="text-lg">
                  {currentUserRank.profiles?.username?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Rankings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Top Solvers This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weeklyRankings.map((ranking: any, index: number) => {
              const isTopThree = index < 3;
              return (
                <div 
                  key={ranking.user_id || index} 
                  className={`flex items-center justify-between p-4 rounded-lg transition-all hover:bg-gray-50 ${
                    isTopThree ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-100' : 'border'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {isTopThree ? (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-yellow-100 text-yellow-700' :
                          index === 1 ? 'bg-gray-100 text-gray-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          <span className="font-bold">
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                          </span>
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="font-bold text-gray-700">#{index + 1}</span>
                        </div>
                      )}
                    </div>
                    
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={ranking.profiles?.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {ranking.profiles?.username?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <p className="font-semibold">{ranking.profiles?.username || `User ${index + 1}`}</p>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {ranking.score || 0} points
                        </span>
                        <span className="flex items-center gap-1">
                          <Flame className="w-3 h-3" />
                          {ranking.streak_days || 0} days
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {user && ranking.user_id && ranking.user_id !== user.id && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleFollow(ranking.user_id)}
                      className="flex items-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      Follow
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* People You Follow Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-500" />
            People You Follow
          </CardTitle>
        </CardHeader>
        <CardContent>
          {followedUsers.length > 0 ? (
            <div className="space-y-3">
              {followedUsers.map((follow: any) => (
                <div key={follow.following_id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={follow.profiles?.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                        {follow.profiles?.username?.charAt(0) || 'F'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{follow.profiles?.username || 'Friend'}</p>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Flame className="w-3 h-3 text-orange-500" />
                          {follow.profiles?.current_streak || 0} day streak
                        </span>
                        <span className="flex items-center gap-1">
                          <Trophy className="w-3 h-3" />
                          {follow.profiles?.total_correct || 0} points
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-blue-600">
                    View Profile
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Start Following Friends!</h3>
              <p className="text-gray-600 mb-4">
                Search for users in the Profile page to follow them and see their achievements here!
              </p>
              <Button onClick={() => window.location.href = '/profile'} className="mx-auto">
                Go to Profile
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">How the Leaderboard Works</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Rankings update every Monday at midnight</li>
                <li>• Earn points by solving riddles correctly</li>
                <li>• Maintain streaks for bonus points</li>
                <li>• Follow friends to see their progress</li>
                <li>• Top 3 get special badges each week!</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}