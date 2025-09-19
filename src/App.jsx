import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import OutfitDetail from './Pages/OutfitDetail';
import Saved from './Pages/Saved';
import { Profile } from './Pages/Profile';  // Changed to named import
import Layout from './Layout';
import LoginSignup from './Pages/LoginSignup';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/home" element={<Layout><Home /></Layout>} />
      <Route path="/outfitdetail" element={<Layout><OutfitDetail /></Layout>} />
      <Route path="/saved" element={<Layout><Saved /></Layout>} />
      <Route path="/profile" element={<Layout><Profile /></Layout>} />
      <Route path="/login" element={<Layout><LoginSignup /></Layout>} />
    </Routes>
  );
}

export default App;
