import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleRedirect = () => {
  const { role } = useAuth();

  console.log("ROLE REDIRECT:", role);

  if (role === "ADMIN") return <Navigate to="/admin" replace />;
  if (role === "PROVIDER") return <Navigate to="/provider" replace />;
  if (role === "USER") return <Navigate to="/user" replace />;

  return <Navigate to="/login" replace />;
};

export default RoleRedirect;
