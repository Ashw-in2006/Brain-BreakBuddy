import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, CheckCircle2, XCircle, Lightbulb } from "lucide-react";

interface RiddleCardProps {
  userId: string;
  language: string;
  onStreakUpdate: (userId: string) => void;
}

const RiddleCard = ({ userId, language, onStreakUpdate }: RiddleCardProps) => {
  const { toast } = useToast();
  const [riddle, setRiddle] = useState<any>(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [fact, setFact] = useState<any>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    fetchTodaysRiddle();
  }, [userId]);

  const fetchTodaysRiddle = async () => {
    const { data, error } = await supabase.rpc('get_daily_riddle', {
      user_id: userId,
      lang: language, 
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error fetching riddle",
        description: error.message,
      });
      return;
    }

    if (data?.riddle) {
      console.log("Riddle data received:", data.riddle); // Debug line
      setRiddle(data.riddle);
      
      // Check if user already answered today by checking last_answered_date
      const { data: profile } = await supabase
        .from('profiles')
        .select('last_answered_date')
        .eq('id', userId)
        .single();
      
      const today = new Date().toISOString().split('T')[0];
      const alreadyAnswered = profile?.last_answered_date === today;
      setAnswered(alreadyAnswered);
      
      if (alreadyAnswered) {
        setIsCorrect(null);
      }
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return;

    setLoading(true);
    const { data, error } = await supabase.rpc('submit_answer', {
      user_id: userId,
      riddle_id: riddle.id,
      user_answer: answer.trim(),
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error submitting answer",
        description: error.message,
      });
      setLoading(false);
      return;
    }

    setAnswered(true);
    setIsCorrect(data.is_correct);
    
    if (data.is_correct) {
      toast({
        title: "Correct! 🎉",
        description: `Correct answer: ${data.correct_answer}`,
      });
      onStreakUpdate(userId);
    } else {
      toast({
        variant: "destructive",
        title: "Not quite right",
        description: `The correct answer was: ${data.correct_answer}`,
      });
    }
    
    setLoading(false);
  };

  // FIXED: Better riddle text extraction
  const getRiddleText = () => {
  if (!riddle) return "";
  
  console.log("Current language:", language);
  console.log("Riddle object:", riddle);
  
  // Based on user's selected language preference
  switch (language) {
    case "ta": // Tamil (தமிழ்)
      return riddle.text_ta || riddle.text_en || riddle.question || "கேள்வி இல்லை";
    
    case "ta_en": // Tanglish (Tamil in English script)
      return riddle.text_ta_en || riddle.text_en || riddle.question || "Question illai";
    
    default: // English
      return riddle.text_en || riddle.question || "No question available";
  }
};

  // FIXED: Get category display
  const getCategory = () => {
    if (!riddle) return "";
    return riddle.category || riddle.difficulty || "General";
  };

  if (!riddle) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Today's Riddle
          </CardTitle>
          <CardDescription>Loading your daily challenge...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Today's Riddle
          </CardTitle>
          <CardDescription className="capitalize">{getCategory()}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed">{getRiddleText()}</p>
        </CardContent>
        {!answered && (
          <CardFooter className="flex flex-col gap-4">
            <div className="w-full space-y-2">
              <Label htmlFor="answer">Your Answer</Label>
              <Input
                id="answer"
                placeholder="Type your answer here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmitAnswer()}
              />
            </div>
            <Button
              onClick={handleSubmitAnswer}
              disabled={loading || !answer.trim()}
              className="w-full gradient-primary"
            >
              {loading ? "Checking..." : "Submit Answer"}
            </Button>
          </CardFooter>
        )}
        {answered && (
          <CardFooter>
            <div className="w-full space-y-2">
              {isCorrect ? (
                <div className="flex items-center gap-2 text-success p-3 rounded-lg bg-success/10">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">
                    Correct! The answer is: {riddle.answer || "A piano"}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-destructive p-3 rounded-lg bg-destructive/10">
                  <XCircle className="w-5 h-5" />
                  <span className="font-medium">
                    The correct answer was: {riddle.answer || "A piano"}
                  </span>
                </div>
              )}
            </div>
          </CardFooter>
        )}
      </Card>

      {answered && isCorrect && fact && (
        <Card className="shadow-md border-accent/50 animate-celebrate">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-accent" />
              Your Reward: Fun Fact!
            </CardTitle>
            <CardDescription className="capitalize">{fact.category}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed">{fact.fact_text}</p>
            {fact.source && (
              <p className="text-xs text-muted-foreground mt-2">Source: {fact.source}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RiddleCard;