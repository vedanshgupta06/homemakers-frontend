import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {
  const { token, role } = useAuth();

  // Not logged in → login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role → redirect to correct dashboard
  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "USER") return <Navigate to="/user" replace />;
    if (role === "PROVIDER") return <Navigate to="/provider" replace />;
    if (role === "ADMIN") return <Navigate to="/admin" replace />;
  }

  // Authorized
  return children;
}

export default ProtectedRoute;
