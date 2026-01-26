// components/TechNews.tsx
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Globe, ExternalLink } from "lucide-react";

interface TechNewsProps {
  riddleCategory: string;
}

const TechNews = ({ riddleCategory }: TechNewsProps) => {
  const [techNews, setTechNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTechNews();
  }, [riddleCategory]);

  const fetchTechNews = async () => {
    try {
      setLoading(true);
      
      // First, try to get tech fact from your database based on category
      const { data: techFact } = await supabase
        .from('tech_facts')
        .select('*')
        .ilike('category', `%${riddleCategory}%`)
        .limit(1)
        .single();

      if (techFact) {
        setTechNews({
          title: techFact.title,
          description: techFact.content,
          image_url: techFact.image_url,
          source_url: techFact.source_url,
          type: 'fact'
        });
      } else {
        // Fallback to general tech facts if no category match
        const { data: generalFact } = await supabase
          .from('tech_facts')
          .select('*')
          .limit(1)
          .single();

        if (generalFact) {
          setTechNews({
            title: generalFact.title,
            description: generalFact.content,
            image_url: generalFact.image_url,
            source_url: generalFact.source_url,
            type: 'fact'
          });
        } else {
          // Last resort: Use pre-defined tech facts
          const fallbackNews = {
            title: "Latest in AI: GPT-4's capabilities expanding",
            description: "Researchers discover new applications for large language models in scientific research. The technology shows promise in accelerating discoveries across various fields including medicine, physics, and climate science.",
            image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
            source_url: "#",
            type: 'fallback'
          };
          setTechNews(fallbackNews);
        }
      }
    } catch (error) {
      console.error('Error fetching tech news:', error);
      
      // Use hardcoded tech facts as backup
      const techFacts = [
        {
          title: "Quantum Computing Breakthrough",
          description: "Scientists have made significant progress in quantum error correction, bringing us closer to practical quantum computers that could revolutionize fields from cryptography to drug discovery.",
          image_url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
          source_url: "#"
        },
        {
          title: "Neural Interface Technology",
          description: "New brain-computer interfaces are enabling paralyzed patients to communicate and control devices using only their thoughts, with accuracy rates improving dramatically in recent trials.",
          image_url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485",
          source_url: "#"
        },
        {
          title: "Sustainable Tech Innovations",
          description: "Researchers are developing carbon capture technologies that could help reverse climate change, with new materials showing promise for more efficient and cost-effective solutions.",
          image_url: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9",
          source_url: "#"
        }
      ];
      
      const randomFact = techFacts[Math.floor(Math.random() * techFacts.length)];
      setTechNews({ ...randomFact, type: 'backup' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="shadow-md border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Globe className="w-5 h-5 text-blue-500" />
            Tech Update
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading tech update...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md border-l-4 border-l-blue-500 animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Globe className="w-5 h-5 text-blue-500" />
          Tech/Sci-fi Insight
          {techNews?.type === 'fact' && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              Related to: {riddleCategory}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {techNews?.image_url && (
          <div className="relative w-full h-48 overflow-hidden rounded-lg">
            <img 
              src={techNews.image_url} 
              alt={techNews.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div>
          <h4 className="font-semibold text-lg mb-2">{techNews?.title}</h4>
          <p className="text-muted-foreground leading-relaxed">{techNews?.description}</p>
        </div>
        
        {techNews?.source_url && techNews.source_url !== "#" && (
          <div className="flex items-center gap-2 text-sm">
            <ExternalLink className="w-4 h-4" />
            <a 
              href={techNews.source_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Read more about this development
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { TechNews };