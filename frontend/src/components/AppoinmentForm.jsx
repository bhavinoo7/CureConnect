import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { useSelector } from "react-redux";

export default function AppoinmentForm() {
  const socket = io("http://localhost:3000");
  const location = useLocation();
  const Navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const user_id = user.id;
  console.log(user_id);
  const patient_id = location.state.patient_id;
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() + 1))
  );
  const [availableSlots, setAvailableSlots] = useState([]);
  const [doctor, setdoctor] = useState([]);
  const [currSelectedDoctor, setCurrSelectedDoctor] = useState("");
  const [prevSelected, setPreviousSelectd] = useState(null);

  useEffect(() => {
    if (currSelectedDoctor && startDate) {
      socket.emit("get-available-slots", {
        doctor_id: currSelectedDoctor,
        date: startDate,
        user_id: user_id,
      });
    }
  }, [currSelectedDoctor, startDate]);

  // useEffect(() => {
  //   socket.on('slots-updated', ({ doctor_id, date }) => {
  //     if (currSelectedDoctor === doctor_id && new Date(startDate).toISOString().split('T')[0] === date.slice(0, 10)) {
  //       fetchAvailableSlots(doctor_id, date);
  //     }
  //   });

  //   return () => {
  //     socket.off('slots-updated');
  //   };
  // }, [socket]);

  // const fetchAvailableSlots = (doctor_id, date) => {
  //   socket.emit('get-available-slots', { doctor_id, date: date });

  //   socket.on('available-slots', (data) => {
  //     setAvailableSlots(data.map((slot) => slot.time));
  //   });
  // };

  useEffect(() => {
    const handleAvailableSlots = (data) => {
      setAvailableSlots(data.slots.map((slot) => slot.time));
    };

    // Handle slots-updated event
    const handleSlotsUpdated = (data) => {
      socket.emit("get-available-slots", {
        doctor_id: currSelectedDoctor,
        date: startDate,
        user_id: user_id,
      });
    };

    socket.on("available-slots", handleAvailableSlots);
    socket.on("slots-updated", handleSlotsUpdated);

    // Return a cleanup function to remove event listeners
    return () => {
      socket.off("available-slots", handleAvailableSlots);
      socket.off("slots-updated", handleSlotsUpdated);
    };
  }, [socket]);

  // const fetchUsedSlots = async () => {
  //   try {
  //     const response = await fetch(
  //       "http://localhost:3000/doctor/available-slots",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           currSelectedDoctor,
  //           date: startDate,
  //         }),
  //       }
  //     );
  //     const data = await response.json();
  //     if (data.success) {
  //       console.log(data.slots);
  //       setAvailableSlots(data.slots);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching used slots:", error);
  //   }
  // };

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();
  console.log(startDate);
  useEffect(() => {
    const res = fetch("http://localhost:3000/doctor", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    res
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setdoctor(data.doctor.alldoctor);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const onSubmit = (data) => {
    data.date = startDate;
    data.patient_id = patient_id;
    console.log(data);
    fetch("http://localhost:3000/patient/appoinment-form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        Navigate("/patient-dashboard");
      })
      .catch((err) => console.log(err));
  };
  const handleSelection = (event) => {
    setCurrSelectedDoctor(event.target.value);
    // When the doctor is selected, fetch slots
    console.log(event.target.value);
  };
  const handleSlotSelection = (event) => {
    socket.emit("lock-slot", {
      doctor_id: currSelectedDoctor,
      date: startDate,
      time: event.target.value,
      user_id: user_id,
    });
  };

  return (
    <>
      <div className="bg-slate-500 h-screen">
        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-2xl">
            <h1 className="mt-6 text-2xl font-bold text-red-300 sm:text-3xl md:text-4xl">
              Appinment to HealthCare
            </h1>

            <form
              className="mt-8 grid grid-cols-6 gap-6"
              method="POST"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="col-span-6">
                <label
                  htmlFor="choose_doctor"
                  className="block text-sm font-medium text-white"
                >
                  Choose doctor
                </label>

                <select
                  className="inputs mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
                  {...register("doctor_id")}
                  onChange={handleSelection}
                  defaultValue={"new"}
                >
                  <option value={"new"} disabled>
                    Select doctor
                  </option>
                  {doctor.map((doctor) => (
                    <option value={doctor._id}>
                      {`Dr ${doctor.name} (${doctor.specialization})`}
                    </option>
                  ))}
                </select>
                {errors.doctor_id && (
                  <p className="text-red-700">{errors.doctor_id.message}</p>
                )}
              </div>

              {currSelectedDoctor ? (
                <>
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="select_date"
                      className="block text-sm font-medium text-white"
                    >
                      Select Date
                    </label>
                    {/* <input type="Date" className="inputs" onChange={(date)=>setStartDate(date)} min={new Date(new Date().setDate(new Date().getDate() + 1))} required /> */}

                    <DatePicker
                      selected={startDate}
                      className="inputs"
                      dateFormat="d/M/yyyy"
                      onChange={(date) => setStartDate(date)}
                      minDate={
                        new Date(new Date().setDate(new Date().getDate() + 1))
                      }
                      required
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="appointment_time"
                      className="block text-sm font-medium text-white"
                    >
                      Select Time Slot
                    </label>
                    <select
                      {...register("appoinmentTime", {
                        required: "Please select a time slot",
                      })}
                      onChange={handleSlotSelection}
                      defaultValue=""
                      className="inputs"
                    >
                      <option value="" disabled>
                        Select a time slot
                      </option>
                      {availableSlots.map((slot) => (
                        <option value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-6">
                    <label
                      htmlFor="contact"
                      className="block text-sm font-medium text-white"
                    >
                      Reason
                    </label>

                    <textarea
                      type="reason"
                      {...register("reason", {
                        minLength: { value: 10, message: "MinLength is 10" },
                        required: {
                          value: true,
                          message: "This field is required",
                        },
                      })}
                      name="reason"
                      className="inputs"
                      placeholder="Enter reason for appoinmnt"
                    />
                    {errors.reason && (
                      <p className="text-red-700">{errors.reason.message}</p>
                    )}
                  </div>

                  <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                    <button
                      type="submit"
                      className="btn"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "isSubmitting" : "Submit"}
                    </button>
                  </div>
                </>
              ) : (
                <></>
              )}
            </form>
          </div>
        </main>
      </div>
    </>
  );
}
