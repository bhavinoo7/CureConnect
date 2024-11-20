import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function PatientInfo() {
  const navigate=useNavigate();
  const Location = useLocation();
  const app = Location.state;
  const handleCompleted = () => {
    console.log("Completed");
    fetch("http://localhost:3000/doctor/completed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appoinment_id: app._id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if(data.success)
        {
          navigate("/doctor-dashboard");
        }
      }
    )
  }
  

  

  return (
    <div className="bg-gray-100 h-screen">
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
          <div className="col-span-4 sm:col-span-3">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex flex-col items-center">
                <img
                  src={app.patient.user.photo.url}
                  className="w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0"
                />

                
                {/* <p className="text-gray-700">{app.patient.birth_date.slice(0,10)}</p> */}
                <div className="mt-6 flex flex-wrap gap-4 justify-center">
                  {app.status === "pending" ?<button onClick={handleCompleted} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
                    Completed
                  
                  </button>:<h1 className="font-bold">Appoinment {app.status}</h1>}
                  
                  
                </div>
              </div>
              <hr className="my-6 border-t border-gray-300" />
              <div className="flex flex-col">
                <span className="text-gray-700 uppercase font-bold tracking-wider mb-2">
                  Appoinment Details
                </span>
                <ul className="font-bold">
                  <li className="mb-2">Time: {app.time}</li>
                  <li className="mb-2">Date: {app.date.slice(0,10)}</li>
                  <li className="mb-2">Status: {app.status}</li>
                  {/* <li className="mb-2">HTML/CSS</li>
                  <li className="mb-2">Tailwind Css</li> */}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-span-4 sm:col-span-9">
          <div class="flow-root rounded-lg border border-black py-3 shadow-sm">
  <dl class="-my-3 divide-y divide-white text-sm">
    <div class="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
      <dt class="font-bold text-gray-900 ">Patient Name</dt>
      <dd class="text-gray-700 sm:col-span-2">{app.patient.full_name}</dd>
    </div>

    <div class="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
      <dt class="font-bold text-gray-900">DOB</dt>
      <dd class="text-gray-700 sm:col-span-2">{app.patient.birth_date.slice(0,10)}</dd>
    </div>

    <div class="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
      <dt class="font-bold text-gray-900">Gender</dt>
      <dd class="text-gray-700 sm:col-span-2"> {app.patient.gender}</dd>
    </div>

    <div class="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
      <dt class="font-bold text-gray-900">Mobile</dt>
      <dd class="text-gray-700 sm:col-span-2"> {app.patient.contact}</dd>
    </div>

    <div class="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
      <dt class="font-bold text-gray-900">Address</dt>
      <dd class="text-gray-700 sm:col-span-2">
      {app.patient.address}
      </dd>
    </div>
  </dl>
</div>
            

            <h2 className="text-xl font-bold mt-6 mb-4">Reason</h2>
            <div className="mb-6">
              <div className="flex justify-between flex-wrap gap-2 w-full">
                <span className="text-gray-700 font-bold">
                {app.reason}
                </span>
                <p>
                  <span className="text-gray-700 mr-2"></span>
                  <span className="text-gray-700"></span>
                </p>
              </div>
              <p className="mt-2">
                
              </p>
            </div>
            <div className="mb-6">
              <div className="flex justify-between flex-wrap gap-2 w-full">
                <span className="text-gray-700 font-bold"></span>
                <p>
                  <span className="text-gray-700 mr-2"></span>
                  <span className="text-gray-700"></span>
                </p>
              </div>
              <p className="mt-2">
                
              </p>
            </div>
            <div className="mb-6">
              <div className="flex justify-between flex-wrap gap-2 w-full">
                <span className="text-gray-700 font-bold"></span>
                <p>
                  <span className="text-gray-700 mr-2"></span>
                  <span className="text-gray-700"></span>
                </p>
              </div>
              <p className="mt-2">
                
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
