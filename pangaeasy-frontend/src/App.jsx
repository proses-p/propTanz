import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import RedirectIfAuthenticated from "./components/auth/RedirectIfAuthenticated";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import LandingPage from "./pages/LandingPage";
import UserDashboard from "./pages/user/UserDashboard";
import TenantHostels from "./pages/user/TenantHostels";
import ApartmentBrowse from "./pages/apartment/ApartmentBrowse";
import CreateHostel from "./pages/hostel/CreateHostel";
import UserProfile from "./pages/profile/UserProfile";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<RedirectIfAuthenticated><Login /></RedirectIfAuthenticated>} />
          <Route path="/register" element={<RedirectIfAuthenticated><Register /></RedirectIfAuthenticated>} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/hostels/tenant" element={<TenantHostels />} />
          <Route path="/apartments/browse" element={<ApartmentBrowse />} />
          <Route path="/hostel-registration/create" element={<CreateHostel />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;