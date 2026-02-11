// src/pages/Dashboard.tsx - Clean version with streak only in welcome card
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Brain, Trophy, User, Search, Settings, Flame, LogOut } from "lucide-react";
import RiddleCard from "@/components/RiddleCard";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      await fetchProfile(session.user.id);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate("/auth");
      }
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      toast({
        variant: "destructive",
        title: "Error loading profile",
        description: error.message,
      });
    } else {
      setProfile(data);
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 bg-card/80 backdrop-blur-lg border-b shadow-sm z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center shadow-glow">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">BrainBreak Buddy</h1>
              <p className="text-xs text-muted-foreground">Welcome, {profile.name || profile.username || 'User'}!</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Welcome Card with Streak Stats and Navigation */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Welcome Text */}
            <div>
              <h2 className="text-2xl font-bold">
                Welcome back, {profile.name || 'User'}! 👋
              </h2>
              <p className="text-blue-100 mt-1">
                Ready for today's brain challenge?
              </p>
            </div>

            {/* Horizontal Navigation Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="secondary"
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
                onClick={() => navigate("/leaderboard")}
              >
                <Trophy className="w-4 h-4" />
                <span>Leaderboard</span>
              </Button>

              <Button
                variant="secondary"
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
                onClick={() => navigate("/profile")}
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Button>

              <Button
                variant="secondary"
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
                onClick={() => navigate("/discover")}
              >
                <Search className="w-4 h-4" />
                <span>Discover</span>
              </Button>

              <Button
                variant="secondary"
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
                onClick={() => navigate("/settings")}
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Button>
            </div>
          </div>

          {/* Streak Stats Cards - Horizontal Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-4 border-t border-white/20">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="bg-orange-500/30 p-2 rounded-full">
                  <Flame className="w-5 h-5 text-orange-300" />
                </div>
                <div>
                  <p className="text-sm text-blue-100">Current Streak</p>
                  <p className="text-2xl font-bold">{profile.current_streak} <span className="text-lg">days</span></p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/30 p-2 rounded-full">
                  <Trophy className="w-5 h-5 text-blue-300" />
                </div>
                <div>
                  <p className="text-sm text-blue-100">Longest Streak</p>
                  <p className="text-2xl font-bold">{profile.longest_streak} <span className="text-lg">days</span></p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="bg-green-500/30 p-2 rounded-full">
                  <Brain className="w-5 h-5 text-green-300" />
                </div>
                <div>
                  <p className="text-sm text-blue-100">Correct Answers</p>
                  <p className="text-2xl font-bold">{profile.total_correct || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Language Badge */}
          <div className="mt-4 flex justify-end">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-xs backdrop-blur-sm">
              <Brain className="w-3 h-3" />
              {profile.language === "en" ? "English" : 
               profile.language === "ta" ? "தமிழ்" : "Tanglish"}
            </span>
          </div>
        </div>

        {/* Riddle Card - Now the main content */}
        <RiddleCard
          userId={user?.id || ""}
          language={profile.language}
          onStreakUpdate={fetchProfile}
        />
      </main>
    </div>
  );
};

export default Dashboard;