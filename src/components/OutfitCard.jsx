import React from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Heart, Bookmark, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function OutfitCard({ outfit, onLike, onSave, isLiked, isSaved, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        className="overflow-hidden bg-white/95 backdrop-blur-sm shadow-xl border-0 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
        onClick={onClick}
      >
        <div className="relative">
          {outfit.image_url && (
            <img 
              src={outfit.image_url} 
              alt={outfit.title}
              className="w-full h-64 object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute top-4 right-4">
            <Badge className="bg-white/90 text-gray-800 border-0 shadow-md">
              <Sparkles className="w-3 h-3 mr-1" />
              Perfect Match
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{outfit.title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{outfit.description}</p>
          
          {outfit.style_tags && (
            <div className="flex flex-wrap gap-2 mb-4">
              {outfit.style_tags.slice(0, 3).map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="bg-pink-100 text-pink-800 text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {outfit.why_this_outfit && (
            <p className="text-sm text-gray-500 italic mb-4">
              💡 {outfit.why_this_outfit}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex space-x-3">
              <Button
                variant="ghost" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onLike && onLike();
                }}
                className={`hover:bg-red-50 transition-colors ${
                  isLiked ? 'text-red-500 hover:text-red-600' : 'text-gray-400'
                }`}
              >
                <Heart className={`w-5 h-5 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm">Like</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  onSave && onSave();
                }}
                className={`hover:bg-purple-50 transition-colors ${
                  isSaved ? 'text-purple-500 hover:text-purple-600' : 'text-gray-400'
                }`}
              >
                <Bookmark className={`w-5 h-5 mr-1 ${isSaved ? 'fill-current' : ''}`} />
                <span className="text-sm">Save</span>
              </Button>
            </div>
            
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
              {outfit.weather_condition}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}