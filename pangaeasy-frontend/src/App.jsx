import { BrowserRouter, Routes, Route } from "react-router-dom";
// import HostelManagement from "./pages/hostel/HostelManagement";
import UserDashboard from "./pages/user/UserDashboard";
import TenantHostels from "./pages/user/TenantHostels";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import RedirectIfAuthenticated from "./components/auth/RedirectIfAuthenticated";
import ApartmentBrowse from "./pages/apartment/ApartmentBrowse";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<RedirectIfAuthenticated><Login /></RedirectIfAuthenticated>} />
          <Route path="/register" element={<RedirectIfAuthenticated><Register /></RedirectIfAuthenticated>} />

          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/hostels/tenant" element={<TenantHostels /> } />
          <Route path="/apartments/browse" element={<ApartmentBrowse />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;