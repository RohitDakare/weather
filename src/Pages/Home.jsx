import React, { useState, useEffect } from "react";
import { User } from "../entities/User";
import { Outfit } from "../entities/Outfit";
import { SavedOutfit } from "../entities/SavedOutfit";
import { InvokeLLM, GenerateImage } from "../integrations/Core";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";
import { RefreshCw, Sparkles, LogIn } from "lucide-react";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";

import WeatherWidget from "../components/WeatherWidget";
import OutfitCard from "../components/OutfitCard";
import StyleQuiz from "../components/StyleQuiz";
import DailyPreferencesForm from "../components/DailyPreferenceForm";

export default function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentOutfit, setCurrentOutfit] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [savedOutfits, setSavedOutfits] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showPrefsForm, setShowPrefsForm] = useState(false);



  const generateTodaysOutfit = async (dailyPrefs) => {
    if (!user || !weather || !dailyPrefs) return;
    
    setGenerating(true);
    setShowPrefsForm(false);
    try {
      const prompt = `Create a stylish outfit recommendation for a ${user.age}-year-old woman with these preferences:
      - Style: ${user.style_preferences?.join(', ')}
      - Body type: ${user.body_type}
      - Colors: ${user.color_preferences?.join(', ')}
      - Lifestyle: ${user.lifestyle}
      - Today's Occasion: ${dailyPrefs.occasion}
      - Today's Mood/Vibe: ${dailyPrefs.mood}
      - Weather: ${weather.condition}, ${weather.temperature}°F
      
      Create a trendy, Instagram-worthy outfit that's perfect for today's weather and her style.`;

      const outfitData = await InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            pieces: {
              type: "array",
              items: {
                type: "object", 
                properties: {
                  category: { type: "string" },
                  item: { type: "string" },
                  color: { type: "string" }
                }
              }
            },
            style_tags: { type: "array", items: { type: "string" } },
            why_this_outfit: { type: "string" }
          }
        }
      });

      // Generate outfit image
      const imagePrompt = `Fashion photography of a complete outfit: ${outfitData.description}. Centered, full body shot on a stylish young woman. Clean, aesthetic background.`;
      const { url: imageUrl } = await GenerateImage({ prompt: imagePrompt });

      const newOutfit = await Outfit.create({
        ...outfitData,
        weather_condition: weather.condition,
        temperature_range: `${weather.temperature}°F`,
        occasion: dailyPrefs.occasion,
        image_url: imageUrl
      });

      setCurrentOutfit(newOutfit);
      
    } catch (error) {
      console.error("Error generating outfit:", error);
    }
    setGenerating(false);
  };

  const handleQuizComplete = async (quizAnswers) => {
    try {
      await User.updateMyUserData(quizAnswers);
      const updatedUser = await User.me();
      setUser(updatedUser);
      setShowQuiz(false);
    } catch (error) {
      console.error("Error updating user preferences:", error);
    }
  };

  const handleLikeOutfit = async () => {
    if (!currentOutfit || !user) return;
    
    try {
      const existingSave = savedOutfits.find(s => s.outfit_id === currentOutfit.id);
      
      if (existingSave) {
        await SavedOutfit.update(existingSave.id, {
          ...existingSave,
          is_liked: !existingSave.is_liked
        });
      } else {
        await SavedOutfit.create({
          user_id: user.id,
          outfit_id: currentOutfit.id,
          is_liked: true,
          is_saved: false
        });
      }
      
      const updated = await SavedOutfit.filter({ user_id: user.id });
      setSavedOutfits(updated);
      
    } catch (error) {
      console.error("Error liking outfit:", error);
    }
  };

  const handleSaveOutfit = async () => {
    if (!currentOutfit || !user) return;
    
    try {
      const existingSave = savedOutfits.find(s => s.outfit_id === currentOutfit.id);
      
      if (existingSave) {
        await SavedOutfit.update(existingSave.id, {
          ...existingSave,
          is_saved: !existingSave.is_saved
        });
      } else {
        await SavedOutfit.create({
          user_id: user.id,
          outfit_id: currentOutfit.id,
          is_liked: false,
          is_saved: true
        });
      }
      
      const updated = await SavedOutfit.filter({ user_id: user.id });
      setSavedOutfits(updated);
      
    } catch (error) {
      console.error("Error saving outfit:", error);
    }
  };
  
const handleLogin = async () => {
  try {
    await User.login();
  } catch (error) {
    console.error('Login error:', error.message);
  }
};

useEffect(() => {
  const loadUser = async () => {
    setLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      if (!currentUser || !currentUser.style_preferences || currentUser.style_preferences.length === 0) {
        setShowQuiz(true);
      } else {
        const saved = await SavedOutfit.filter({ user_id: currentUser.id });
        setSavedOutfits(saved);
      }
    } catch (error) {
      setUser(null);
    }
    setLoading(false);
  };

  const authListener = supabase.auth.onAuthStateChange(
    (event, session) => {
      if (event === 'SIGNED_IN') {
        loadUser();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    }
  );

  loadUser();

  return () => authListener.data.subscription?.unsubscribe();
}, []);

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="h-32 bg-white/50 rounded-2xl animate-pulse"></div>
        <div className="h-96 bg-white/50 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 text-center pt-20">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Welcome to Style Weather ❤
        </h1>
        <p className="text-gray-600 mb-6">Log in to get personalized daily outfit ideas based on your local weather.</p>
        <Button onClick={() => navigate('/login')} className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl px-8 py-3">
          <LogIn className="w-4 h-4 mr-2" />
          Login or Sign Up
        </Button>
      </div>
    );
  }

  if (showQuiz) {
    return (
      <div className="p-4 pt-8">
        <StyleQuiz onComplete={handleQuizComplete} />
      </div>
    );
  }

  const currentSave = savedOutfits.find(s => s.outfit_id === currentOutfit?.id);

  return (
    <div className="p-4 space-y-6">
      {showPrefsForm && (
        <DailyPreferencesForm 
          user={user} 
          onGenerate={generateTodaysOutfit}
          onCancel={() => setShowPrefsForm(false)}
          isGenerating={generating}
        />
      )}

      <WeatherWidget onWeatherData={setWeather} />

      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Sparkles className="w-5 h-5 text-pink-500" />
          <h2 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Today's Perfect Outfit
          </h2>
          <Sparkles className="w-5 h-5 text-purple-500" />
        </div>
        
        {generating && (
          <div className="text-center py-8">
            <RefreshCw className="w-6 h-6 mx-auto animate-spin text-pink-500 mb-4" />
            <p className="text-gray-500">Finding the perfect look for you...</p>
          </div>
        )}

        {!generating && currentOutfit && (
          <OutfitCard 
            outfit={currentOutfit}
            onLike={handleLikeOutfit}
            onSave={handleSaveOutfit}
            isLiked={currentSave?.is_liked || false}
            isSaved={currentSave?.is_saved || false}
            onClick={() => navigate(createPageUrl(`OutfitDetail?id=${currentOutfit.id}`))}
          />
        )}

        {!generating && (
          <Button 
            onClick={() => setShowPrefsForm(true)}
            disabled={!weather}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl px-6"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {currentOutfit ? 'Try Another Look' : 'Get My Outfit'}
          </Button>
        )}
      </div>

      {!weather && (
        <Alert>
          <AlertDescription>
            Getting weather data... If this persists, please check your browser's location permissions.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}