import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/NavBar";
import Home from "./pages/Home";
import RouteRecommend from "./pages/RouteRecommend";
import Carpooling from "./pages/Carpooling";
import Redeem from "./pages/Redeem";
import Community from "./pages/Community";
import Footer from "./components/Footer";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Leaderboard from "./pages/Leaderboard";
import GeneralState from "./context/GeneralState";
import GiveRide from "./pages/GiveRide";
import AskForRide from "./pages/AskForRide";
import AvailableDrivers from "./pages/AvailableDrivers";
import Requests from "./pages/Requests";
import CarbonFootprint from './pages/CarbonFootprint';
import SmartParking from "./pages/SmartParking";
import { Toaster } from "react-hot-toast";
// TODO:
import DriverDashboard from "./pages/DriverDashboard";

// Custom component to control the visibility of Navbar and Footer
function NavigationControl() {
  const location = useLocation();
  const hideNavbarAndFooter =
    location.pathname === "/signup" || location.pathname === "/login";

  return (
    <React.Fragment>
      {!hideNavbarAndFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/route-recommendation" element={<RouteRecommend />} />
        <Route path="/car-pooling" element={<Carpooling />} />
        <Route path="/car-pooling/giveride" element={<GiveRide />} />
        <Route path="/car-pooling/askforride" element={<AskForRide />} />
        <Route
          path="/car-pooling/askforride/availabledrivers"
          element={<AvailableDrivers />}
        />
        <Route path="/redeem" element={<Redeem />} />
        <Route path="/community" element={<Community />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/carbon-footprint" element={<CarbonFootprint />} />
        <Route path="/smart-parking" element={<SmartParking />} />
        <Route path="/driver/dashboard" element={<DriverDashboard />} />
      </Routes>
      {!hideNavbarAndFooter && <Footer />}
    </React.Fragment>
  );
}

function App() {
  const createToast = {
    success: {
      theme: {
        primary: "#09fcf6",
      },
    },
  };
  return (
    <GeneralState>
      <Toaster position="top-center" toastOptions={createToast}></Toaster>
      <NavigationControl />
    </GeneralState>
  );
}

export default App;
