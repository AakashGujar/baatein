/* eslint-disable no-unused-vars */
import { WavyBackground } from "./components/ui/wavy-background"; 
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";

export default function App() {
  return (
    <WavyBackground className="mx-auto">
      {/* <Login /> */}
      {/* <Signup/> */}
      <Home/>
    </WavyBackground>
  );
}
