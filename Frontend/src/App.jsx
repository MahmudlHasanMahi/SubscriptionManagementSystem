import "./style.css";
import { useEffect } from "react";
import SignIn from "./Pages/SignIn";
import Home from "./Pages/Home/Home";
import Invoice from "./Pages/Invoice";
import Body from "./Components/Body/Body";
import Staff from "./Components/Staff/Staff";
import { useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Client from "./Components/Client/Client";
import { Routes, Route } from "react-router-dom";
import Loading from "./Components/Loading/Loading";
import ProtectedRoute from "./Utils/ProtectedRoute";
import ChangePassword from "./Pages/ChangePassword";
import Plans from "./Components/Subscription/Plans";
import Dashboard from "./Components/Dashboard/Dashboard";
import Products from "./Components/Subscription/Products";
import EditProduct from "./Components/Forms/Product/EditProduct";
import Profile from "./Components/Forms/UserProfileForm/Profile";
import Subscription from "./Components/Subscription/Subscription";
import EditStaff from "./Components/Forms/StaffEditForm/EditStaff";
import Subscriptions from "./Components/Subscription/Subscriptions";
import AddStaffForm from "./Components/Forms/AddStaffForm/AddStaffForm";
import AddPriceForm from "./Components/Forms/AddPriceForm/AddPriceForm";
import AddClientForm from "./Components/Forms/AddClientForm/AddClientForm";
import CreateProductForm from "./Components/Forms/Product/CreateProductForm";
import SubscriptionForm from "./Components/Forms/SubscriptionForm/SubscriptionForm";
import EditSubscription from "./Components/Forms/EditSubscription/EditSubscription";
import { setLanguage } from "./Utils/ChangeLanguage";
const App = () => {
  const location = useLocation();
  useEffect(() => {
    setLanguage();
  }, []);
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
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
                <Route path="create-product" element={<CreateProductForm />}>
                  {/* <Route path="price" element={<AddPriceForm />} /> */}
                </Route>

                <Route
                  path="create-subscription"
                  element={<SubscriptionForm />}
                />
                <Route
                  path="edit-subscription/:subscriptionId"
                  element={<EditSubscription />}
                />
                <Route
                  path="edit-product/:productId"
                  element={<EditProduct />}
                />
                <Route element={<Subscription />}>
                  <Route path="" element={<Plans />} />
                  <Route path="invoice/:id" element={<Invoice />} />

                  <Route path="products" element={<Products />} />
                  <Route path="plans" element={<Subscriptions />} />
                </Route>
              </Route>
              <Route path="client">
                <Route path="" element={<Client />} />
                <Route path="add-client" element={<AddClientForm />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default App;
