import { useEffect } from "react";
import SignInForm from "../Components/Forms/SignInForm/SignInForm";
import { useDispatch } from "react-redux";
import { IsAuthenticated } from "../Features/UserAuth/UserAuth";
import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { updateNavbar } from "../Features/Navbar";
const SignIn = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const path = location.state ? location.state.prev : "dashboard";
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(updateNavbar(path.split("/")[1]));
    dispatch(IsAuthenticated());
  }, []);

  return user ? <Navigate to={path} /> : <SignInForm />;
};

export default SignIn;
