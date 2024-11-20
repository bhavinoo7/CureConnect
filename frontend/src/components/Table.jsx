import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

export default function Table() {
  const user = useSelector((store) => store.user);
  const id = user.id;
  const [Patient, setPatient] = useState([]);  
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(6);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3000/patient-dashboard", {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        setPatient(res.data.user.patients);
        console.log(res.data.user.patients);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load patients data.");
      });
  }, []);

  // Calculate the range of appointments to display based on the current page
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentPatients = Patient.slice(indexOfFirstAppointment, indexOfLastAppointment);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-yellow-50 text-sm text-center">
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              <th className="ths">Name</th>
              <th className="ths">Date Of Birth</th>
              <th className="ths">Gender</th>
              <th className="ths">Make Appointment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentPatients.map((app) => (
              <tr key={uuidv4()}>
                <td className="tds">{app.full_name}</td>
                <td className="tds">{app.birth_date.slice(0, 10)}</td>
                <td className="tds">{app.gender}</td>
                <td className="tds">
                  <button
                    className="btn hover:bg-green-500 text-white"
                    onClick={() => {
                      navigate(`/patient-dashboard/${app._id}/appoinment-form`, {
                        state:{patient_id:app._id}
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
          totalAppointments={Patient.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
    </>
  );
}

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
