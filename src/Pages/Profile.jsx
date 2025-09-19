import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../entities/User';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Sparkles, Edit3, LogOut, Settings } from 'lucide-react';

export function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showStyleQuiz, setShowStyleQuiz] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await User.logout();
      navigate('/');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      {/* Profile Header */}
      <Card className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0 shadow-xl">
        <CardContent className="p-6 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl font-bold">
              {user?.name?.[0]?.toUpperCase() || '👤'}
            </span>
          </div>
          <h2 className="text-xl font-bold mb-1">{user?.name || 'Fashion Lover'}</h2>
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