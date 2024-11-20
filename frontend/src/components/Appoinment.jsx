import { Link } from "react-router-dom";
import { FiAlertCircle } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

export default function Appoinment({ status }) {
  const user = useSelector((store) => store.user);
  const Navigate = useNavigate();
  console.log(status);
  const [appoinment, setAppoinment] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(10);
  const socket = io("http://localhost:3000");
  const user_id = user.user_id;
  const role=user.role;

  useEffect(() => {
    socket.emit("appoinment", { user_id: user_id ,role:role});

    socket.on("fetch-appoinment", async (data) => {
      if (data && data.user && data.user.appoinments) {
        const app = data.user.appoinments;
        setAppoinment(app);
        console.log("AAAAAAAAAAA");
      } else {
        // Optionally, you can set an empty array if the appointments are missing
        setAppoinment([]);
      }
    });
  }, [user_id]);

  // Filter appointments by status
  const filteredAppointments = appoinment.filter(
    (app) => app.status === status
  );

  // Get current appointments for the page
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="rounded-lg border border-gray-200">
        <div className="overflow-x-auto rounded-t-lg">
        
          <table className="min-w-full divide-y-2 divide-gray-200 bg-yellow-50 text-sm text-center">
            <thead className="ltr:text-left rtl:text-right">
              <tr>
                <th className="ths">Name</th>
                <th className="ths">Date</th>
                <th className="ths">Time</th>
                <th className="ths">Status</th>
                <th className="ths">View Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentAppointments.map((app) => (
                <tr key={uuidv4()}>
                  <td className="tds">{app.patient.full_name}</td>
                  <td className="tds">{app.date.slice(0, 10)}</td>
                  <td className="tds">{app.time}</td>
                  <td className="tds">{app.status}</td>
                  <td className="tds">
                    <button
                      className="btn hover:bg-green-500 text-white"
                      onClick={() => {
                        Navigate(`/doctor-dashboard/${app.patient._id}`, {
                          state: app,
                        });
                      }}
                    >
                      Click
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-b-lg border-t border-gray-200 px-4 py-2">
          <Pagination
            appointmentsPerPage={appointmentsPerPage}
            totalAppointments={filteredAppointments.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </div>
    </>
  );
}

// Pagination Component
const Pagination = ({
  appointmentsPerPage,
  totalAppointments,
  paginate,
  currentPage,
}) => {
  const pageNumbers = [];

  for (
    let i = 1;
    i <= Math.ceil(totalAppointments / appointmentsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="flex justify-end gap-1 text-xs font-medium">
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              onClick={() => paginate(number)}
              className={`block size-8 rounded border ${
                currentPage === number
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-100 bg-white text-gray-900"
              } text-center leading-8`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
