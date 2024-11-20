import { Outlet } from "react-router-dom";
import "./App.css";
import LoginFrom from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Home from "./pages/Patient";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PatientForm from "./components/PatientForm";
import Login from "./pages/Login";
import { useDispatch, useSelector } from "react-redux";
import { tokenAction } from "./store/token";
import { useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import AppoinmentForm from "./components/AppoinmentForm";
import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import OtpInput from 'react-otp-input';


function App() {
  const navigate = useNavigate();
  const { tokenValue } = useSelector((store) => store.token);

  useEffect(() => {
    // Check if there's a last visited URL and the user is authenticated
    const lastVisitedUrl = localStorage.getItem("lastVisitedUrl");

    if (tokenValue && lastVisitedUrl) {
      // Redirect to last visited URL
      navigate(lastVisitedUrl, { replace: true });
      // Clear the last visited URL after redirect
      localStorage.removeItem("lastVisitedUrl");
    }
  }, [navigate, tokenValue]);
  const [otp, setOtp] = useState('');
  return (
    <>
      <Header />
      <Outlet />
      <Footer /> 
      

 
  {/* <OtpInput
    value={otp}
    onChange={setOtp}
    numInputs={4}
    renderSeparator={<span>-</span>}
    renderInput={(props) => <input {...props} />}
    
  /> */}



      {/* <Dashboard/>
        {/* <AppoinmentForm/> */}
      {/* <PatientForm/> */}
    </>
  );
}

export default App;
