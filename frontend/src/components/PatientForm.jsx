import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import logo from "../assets/logo-full.svg";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


export default function PatientForm() {
  const Navigate = useNavigate();
  const { tokenValue } = useSelector((store) => store.token);
  const [startDate, setStartDate] = useState(new Date());
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    data.birth_date = startDate;
    console.log(data);
    fetch("http://localhost:3000/patient/patient-form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${tokenValue}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          console.log(res);
          Navigate("/patient-dashboard/appoinment-form",{state:{patient_id:res.patient_id}});
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <section className="bg-slate-500 h-screen">
        
          <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
            <div className="max-w-xl lg:max-w-3xl">
              <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                Welcome to HealthCare
              </h1>

              <form
                className="mt-8 grid grid-cols-6 gap-6"
                onSubmit={handleSubmit(onSubmit)}
                method="POST"
              >
                <div className="col-span-6">
                  <label
                    htmlFor="full_name"
                    className="block text-sm font-medium text-white"
                  >
                    Patient Name
                  </label>

                  <input
                    type="text"
                    {...register("full_name", {
                      minLength: {
                        value: 4,
                        message: "Min length of password is 4",
                      },
                      required: {
                        value: true,
                        message: "This field is required",
                      },
                    })}
                    name="full_name"
                    className="inputs"
                    placeholder="Enter Patient Full Name"
                  />
                  {errors.full_name && (
                    <p className="text-red-700">{errors.full_name.message}</p>
                  )}
                </div>

                <div className="col-span-6">
                  <label
                    htmlFor="birth_date"
                    className="block text-sm font-medium text-white"
                  >
                    Date of Birth
                  </label>

                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    className="inputs"
                    dateFormat="d/M/yyyy"
                    showFullMonthYearPicker
                    maxDate={new Date()}
                    required
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-white"
                  >
                    Gender
                  </label>

                  <select
                    id="gender"
                    {...register("gender", {
                      required: {
                        value: true,
                        message: "This field is required",
                      },
                    })}
                    className="inputs"
                    defaultValue="Male"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-700">{errors.gender.message}</p>
                  )}
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="contact"
                    className="block text-sm font-medium text-white"
                  >
                    Contact
                  </label>

                  <input
                    type="text"
                    {...register("contact", {
                      minLength: { value: 10, message: "MinLength is 10" },
                      required: {
                        value: true,
                        message: "This field is required",
                      },
                    })}
                    name="contact"
                    className="inputs"
                    placeholder="Enter Patient Contact Number"
                  />
                  {errors.contact && (
                    <p className="text-red-700">{errors.contact.message}</p>
                  )}
                </div>

                <div className="col-span-6">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-white"
                  >
                    Address
                  </label>

                  <textarea
                    type="text"
                    {...register("address", {
                      minLength: { value: 5, message: "Minlength is 5" },
                      required: {
                        value: true,
                        message: "This field is required",
                      },
                    })}
                    name="address"
                    className="inputs"
                  ></textarea>
                  {errors.address && (
                    <p className="text-red-700">{errors.address.message}</p>
                  )}
                </div>

                <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                  <button type="submit" className="btn" disabled={isSubmitting}>
                    {isSubmitting ? "isSubmitting" : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </main>
        
      </section>
    </>
  );
}
