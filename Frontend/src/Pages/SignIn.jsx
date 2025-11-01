import SignInForm from "../Components/Forms/SignInForm/SignInForm";
import { IsAuthenticated, user } from "../Features/UserAuth/UserAuth";
import { useDispatch, useSelector } from "react-redux";
import { isLoading } from "../Features/UserAuth/UserAuth";
import { Navigate } from "react-router-dom";
import Loading from "../Components/Loading/Loading";
import { useEffect } from "react";
const SignIn = () => {
  const userState = useSelector(user);
  const loading = useSelector(isLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userState === null || !loading) {
      dispatch(IsAuthenticated());
    }
  }, []);

  if (userState) {
    return <Navigate to="/" />;
  } else if (loading) {
    return <Loading />;
  } else {
    return <SignInForm />;
  }
};

export default SignIn;
