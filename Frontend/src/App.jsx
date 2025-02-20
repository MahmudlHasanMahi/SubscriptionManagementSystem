import React from "react";
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
const App = () => {
  return (
    <Routes>
      <Route path="/Signin" element={<SignIn />} />
      <Route path="/ChangePassword" element={<ChangePassword />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />}>
          <Route path="" element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="staff">
            <Route path="" element={<Staff />} />
            <Route path="add-staff" element={<AddStaffForm />} />
            <Route path="edit-staff/:staffId" element={<EditStaff />} />
          </Route>
          <Route path="subscription" element={<Body />} />
          <Route path="client" element={<Body />} />
          {/* <Route path="add-staff" element={<AddStaffForm />} /> */}
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
