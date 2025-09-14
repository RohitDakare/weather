
import React, { useState, useEffect } from "react";
import { User } from "../entities/User";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Settings, Edit3, Sparkles, LogOut, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

import StyleQuiz from "../components/StyleQuiz";

// Placeholder for createPageUrl - assuming this is a global utility or imported elsewhere.
// Defined here to ensure the file is self-contained and functional.
const createPageUrl = (pageName) => {
  switch (pageName) {
    case 'Home':
      return '/';
    // Add other cases as needed by your application's routing
    default:
      return '/';
  }
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showStyleQuiz, setShowStyleQuiz] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    setLoading(true); // Moved setLoading(true) to the start
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      setUser(null); // Set user to null if not logged in or error occurs
      console.error("User not logged in:", error);
    }
    setLoading(false);
  };

  const handleUpdateProfile = async (profileData) => {
    try {
      await User.updateMyUserData(profileData);
      const updatedUser = await User.me();
      setUser(updatedUser);
      setEditing(false);
      setShowStyleQuiz(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await User.logout();
      setUser(null); // Clear user state
      navigate(createPageUrl('Home')); // Redirect to home page
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  
  const handleLogin = async () => {
    // Assuming User.login() handles the authentication flow (e.g., redirect to login provider, then back)
    await User.login();
    // After login, attempt to reload user data
    loadUser();
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="h-48 bg-white/50 rounded-2xl animate-pulse"></div>
        <div className="h-32 bg-white/50 rounded-2xl animate-pulse"></div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="p-4 text-center pt-20">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Join the Club!
        </h1>
        <p className="text-gray-600 mb-6">Log in to manage your profile, saved outfits, and style preferences.</p>
        <Button onClick={handleLogin} className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl px-8 py-3">
          <LogIn className="w-4 h-4 mr-2" />
          Login or Sign Up
        </Button>
      </div>
    )
  }

  if (showStyleQuiz) {
    return (
      <div className="p-4 pt-8">
        <StyleQuiz onComplete={handleUpdateProfile} />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Profile Header */}
      <Card className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0 shadow-xl">
        <CardContent className="p-6 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl font-bold">
              {user?.full_name?.[0]?.toUpperCase() || '👤'}
            </span>
          </div>
          <h2 className="text-xl font-bold mb-1">{user?.full_name || 'Fashion Lover'}</h2>
          <p className="text-sm opacity-90">{user?.email}</p>
          {user?.age && (
            <p className="text-sm opacity-90 mt-1">
              {user.age} years old • {user.lifestyle?.replace(/_/g, ' ')}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Style Profile */}
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-500" />
            Style Profile
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowStyleQuiz(true)}
            className="text-pink-600 hover:bg-pink-50"
          >
            <Edit3 className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {user?.style_preferences?.length > 0 ? (
            <>
              <div>
                <Label className="text-sm font-medium text-gray-600">Style Preferences</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {user.style_preferences.map((style, index) => (
                    <Badge key={index} className="bg-pink-100 text-pink-800 border-0">
                      {style.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>

              {user.color_preferences?.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Color Preferences</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.color_preferences.map((color, index) => (
                      <Badge key={index} className="bg-purple-100 text-purple-800 border-0">
                        {color.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {user.body_type && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Body Type</Label>
                  <p className="text-gray-800 mt-1 capitalize">
                    {user.body_type.replace(/_/g, ' ')}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Complete your style profile to get better recommendations!</p>
              <Button 
                onClick={() => setShowStyleQuiz(true)}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Complete Style Quiz
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Location */}
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <Label className="text-sm font-medium text-gray-600">Location</Label>
          <p className="text-gray-800 mt-1">📍 {user?.location || 'Not set'}</p>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6 space-y-4">
          <Button
            variant="outline"
            className="w-full justify-start text-gray-600 hover:bg-gray-50 rounded-xl"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings & Preferences
          </Button>
          
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 rounded-xl"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
