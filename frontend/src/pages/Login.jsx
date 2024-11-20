import Image from "../components/Image";
import LoginFrom from "../components/LoginForm";
import logo from "../assets/logo-full.svg";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { tokenAction } from "../store/token";
import { useSelector } from "react-redux";
export default function Login() {


  return <>
  <section className="relative flex flex-wrap lg:h-screen lg:items-center bg-slate-900 ">
        <div className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24 text-green-600">
          <div className="mx-auto max-w-lg text-center">
            <h2 className="text-gray-900 font-medium title-font">
              <img alt="patient" src={logo} />
            </h2>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Get started today!
            </h1>

            <p className="mt-4 text-gray-500"></p>
          </div>
          <LoginFrom/>
          </div>
          <Image/>
          </section>
  </>;
}
