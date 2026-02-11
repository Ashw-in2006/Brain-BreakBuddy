// src/pages/Profile.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Users, Trophy, UserPlus, UserMinus, User, Mail, Calendar, Edit, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    name: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileData) {
      setProfile(profileData);
      setFormData({
        username: profileData.username || '',
        bio: profileData.bio || '',
        name: profileData.name || ''
      });
    }

    const { data: followersData } = await supabase
      .from("followers")
      .select("follower_id, profiles!followers_follower_id_fkey(name)")
      .eq("following_id", user.id);

    const { data: followingData } = await supabase
      .from("followers")
      .select("following_id, profiles!followers_following_id_fkey(name)")
      .eq("follower_id", user.id);

    const { data: achievementsData } = await supabase
      .from("achievements")
      .select("*")
      .eq("user_id", user.id)
      .order("earned_date", { ascending: false });

    setFollowers(followersData || []);
    setFollowing(followingData || []);
    setAchievements(achievementsData || []);
    setLoading(false);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          bio: formData.bio,
          name: formData.name,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated!",
        description: "Your profile has been successfully updated.",
      });
      
      setEditing(false);
      fetchProfile();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: error.message,
      });
    }
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
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Profile</h1>
          <div className="ml-auto">
            <Button
              variant={editing ? "destructive" : "outline"}
              size="sm"
              onClick={() => editing ? setEditing(false) : setEditing(true)}
            >
              {editing ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <Card className="shadow-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="gradient-primary text-white text-3xl">
                  {profile.username?.substring(0, 2).toUpperCase() || profile.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <p className="text-sm text-muted-foreground">@{profile.username || 'username'}</p>
                {profile.bio && <p className="mt-2 text-gray-600 max-w-md">{profile.bio}</p>}
              </div>
              <div className="flex gap-8 mt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{followers.length}</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-secondary">{following.length}</p>
                  <p className="text-xs text-muted-foreground">Following</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Section */}
        {editing && (
          <Card className="shadow-md border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Edit Your Profile</CardTitle>
              <CardDescription>Update your username, display name, and bio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  placeholder="Choose a unique username"
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">This will be your public username</p>
              </div>

              <div>
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Your display name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={handleSaveProfile} className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditing(false)} className="flex-1">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* User Info Card */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-medium">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">User ID</p>
                  <p className="font-medium text-xs truncate">{user?.id?.substring(0, 8)}...</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-accent" />
              Achievements
            </CardTitle>
            <CardDescription>Your earned badges and milestones</CardDescription>
          </CardHeader>
          <CardContent>
            {achievements.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No achievements yet. Keep solving riddles!
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                  >
                    <div className="text-4xl mb-2">{achievement.badge_icon}</div>
                    <p className="font-medium text-sm">{achievement.badge_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(achievement.earned_date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Language</span>
              <Badge variant="secondary">
                {profile.language === "en" ? "English" : profile.language === "ta" ? "Tamil" : "Tanglish"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Preferred Time</span>
              <Badge variant="secondary">{profile.preferred_time}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Current Streak</span>
              <Badge variant="default">{profile.current_streak} days</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Longest Streak</span>
              <Badge variant="default">{profile.longest_streak} days</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Solved</span>
              <Badge variant="default">{profile.total_correct}</Badge>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;