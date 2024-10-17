import { Navigate, Route, Routes } from "react-router-dom";
import { WavyBackground } from "./components/ui/wavy-background";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import { Toaster } from "./components/ui/sonner";
import { AuthContextProvider, useAuthContext } from "./context/AuthContext";
import { SocketContextProvider } from "./context/SocketContext";

const AppRoutes = () => {
  const { authUser } = useAuthContext();
  return (
    <Routes>
      <Route
        path="/"
        element={authUser ? <Home /> : <Navigate to={"/login"} />}
      />
      <Route
        path="/login"
        element={authUser ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/signup"
        element={authUser ? <Navigate to="/" /> : <Signup />}
      />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthContextProvider>
      <SocketContextProvider>
        <WavyBackground className="w-full h-full">
          <div className="w-full h-full flex items-center justify-center">
            <AppRoutes />
          </div>
        </WavyBackground>
        <Toaster />
      </SocketContextProvider>
    </AuthContextProvider>
  );
}