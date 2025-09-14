
import React, { useState, useEffect } from "react";
import { User } from "../entities/User";
import { Outfit } from "../entities/Outfit";
import { SavedOutfit } from "../entities/SavedOutfit";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Heart, Bookmark, LogIn } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Button } from "../components/ui/button";

export default function SavedPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [savedOutfits, setSavedOutfits] = useState([]);
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedOutfits();
  }, []);

  const loadSavedOutfits = async () => {
    setLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const saved = await SavedOutfit.filter({ user_id: currentUser.id });
      setSavedOutfits(saved);

      if (saved.length > 0) {
        const outfitIds = saved.map(s => s.outfit_id);
        const outfitPromises = outfitIds.map(id => Outfit.get(id));
        const outfitData = await Promise.all(outfitPromises);
        setOutfits(outfitData.filter(Boolean));
      } else {
        setOutfits([]); // Clear outfits if no saved items
      }

    } catch (error) {
      setUser(null);
      console.error("User not logged in:", error);
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    await User.login();
  };

  const likedOutfits = outfits.filter(outfit => {
    const save = savedOutfits.find(s => s.outfit_id === outfit.id);
    return save?.is_liked;
  });

  const bookmarkedOutfits = outfits.filter(outfit => {
    const save = savedOutfits.find(s => s.outfit_id === outfit.id);
    return save?.is_saved;
  });

  const OutfitGrid = ({ outfitList, emptyMessage }) => (
    <div className="space-y-4">
      {outfitList.length > 0 ? (
        outfitList.map((outfit) => (
          <Card 
            key={outfit.id}
            className="bg-white/95 backdrop-blur-sm border-0 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300"
            onClick={() => navigate(createPageUrl(`OutfitDetail?id=${outfit.id}`))}
          >
            <CardContent className="p-4">
              <div className="flex space-x-4">
                {outfit.image_url && (
                  <img 
                    src={outfit.image_url} 
                    alt={outfit.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 mb-1 truncate">
                    {outfit.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {outfit.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {outfit.style_tags?.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-pink-100 text-pink-800">
                        {tag}
                      </Badge>
                    ))}
                    <Badge className="text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
                      {outfit.weather_condition}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-white/50 rounded-2xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 text-center pt-20">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
          See Your Saved Looks
        </h1>
        <p className="text-gray-600 mb-6">Log in to view your liked and saved outfits.</p>
        <Button onClick={handleLogin} className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl px-8 py-3">
          <LogIn className="w-4 h-4 mr-2" />
          Login or Sign Up
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Your Saved Looks ✨
        </h1>
        <p className="text-gray-600 text-sm">
          All your favorite outfits in one place
        </p>
      </div>

      <Tabs defaultValue="liked" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 rounded-xl">
          <TabsTrigger 
            value="liked" 
            className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
          >
            <Heart className="w-4 h-4 mr-2" />
            Liked ({likedOutfits.length})
          </TabsTrigger>
          <TabsTrigger 
            value="saved"
            className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
          >
            <Bookmark className="w-4 h-4 mr-2" />
            Saved ({bookmarkedOutfits.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="liked">
          <OutfitGrid 
            outfitList={likedOutfits}
            emptyMessage="No liked outfits yet. Start exploring and like outfits you love! 💕"
          />
        </TabsContent>

        <TabsContent value="saved">
          <OutfitGrid 
            outfitList={bookmarkedOutfits}
            emptyMessage="No saved outfits yet. Save outfits to try them later! 📌"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
