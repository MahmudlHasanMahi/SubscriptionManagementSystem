import { Routes, Route, Switch } from "react-router-dom";
import SignIn from "./Pages/SignIn";
import ProtectedRoute from "./Utils/ProtectedRoute";
import ChangePassword from "./Pages/ChangePassword";
import "./style.css";
import Home from "./Pages/Home/Home";
import Body from "./Components/Body/Body";
import Loading from "./Components/Loading/Loading";
import Dashboard from "./Components/Dashboard/Dashboard";
import Staff from "./Components/Staff/Staff";
import AddStaffForm from "./Components/Forms/AddStaffForm/AddStaffForm";
import EditStaff from "./Components/Forms/StaffEditForm/EditStaff";
import Profile from "./Components/Forms/UserProfileForm/Profile";
import Subscription from "./Components/Subscription/Subscription";
import Products from "./Components/Subscription/Products";
import Plans from "./Components/Subscription/Plans";
import CreateProductForm from "./Components/Forms/Product/CreateProductForm";
import EditProduct from "./Components/Forms/Product/EditProduct";
import Subscriptions from "./Components/Subscription/Subscriptions";
import SubscriptionForm from "./Components/Forms/SubscriptionForm/SubscriptionForm";

const App = () => {
  return (
    <Routes>
      <Route element={<Loading />}>
        <Route path="/Signin" element={<SignIn />} />
        <Route path="/ChangePassword" element={<ChangePassword />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />}>
            <Route path="" element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="staff">
              <Route path="" element={<Staff />} />
              <Route path="add-staff" element={<AddStaffForm />} />
              <Route path="edit-staff/:staffId" element={<EditStaff />} />
            </Route>
            <Route path="subscription">
              <Route path="create-product" element={<CreateProductForm />} />
              <Route
                path="create-subscription"
                element={<SubscriptionForm />}
              />
              <Route path="edit-product/:productId" element={<EditProduct />} />
              <Route element={<Subscription />}>
                <Route path="" element={<Subscriptions />} />
                <Route path="products" element={<Products />} />
                <Route path="plans" element={<Plans />} />
              </Route>
            </Route>
            <Route path="client" element={<Body />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
