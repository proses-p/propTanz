import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { ROLE_ADMIN } from "../../constants/roles";

export default function ProtectedRoute({ children, roles }) {
  const { loading, isAuthenticated, hasRole } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (roles && !hasRole(roles)) {
    return <Navigate to={hasRole(ROLE_ADMIN) ? "/admin" : "/dashboard"} replace />;
  }

  return children ? children : <Outlet />;
}
