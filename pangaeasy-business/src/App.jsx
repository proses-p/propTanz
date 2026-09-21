import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RedirectIfAuthenticated from "./components/auth/RedirectIfAuthenticated";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import OwnerVerification from "./pages/user/OwnerVerification";
import HostelRegistration from "./components/hostels/HostelRegistration";
import CreateHostel from "./components/hostels/CreateHostel";
import ApartmentManagement from "./pages/apartment/ApartmentManagement";
import ApartmentEditor from "./pages/apartment/ApartmentEditor";
import ApartmentDetails from "./pages/apartment/ApartmentDetails";
import { ROLE_USER } from "./constants/roles";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminHostelDetails from "./pages/hostel/AdminHostelDetails";
import AdminApartmentManagement from "./pages/apartment/AdminApartmentManagement";
import HostelManagement from "./pages/hostel/HostelManagement";
import OwnerRequests from "./pages/hostel/OwnerRequests";
import AdminLayout from "./layouts/AdminLayout";
import { ROLE_ADMIN } from "./constants/roles";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<RedirectIfAuthenticated><Login /></RedirectIfAuthenticated>} />
          <Route path="/register" element={<RedirectIfAuthenticated><Register /></RedirectIfAuthenticated>} />
          <Route path="/owner-verification" element={<ProtectedRoute roles={[ROLE_USER]}><OwnerVerification /></ProtectedRoute>} />
          <Route path="/hostel-registration" element={<ProtectedRoute roles={[ROLE_USER]}><HostelRegistration /></ProtectedRoute>} />
          <Route path="/hostel-registration/create" element={<ProtectedRoute roles={[ROLE_USER]}><CreateHostel /></ProtectedRoute>} />
          <Route path="/apartments" element={<ProtectedRoute roles={[ROLE_USER]}><ApartmentManagement /></ProtectedRoute>} />
          <Route path="/apartments/create" element={<ProtectedRoute roles={[ROLE_USER]}><ApartmentEditor /></ProtectedRoute>} />
          <Route path="/apartments/:id" element={<ProtectedRoute roles={[ROLE_USER]}><ApartmentDetails /></ProtectedRoute>} />
          <Route path="/apartments/:id/edit" element={<ProtectedRoute roles={[ROLE_USER]}><ApartmentEditor /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute roles={[ROLE_USER]}><Dashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute roles={ROLE_ADMIN}><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="hostels" element={<HostelManagement />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="owner-request" element={<OwnerRequests />} />
            <Route path="hostels/:id" element={<AdminHostelDetails />} />
            <Route path="apartments" element={<AdminApartmentManagement />} />
          </Route>
          <Route path="*" element={<ProtectedRoute roles={[ROLE_USER]}><HostelRegistration /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
      <ToastContainer />
    </BrowserRouter>
  );
}


export default App
