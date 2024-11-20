import { useEffect } from "react";
import { useSelector } from "react-redux";
import Dashboard from "./Dashboard";
import Header from "../components/Header";
import { useDispatch } from "react-redux";
import axios from "axios";
import { userActions } from "../store/user";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; 
import { Outlet } from "react-router-dom";

export default function Doctor() {
  const naviaget = useNavigate();
  const dispatch = useDispatch();
    useEffect(() => {
      const token = localStorage.getItem("token");
      axios
        .get("http://localhost:3000/doctor-dashboard", {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          console.log(res.data);
          dispatch(userActions.storeUser(res.data.user));
        })
        .catch((err) => {
          console.error(err);
          toast.error(err.message);
          naviaget("/login");
        });
    }, []);
  return <>
  <Header/>
  <section className="flex md:h-screen flex-row">
    
    <Dashboard/>
    <div className="overflow-x-auto md:w-full md:h-screen">
    <Outlet/>
    </div>
  
  
  </section>
  
  </>;
}
