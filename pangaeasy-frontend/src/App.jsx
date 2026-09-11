import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HostelManagement from "./pages/hostel/HostelManagement";
import UserDashboard from "./pages/user/UserDashboard";
import TenantHostels from "./pages/user/TenantHostels";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import RedirectIfAuthenticated from "./components/auth/RedirectIfAuthenticated";
import useAuth from "./hooks/useAuth";
import { ROLE_ADMIN, ROLE_USER } from "./constants/roles";
import OwnerVerification from "./pages/user/OwnerVerification";
import OwnerRequests from "./pages/hostel/OwnerRequests";
import HostelRegistration from "./pages/hostel/HostelRegistration";
import CreateHostel from "./pages/hostel/CreateHostel";
import AdminHostelDetails from "./pages/hostel/AdminHostelDetails";
import ApartmentManagement from "./pages/apartment/ApartmentManagement";
import ApartmentEditor from "./pages/apartment/ApartmentEditor";
import ApartmentDetails from "./pages/apartment/ApartmentDetails";
import ApartmentBrowse from "./pages/apartment/ApartmentBrowse";
import AdminApartmentManagement from "./pages/apartment/AdminApartmentManagement";

function HomeRedirect() {
  const { user } = useAuth();

  return <Navigate to={user?.role === ROLE_ADMIN ? "/admin" : "/dashboard"} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<RedirectIfAuthenticated><Login /></RedirectIfAuthenticated>} />
          <Route path="/register" element={<RedirectIfAuthenticated><Register /></RedirectIfAuthenticated>} />

          <Route path="/" element={<ProtectedRoute><HomeRedirect /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute roles={ROLE_ADMIN}><HostelManagement /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute roles={[ROLE_USER]}><UserDashboard /></ProtectedRoute>} />
          <Route path="/hostel-management" element={<ProtectedRoute><HostelManagement /></ProtectedRoute>} />
          <Route path="/hostels/tenant" element={<ProtectedRoute roles={[ROLE_USER]}><TenantHostels /></ProtectedRoute>} />
          <Route path="/user/hostels" element={<ProtectedRoute roles={ROLE_USER}><TenantHostels /></ProtectedRoute>} />
          <Route path="/owner-verification" element={<ProtectedRoute roles={[ROLE_USER]}><OwnerVerification /></ProtectedRoute>} />
          <Route path="/apartments/browse" element={<ProtectedRoute roles={[ROLE_USER]}><ApartmentBrowse /></ProtectedRoute>} />
          <Route path="/admin/owner-request" element={<ProtectedRoute roles={[ROLE_ADMIN]}><OwnerRequests/></ProtectedRoute>}/>
          <Route path="/admin/apartments" element={<ProtectedRoute roles={[ROLE_ADMIN]}><AdminApartmentManagement /></ProtectedRoute>} />
          <Route path="/hostel-registration" element={<ProtectedRoute roles={[ROLE_ADMIN, ROLE_USER]}><HostelRegistration/></ProtectedRoute>}/>
          <Route path="/hostel-registration/create" element={<ProtectedRoute roles={[ROLE_ADMIN, ROLE_USER]}><CreateHostel/></ProtectedRoute>} />
          <Route path="/admin/hostels/:id" element={<ProtectedRoute roles={[ROLE_ADMIN]}><AdminHostelDetails/></ProtectedRoute>}/>
          <Route path="/apartments" element={<ProtectedRoute roles={[ROLE_ADMIN, ROLE_USER]}><ApartmentManagement /></ProtectedRoute>} />
          <Route path="/apartments/create" element={<ProtectedRoute roles={[ROLE_ADMIN, ROLE_USER]}><ApartmentEditor /></ProtectedRoute>} />
          <Route path="/apartments/:id/edit" element={<ProtectedRoute roles={[ROLE_ADMIN, ROLE_USER]}><ApartmentEditor /></ProtectedRoute>} />
          <Route path="/apartments/:id" element={<ProtectedRoute roles={[ROLE_ADMIN, ROLE_USER]}><ApartmentDetails /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;