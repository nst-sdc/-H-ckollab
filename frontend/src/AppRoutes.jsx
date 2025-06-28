import React from "react";
import { Routes, Route } from "react-router-dom";

// Layout
import Layout from "./layout/Layout";

// Pages
import Landing from "./pages/Landing";
import Explore from "./pages/Explore"; // This is ExploreProjects
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import CreateProfile from "./pages/CreateProfile";
import PostProjectPage from "./pages/PostProjectPage";

// Auth Pages
import SignInPage from "./components/SignIn";
import SignUpPage from "./components/SignUp";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes (outside layout) */}
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />

      {/* App Routes (wrapped with Layout) */}
      <Route
        path="/"
        element={
          <Layout>
            <Landing />
          </Layout>
        }
      />
      <Route
        path="/explore-projects" // ✅ Updated path
        element={
          <Layout>
            <Explore />
          </Layout>
        }
      />
      <Route
        path="/post-project"
        element={
          <Layout>
            <PostProjectPage />
          </Layout>
        }
      />
      <Route
        path="/messages"
        element={
          <Layout>
            <Messages />
          </Layout>
        }
      />
      <Route
        path="/profile"
        element={
          <Layout>
            <Profile />
          </Layout>
        }
      />
      <Route
        path="/create-profile"
        element={
          <Layout>
            <CreateProfile />
          </Layout>
        }
      />
    </Routes>
  );
}