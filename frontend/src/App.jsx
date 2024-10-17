/* eslint-disable no-unused-vars */
import { Navigate, Route, Routes } from "react-router-dom";
import { WavyBackground } from "./components/ui/wavy-background";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import { Toaster } from "./components/ui/sonner";
import { AuthContextProvider, useAuthContext } from "./context/authContext";
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

const App = () => {
  return (
    <AuthContextProvider>
      <SocketContextProvider>
        <WavyBackground className="mx-auto flex items-center justify-center">
          <AppRoutes />
          <Toaster />
        </WavyBackground>
      </SocketContextProvider>
    </AuthContextProvider>
  );
};

export default App;
