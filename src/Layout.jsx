import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "./utils";
import { Home, User, Heart } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: createPageUrl("Home"), icon: Home },
    { name: "Profile", path: createPageUrl("Profile"), icon: User },
    { name: "Saved", path: createPageUrl("Saved"), icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <style>{`
        :root {
          --primary: #ff6b9d;
          --secondary: #a855f7;
          --accent: #06d6a0;
          --warm: #ffeaa7;
          --text: #2d3436;
          --text-light: #636e72;
          --card-bg: rgba(255, 255, 255, 0.95);
          --shadow: rgba(255, 107, 157, 0.1);
        }
      `}</style>
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Style Weather ❤
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto pb-20 min-h-screen">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-pink-100 z-50">
        <div className="max-w-md mx-auto px-4 py-2">
          <div className="flex justify-around items-center">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white transform scale-105' 
                      : 'text-gray-500 hover:text-pink-500 hover:bg-pink-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}