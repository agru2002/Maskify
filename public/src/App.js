import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import SetAvatar from "./pages/SetAvatar";
import Posts from "./pages/Posts";
import Compose from "./pages/Compose";
import Profile from "./pages/Profile";
import LandingPage from "./pages/LandingPage";

function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/setAvatar" element={<SetAvatar />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/" element={<Posts />} />
        <Route path="/compose" element={<Compose />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/welcome" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
