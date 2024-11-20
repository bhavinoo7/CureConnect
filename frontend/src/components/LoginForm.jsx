import { Form, Link, redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { tokenAction } from "../store/token";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export default function LoginFrom() {
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    fetch("http://localhost:3000/login", {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
        
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dispatch(tokenAction.storeToken(data.token));
        if (data.user.role === "patient") {
          Navigate("/patient-dashboard");
        } else if (data.user.role === "doctor") {
          Navigate("/doctor-dashboard");
        } else if (data.user.role === "admin") {
          Navigate("/admin-dashboard");
        }
      })
      .catch((err) => {
        console.error("Error" + err);
      });
  };
  return (
    <>
      <form
        action="/login"
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto mb-0 mt-8 max-w-md space-y-4"
      >
        <div>
          <label htmlFor="email" className="sr-only">
            email
          </label>

          <div className="relative">
            <input
              placeholder="Enter email"
              className="inputs"
              {...register("email", {
                required: { value: true, message: "This field is required" },
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              })}
              type="email"
            />
            {errors.username && (
              <p className="text-red-700">{errors.username.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>

          <div className="relative">
            <input
              placeholder="password"
              className="inputs"
              {...register("password", {
                minLength: { value: 4, message: "Min length of password is 7" },
              })}
              type="password"
            />
            {errors.password && (
              <p className="text-red-700">{errors.password.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            No account?
            <Link className="underline" to="/signup">
              Sign up
            </Link>
          </p>

          <button disabled={isSubmitting} type="submit" className="btn">
            Sign in
          </button>
        </div>
      </form>
    </>
  );
}
// export async function postaction(data) {
//   const formData = await data.request.formData();
//   const user = Object.fromEntries(formData);
//   fetch("http://localhost:3000/login", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(user),
//   })
//     .then((response) => {
//       return response.json();
//     })
//     .then((user1) => {
//       console.log("Login successful:", user1);
//       localStorage.setItem("token", user1.token);
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
//   return redirect("/home");
// }
