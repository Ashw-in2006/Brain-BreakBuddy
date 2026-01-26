// src/components/StreakDisplay.tsx
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Flame, Trophy, Target, Users, Brain, Crown, Award } from "lucide-react";

// Define the props interface
interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  totalCorrect: number;
}

const StreakDisplay = ({ currentStreak, longestStreak, totalCorrect }: StreakDisplayProps) => {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [showAchievements, setShowAchievements] = useState(false);

  const ACHIEVEMENTS_CONFIG = {
    'rookie': { 
      days: 3, 
      icon: '🌟', 
      description: '3-Day Streak',
      lucideIcon: <Trophy className="w-5 h-5" />
    },
    'enthusiast': { 
      days: 7, 
      icon: '🔥', 
      description: '1-Week Streak',
      lucideIcon: <Flame className="w-5 h-5 text-orange-500" />
    },
    'dedicated': { 
      days: 30, 
      icon: '🏆', 
      description: '1-Month Streak',
      lucideIcon: <Award className="w-5 h-5 text-blue-500" />
    },
    'legendary': { 
      days: 100, 
      icon: '👑', 
      description: '100 Days!',
      lucideIcon: <Crown className="w-5 h-5 text-yellow-500" />
    },
    'perfectionist': { 
      icon: '🎯', 
      description: 'Perfect Week',
      lucideIcon: <Target className="w-5 h-5 text-green-500" />
    },
    'social': { 
      icon: '👥', 
      description: 'Follow 5 Friends',
      lucideIcon: <Users className="w-5 h-5 text-purple-500" />
    },
    'master': { 
      icon: '🧠', 
      description: 'Solve 100 Riddles',
      lucideIcon: <Brain className="w-5 h-5 text-indigo-500" />
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) {
      const { data: unlocked } = await supabase
        .from('user_achievements')
        .select('achievement_type, unlocked_at')
        .eq('user_id', userData.user.id);

      setAchievements(unlocked || []);
    }
  };

  const getUnlockedAchievements = () => {
    return achievements.filter(achievement => {
      const config = ACHIEVEMENTS_CONFIG[achievement.achievement_type as keyof typeof ACHIEVEMENTS_CONFIG];
      if (!config) return false;
      
      // Check streak-based achievements
      if (config.days) {
        return currentStreak >= config.days;
      }
      
      // For non-streak achievements, just check if unlocked
      return true;
    });
  };

  const unlockedAchievements = getUnlockedAchievements();

  return (
    <div className="relative">
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
           onClick={() => setShowAchievements(!showAchievements)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                Current Streak 
                {unlockedAchievements.length > 0 && (
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                    {unlockedAchievements.length} achievements
                  </span>
                )}
              </h3>
              <p className="text-2xl font-bold text-orange-600">{currentStreak} days 🔥</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-600">Longest Streak</p>
            <p className="font-semibold">{longestStreak} days</p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-orange-100">
          <p className="text-sm text-gray-600">Total Correct Answers</p>
          <p className="font-semibold text-lg">{totalCorrect}</p>
        </div>
      </div>

      {/* Achievements Popup */}
      {showAchievements && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Your Achievements</h3>
            <button 
              onClick={() => setShowAchievements(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(ACHIEVEMENTS_CONFIG).map(([key, config]) => {
              const unlocked = achievements.find(a => a.achievement_type === key) || 
                              (config.days && currentStreak >= config.days);
              
              return (
                <div 
                  key={key} 
                  className={`p-3 rounded-lg border ${unlocked ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 opacity-60'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${unlocked ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <span className="text-lg">{config.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{config.description}</p>
                      {config.days && (
                        <div className="mt-1">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${unlocked ? 'bg-green-500' : 'bg-orange-500'}`}
                              style={{ width: `${Math.min(100, (currentStreak / config.days) * 100)}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {currentStreak}/{config.days} days
                          </p>
                        </div>
                      )}
                      {!config.days && unlocked && (
                        <p className="text-xs text-green-600 mt-1">✓ Unlocked</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Progress Summary */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Achievement Progress</p>
                <p className="font-semibold">
                  {unlockedAchievements.length}/{Object.keys(ACHIEVEMENTS_CONFIG).length} unlocked
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Current Streak</p>
                <p className="font-bold text-lg text-orange-600">{currentStreak} days</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StreakDisplay;