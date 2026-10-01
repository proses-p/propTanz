import { BrowserRouter, Routes, Route } from "react-router-dom";
// import HostelManagement from "./pages/hostel/HostelManagement";
import UserDashboard from "./pages/user/UserDashboard";
import TenantHostels from "./pages/user/TenantHostels";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import RedirectIfAuthenticated from "./components/auth/RedirectIfAuthenticated";
import ApartmentBrowse from "./pages/apartment/ApartmentBrowse";
<<<<<<< HEAD
import LandingPage from "./pages/LandingPage";
=======
import AdminApartmentManagement from "./pages/apartment/AdminApartmentManagement";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import UserProfile from "./pages/profile/UserProfile";

function HomeRedirect() {
  const { user } = useAuth();

  return <Navigate to={user?.role === ROLE_ADMIN ? "/admin" : "/dashboard"} replace />;
}
>>>>>>> 4cae21189161ddf1f548d75206f438cfb485b804

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<RedirectIfAuthenticated><Login /></RedirectIfAuthenticated>} />
          <Route path="/register" element={<RedirectIfAuthenticated><Register /></RedirectIfAuthenticated>} />

<<<<<<< HEAD
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/hostels/tenant" element={<TenantHostels /> } />
          <Route path="/apartments/browse" element={<ApartmentBrowse />} />
=======
          <Route path="/" element={<ProtectedRoute><HomeRedirect /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute roles={ROLE_ADMIN}><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="hostels" element={<HostelManagement />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="owner-request" element={<OwnerRequests />} />
            <Route path="hostels/:id" element={<AdminHostelDetails />} />
          </Route>
          <Route path="/apartments" element={<ProtectedRoute roles={[ROLE_ADMIN, ROLE_USER]}><ApartmentManagement /></ProtectedRoute>} />
          <Route path="/apartments/create" element={<ProtectedRoute roles={[ROLE_ADMIN, ROLE_USER]}><ApartmentEditor /></ProtectedRoute>} />
          <Route path="/apartments/:id" element={<ProtectedRoute roles={[ROLE_ADMIN, ROLE_USER]}><ApartmentDetails /></ProtectedRoute>} />
          <Route path="/apartments/:id/edit" element={<ProtectedRoute roles={[ROLE_ADMIN, ROLE_USER]}><ApartmentEditor /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute roles={[ROLE_ADMIN, ROLE_USER]}><UserProfile /></ProtectedRoute>} />
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
>>>>>>> 4cae21189161ddf1f548d75206f438cfb485b804
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;