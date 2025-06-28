import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <nav className="w-full border-b border-gray-800 bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold tracking-tight flex items-center gap-1">
          <Link to="/" className="flex items-center space-x-1">
            <span className="text-white">H</span>
            <span className="text-indigo-500 font-extrabold">@</span>
            <span className="text-white">ck</span>
            <span className="text-indigo-500 font-extrabold">ollab</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-x-6 text-sm font-medium">
          <Link to="/" className="text-gray-400 hover:text-white transition">
            Landing
          </Link>

          {/* ✅ Updated path */}
          <Link
            to="/explore-projects"
            className="text-gray-400 hover:text-white transition"
          >
            Explore
          </Link>

          <Link
            to="/my-projects"
            className="text-gray-400 hover:text-white transition"
          >
            My Projects
          </Link>
          <Link
            to="/post-project"
            className="text-gray-400 hover:text-white transition"
          >
            Post Project
          </Link>
          <Link
            to="/messages"
            className="text-gray-400 hover:text-white transition"
          >
            Messages
          </Link>
          <Link
            to="/profile"
            className="text-gray-400 hover:text-white transition"
          >
            Profile
          </Link>

          {/* Auth Buttons */}
          {isSignedIn ? (
            <div className="ml-2">
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <div className="flex items-center gap-3 ml-4">
              <SignInButton mode="modal">
                <button className="px-4 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition text-sm font-semibold">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-1.5 rounded-md border border-gray-700 hover:border-indigo-500 hover:text-indigo-400 transition text-sm font-medium">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}