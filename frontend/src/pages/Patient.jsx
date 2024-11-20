import Header from "../components/Header";
import Footer from "../components/Footer";
import homei from "../assets/images/homeimage.png";
import { useEffect } from "react";
import axios from "axios";
import logo from "../assets/logo-full.svg";
import { Navigate, Outlet, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../store/user";
import { tokenAction } from "../store/token";
import { toast } from "react-toastify";
import Dashboard from "./Dashboard";
import { useState } from "react";


export default function Patient() {
  const naviaget = useNavigate();
  const dispatch = useDispatch();


  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3000/patient-dashboard", {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        toast.success(`Welcome ${res.data.user.username}....`);
        dispatch(userActions.storeUser(res.data.user));
        

        
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.message);
        naviaget("/login");
      });
  }, []);
  return (
    <>
      <Header />
      <div className="flex">
        <Dashboard/>
        <div className="overflow-x-auto md:w-full md:h-screen">
        <Outlet/>
        </div>
        
      </div>
    </>
  );
}
