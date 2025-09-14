import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Outfit } from "../entities/Outfit";
import { SavedOutfit } from "../entities/SavedOutfit";
import { User } from "../entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Heart, Bookmark, Share2, Sparkles, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

export default function OutfitDetailPage() {
  const navigate = useNavigate();
  const [outfit, setOutfit] = useState(null);
  const [user, setUser] = useState(null);
  const [savedOutfit, setSavedOutfit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const outfitId = urlParams.get('id');
    
    if (outfitId) {
      loadOutfitDetail(outfitId);
    } else {
      navigate(-1);
    }
  }, [navigate]);

  const loadOutfitDetail = async (outfitId) => {
    try {
      const [outfitData, currentUser] = await Promise.all([
        Outfit.get(outfitId),
        User.me()
      ]);
      
      setOutfit(outfitData);
      setUser(currentUser);

      // Check if outfit is saved/liked
      const saved = await SavedOutfit.filter({ 
        user_id: currentUser.id, 
        outfit_id: outfitId 
      });
      setSavedOutfit(saved[0] || null);

    } catch (error) {
      console.error("Error loading outfit detail:", error);
    }
    setLoading(false);
  };

  const handleLike = async () => {
    if (!outfit || !user) return;
    
    try {
      if (savedOutfit) {
        await SavedOutfit.update(savedOutfit.id, {
          ...savedOutfit,
          is_liked: !savedOutfit.is_liked
        });
        setSavedOutfit({ ...savedOutfit, is_liked: !savedOutfit.is_liked });
      } else {
        const newSaved = await SavedOutfit.create({
          user_id: user.id,
          outfit_id: outfit.id,
          is_liked: true,
          is_saved: false
        });
        setSavedOutfit(newSaved);
      }
    } catch (error) {
      console.error("Error liking outfit:", error);
    }
  };

  const handleSave = async () => {
    if (!outfit || !user) return;
    
    try {
      if (savedOutfit) {
        await SavedOutfit.update(savedOutfit.id, {
          ...savedOutfit,
          is_saved: !savedOutfit.is_saved
        });
        setSavedOutfit({ ...savedOutfit, is_saved: !savedOutfit.is_saved });
      } else {
        const newSaved = await SavedOutfit.create({
          user_id: user.id,
          outfit_id: outfit.id,
          is_liked: false,
          is_saved: true
        });
        setSavedOutfit(newSaved);
      }
    } catch (error) {
      console.error("Error saving outfit:", error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${outfit.title} - Style Weather`,
          text: outfit.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="h-64 bg-white/50 rounded-2xl animate-pulse"></div>
        <div className="h-48 bg-white/50 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  if (!outfit) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">Outfit not found</p>
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="mt-4"
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="sticky top-16 bg-gradient-to-b from-rose-50 to-transparent z-40 p-4 pb-2">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            className="rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white"
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="px-4 space-y-6">
        {/* Outfit Image */}
        {outfit.image_url && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <img
              src={outfit.image_url}
              alt={outfit.title}
              className="w-full aspect-square object-cover rounded-2xl shadow-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
          </motion.div>
        )}

        {/* Outfit Info */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl mb-2">{outfit.title}</CardTitle>
                <p className="text-gray-600">{outfit.description}</p>
              </div>
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 ml-4">
                {outfit.weather_condition}
              </Badge>
            </div>
            
            {outfit.style_tags && (
              <div className="flex flex-wrap gap-2 mt-4">
                {outfit.style_tags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="bg-pink-100 text-pink-800 border-0"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardHeader>
        </Card>

        {/* Why This Outfit */}
        {outfit.why_this_outfit && (
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="bg-yellow-400 p-2 rounded-full flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Why This Outfit?</h3>
                  <p className="text-gray-700 text-sm">{outfit.why_this_outfit}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Outfit Pieces */}
        {outfit.pieces && outfit.pieces.length > 0 && (
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-purple-500" />
                Outfit Pieces
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {outfit.pieces.map((piece, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{piece.item}</p>
                      <p className="text-sm text-gray-600 capitalize">
                        {piece.category} {piece.color && `• ${piece.color}`}
                      </p>
                    </div>
                    {piece.optional && (
                      <Badge variant="outline" className="text-xs">
                        Optional
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handleLike}
            variant={savedOutfit?.is_liked ? "default" : "outline"}
            className={`flex-1 rounded-xl py-3 transition-all duration-300 ${
              savedOutfit?.is_liked 
                ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white' 
                : 'border-red-200 text-red-600 hover:bg-red-50'
            }`}
          >
            <Heart className={`w-5 h-5 mr-2 ${savedOutfit?.is_liked ? 'fill-current' : ''}`} />
            {savedOutfit?.is_liked ? 'Liked' : 'Like'}
          </Button>
          
          <Button
            onClick={handleSave}
            variant={savedOutfit?.is_saved ? "default" : "outline"}
            className={`flex-1 rounded-xl py-3 transition-all duration-300 ${
              savedOutfit?.is_saved 
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white' 
                : 'border-purple-200 text-purple-600 hover:bg-purple-50'
            }`}
          >
            <Bookmark className={`w-5 h-5 mr-2 ${savedOutfit?.is_saved ? 'fill-current' : ''}`} />
            {savedOutfit?.is_saved ? 'Saved' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
}