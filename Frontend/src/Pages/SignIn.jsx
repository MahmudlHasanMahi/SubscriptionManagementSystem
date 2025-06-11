import { useEffect } from "react";
import SignInForm from "../Components/Forms/SignInForm/SignInForm";
import { useDispatch } from "react-redux";
import {
  IsAuthenticated,
  user,
  isLoading,
} from "../Features/UserAuth/UserAuth";
import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { updateNavbar } from "../Features/Navbar";
const SignIn = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const path = location.state ? location.state.prev : "dashboard";
  const userState = useSelector(user);
  const loading = useSelector(isLoading);

  useEffect(() => {
    dispatch(updateNavbar(path.split("/")[1]));
    if (!userState && loading) {
      dispatch(IsAuthenticated());
    }
  }, []);

  return userState ? <Navigate to={path} replace /> : <SignInForm />;
};

export default SignIn;
