import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RegisterForm, { registeraction } from "./components/RegisterForm.jsx";
import Heropage from "./components/Heropage.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { Provider } from "react-redux";
import { store } from "./store/index.js";
import Logout from "./components/Logout.jsx";
import Patient from "./pages/Patient.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./store/index.js";
import PatientForm from "./components/PatientForm.jsx";
import AppoinmentForm from "./components/AppoinmentForm.jsx";
import Doctor from "./pages/Doctor.jsx";
import Pending from "./components/Pending.jsx";
import PatientInfo from "./components/PatientInfo.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import NotFound from "./components/NotFound.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import Complete from "./components/Complete.jsx";
import Cancelled from "./components/Cancelled.jsx";
import Ddash from "./components/Ddash.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [{ path: "/", element: <Heropage /> }],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Register />,
    action: registeraction,
  },
  {
    path: "/patient-dashboard",
    element: <ProtectedRoute requiredRole="patient" />,
    errorElement:<ErrorBoundary/>,
    children: [
      {
        path: "/patient-dashboard",
        element: <Patient />,
        children: [
          {
            path:"",
            element: <Ddash type="patient"/>,
          },
          {
            path: "patient-form",
            element: <PatientForm />,
          },
          {
            path: "appoinment-form",
            element: <AppoinmentForm />,
          },
          {
            path:":id/appoinment-form",
            element:<AppoinmentForm/>

          },
          {
            path:"*",
            element:<NotFound/>
          }
        ],
        errorElement:<ErrorBoundary/>
      },
    ],
  },
  {
    path: "/doctor-dashboard",
    element: <ProtectedRoute requiredRole="doctor" />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "",
        element: <Doctor />,
        children: [
          {
            path: "",//means "" /doctor-dashboard
            element: <Ddash type="doctor"/>,
          },
          {
            path: ":id",
            element: <PatientInfo />,
          },
          {
            path:"pending-appointments",
            element:<Pending/>

          },
          {
            path:"completed-appointments",
            element:<Complete/>
          },
          {
            path:"cancelled-appointments",
            element:<Cancelled/>
          },
          {
            path:"*",
            element:<NotFound/>
          }
        ],
        errorElement: <ErrorBoundary /> 
      },
    ],
  },
  {
    path: "/logout",
    element: <Logout />,
  },
  {
    path:"*",
    element:<NotFound/>
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <RouterProvider router={router} />
        <ToastContainer />
      </PersistGate>
    </Provider>
  </StrictMode>
);
