import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { ROLE_ADMIN } from "../../constants/roles";

export default function RedirectIfAuthenticated({ children }) {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) return null;

  if (isAuthenticated) {
    return <Navigate to={user?.role === ROLE_ADMIN ? "/admin" : "/dashboard"} replace />;
  }

  return children;
}
