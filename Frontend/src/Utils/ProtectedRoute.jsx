import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { user } from "../Features/UserAuth/UserAuth";
const ProtectedRoute = () => {
  const location = useLocation();
  const userState = useSelector(user);

  return userState ? (
    <Outlet />
  ) : (
    <Navigate to="/Signin" state={{ prev: location.pathname }} />
  );
};

export default ProtectedRoute;
