import { Navigate } from "react-router-dom";
import { isAdminAuthenticated, isUserAuthenticated } from "../utils/auth";

const ProtectedRoute = ({ children, roleRequired }) => {
  if (roleRequired === "ADMIN") {
    return isAdminAuthenticated() ? children : <Navigate to="/login-admin" replace />;
  }

  if (roleRequired === "MEMBER") {
    return isUserAuthenticated() ? children : <Navigate to="/login-user" replace />;
  }

  return children;
};

export default ProtectedRoute;