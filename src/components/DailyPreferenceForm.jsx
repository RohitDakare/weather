import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Sparkles, X } from "lucide-react";

export default function DailyPreferencesForm({ user, onGenerate, onCancel, isGenerating }) {
  const [occasion, setOccasion] = useState('casual');
  const [mood, setMood] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate({ occasion, mood });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm bg-white shadow-2xl animate-in fade-in-0 zoom-in-95">
        <form onSubmit={handleSubmit}>
          <CardHeader className="text-center">
            <CardTitle className="text-xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              How are you feeling today?
            </CardTitle>
            <p className="text-sm text-gray-500 pt-1">Tell us more for the perfect outfit!</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="occasion">What's the occasion?</Label>
              <Select value={occasion} onValueChange={setOccasion}>
                <SelectTrigger id="occasion">
                  <SelectValue placeholder="Select an occasion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="date">Date Night</SelectItem>
                  <SelectItem value="party">Party</SelectItem>
                  <SelectItem value="brunch">Brunch</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mood">Any specific vibe or color?</Label>
              <Input
                id="mood"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="e.g., comfy, powerful, vibrant colors"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl py-3 font-semibold"
            >
              {isGenerating ? (
                <>Generating...</>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate My Outfit
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              className="w-full text-gray-500"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}