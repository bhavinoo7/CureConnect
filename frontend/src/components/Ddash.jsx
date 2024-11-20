import { useEffect } from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import { appoAction } from "../store/appo";
import { useDispatch } from "react-redux";
import Appoinment from "./Appoinment";
import Table from "./Table.jsx";
export default function Ddash({type}) {
    const socket = io("http://localhost:3000");
    const user=useSelector((store)=>store.user);  
    const dispatch=useDispatch(); 
    let user_id="";
    if(type==="doctor"){
     user_id = user.user_id;
    }
    else{
         user_id = user.id;
    }
   
    useEffect(() => {
        socket.emit("appoinment", { role:type,user_id: user_id });

        socket.on("fetch-appoinment", async (data) => {
          if(type==="doctor"){
          if (data && data.user && data.user.appoinments) {
            const app = data.user.appoinments;
            console.log(app);
            const pending=app.filter((app)=>app.status=="pending").length;
            dispatch(appoAction.storePending(pending));
            const completed=app.filter((app)=>app.status=="completed").length;
            dispatch(appoAction.storeCompleted(completed));
            const cancelled=app.filter((app)=>app.status=="cancelled").length;
            dispatch(appoAction.storeCancelled(cancelled));
          }
        }
        if(type==="patient"){
          if (data && data.user) {
            // console.log(data.user.patients);
            const apps = data.user.patients.map((user)=>user.appoinments);
            console.log(apps);
            console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
            const app=apps.flat();
            console.log(apps);
            const pending=app.filter((app)=>app.status=="pending").length;
            console.log(pending);
            dispatch(appoAction.storePending(pending));
            const completed=app.filter((app)=>app.status=="completed").length;
            dispatch(appoAction.storeCompleted(completed));
            const cancelled=app.filter((app)=>app.status=="cancelled").length;
            dispatch(appoAction.storeCancelled(cancelled));
          }
        }

    });


      }, [socket]);
      const {Pending,Completed,Cancelled}=useSelector((store)=>store.appo);
    return (
        <>
        <div>
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
  <div className="mx-auto max-w-3xl text-center">
    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Appoinments</h2>

    <p className="mt-4 text-gray-500 sm:text-xl">
    
    </p>
  </div>

  <dl className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-1 lg:grid-cols-3">
    <div className="flex flex-col rounded-lg bg-yellow-400 px-4 py-8 text-center">
      <dt className="order-last text-lg font-medium text-white ">{user.role!=="patient"?<Link to="/doctor-dashboard/pending-appointments"><button className="btn">Pending Appointments</button></Link>:"Pending Appointments"}</dt>

      <dd className="text-4xl font-extrabold text-white md:text-5xl">{Pending}</dd>
    </div>

    <div className="flex flex-col rounded-lg bg-green-200 px-4 py-8 text-center">
      <dt className="order-last text-lg font-medium text-white">{user.role!=="patient"?<Link to="/doctor-dashboard/completed-appointments"><button className="btn">completed Appointments</button></Link>:"Completed Appointments"}</dt>

      <dd className="text-4xl font-extrabold text-white md:text-5xl">{Completed}</dd>
    </div>

    <div className="flex flex-col rounded-lg bg-red-600 px-4 py-8 text-center">
      <dt className="order-last text-lg font-medium text-white">{user.role!=="patient"?<Link to="/doctor-dashboard/cancalled-appointments"><button className="btn">Cancalled Appointments</button></Link>:"Cancalled Appointments"}</dt>

      <dd className="text-4xl font-extrabold text-white md:text-5xl">{Cancelled}</dd>
    </div>

    
  </dl>
</div>
        </div>
        {user.role==="patient"?
        <div className="mx-7 rounded-lg">
        <Table/>
    </div>:<></>}
        
        </>
        
    );
    }