import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './Layout.jsx'
import Home from './Pages/Home.jsx'
import Profile from './Pages/Profile.jsx'
import Saved from './Pages/Saved.jsx'
import OutfitDetail from './Pages/OutfitDetail.jsx'
import { createPageUrl } from './utils.js'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path={createPageUrl("Home")} element={<Layout><Home /></Layout>} />
      <Route path={createPageUrl("Profile")} element={<Layout><Profile /></Layout>} />
      <Route path={createPageUrl("Saved")} element={<Layout><Saved /></Layout>} />
      <Route path={createPageUrl("OutfitDetail")} element={<Layout><OutfitDetail /></Layout>} />
    </Routes>
  )
}

export default App
