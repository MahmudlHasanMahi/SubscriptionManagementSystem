import "./style.css";
import { useEffect } from "react";
import SignIn from "./Pages/SignIn";
import Home from "./Pages/Home/Home";
import Staff from "./Components/Staff/Staff";
import { useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Client from "./Components/Client/Client";
import { Routes, Route } from "react-router-dom";
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
import AddClientForm from "./Components/Forms/AddClientForm/AddClientForm";
import CreateProductForm from "./Components/Forms/Product/CreateProductForm";
import SubscriptionForm from "./Components/Forms/SubscriptionForm/SubscriptionForm";
import EditSubscription from "./Components/Forms/EditSubscription/EditSubscription";
import Invoice from "./Components/Invoice/Invoice";
import { useTranslation } from "react-i18next";
import CreateInvoice from "./Components/Invoice/CreateInvoice";
import EditInvoice from "./Components/Invoice/EditInvoice";

const App = () => {
  const location = useLocation();
  const { i18n } = useTranslation();
  useEffect(() => {
    document.body.dir = i18n.dir();
  }, [i18n, i18n.language]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/Signin" element={<SignIn />} />
        <Route path="/ChangePassword" element={<ChangePassword />} />
        <Route element={<ProtectedRoute />}>
          <Route path="" element={<Home />}>
            <Route path="" element={<Dashboard />} />
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
              <Route path="edit-product/:productId" element={<EditProduct />} />
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
            <Route path="invoice">
              <Route path="" element={<Invoice />} />
              <Route path="create-invoice" element={<CreateInvoice />} />
              <Route path="edit-invoice/:invoiceId" element={<EditInvoice />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default App;
