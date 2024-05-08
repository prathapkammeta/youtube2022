import { Route, Routes, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import "./App.css";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import { Toaster } from "react-hot-toast";

function App() {
  const { authUser } = useContext(AuthContext);

  return (
    <div className="p-4 h-screen flex items-center justify-center">
      <Routes>
        {/* Protect the home route */}
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/login" />}
        />
        {/* Redirect to home if user is authenticated */}
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" /> : <Login />}
        />
        {/* Redirect to home if user is authenticated */}
        <Route
          path="/signup"
          element={authUser ? <Navigate to="/" /> : <SignUp />}
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
