// src/components/TechNewsSupabase.tsx
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, ExternalLink, Loader2, RefreshCw } from "lucide-react";

const TechNewsSupabase = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchTechNews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tech_news')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(10);

      if (!error && data && data.length > 0) {
        setNews(data);
      }
    } catch (error) {
      console.error('Error fetching tech news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechNews();
  }, []);

  if (loading) {
    return (
      <Card className="shadow-md border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-500 animate-pulse" />
            AI & Social Media Revolution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (news.length === 0) return null;

  const currentNews = news[currentIndex];

  return (
    <Card className="shadow-md border-l-4 border-l-purple-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Globe className="w-5 h-5 text-purple-500" />
            {currentNews.source_name || 'AI Revolution'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={fetchTechNews}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentNews.image_url && (
          <img 
            src={currentNews.image_url} 
            alt={currentNews.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        )}
        <h4 className="font-semibold text-lg">{currentNews.title}</h4>
        <p className="text-muted-foreground">{currentNews.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentIndex((currentIndex + 1) % news.length)}>
              Next →
            </Button>
          </div>
          {currentNews.source_url && (
            <a href={currentNews.source_url} target="_blank" className="text-blue-500 hover:underline text-sm">
              Read More
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TechNewsSupabase;