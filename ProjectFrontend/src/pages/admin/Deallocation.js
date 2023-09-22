import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAdminAuth } from '../../components/Verify';
import LoadingBar from 'react-top-loading-bar';


function Deallocation() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [requests, setRequests] = useState([]);
  const [rejectionReason,setRejectionReason] = useState('');
  const [progress,setProgress] = useState(0)
  useEffect(() => {
    fetchAdminAuth(navigate);
    setProgress(40)
    axios
      .get(`/admin/getAllDeallocationRequests`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => 
      {
        setRequests(response.data);
        setProgress(100)
      });
  }, []);
const handleCancellation=async(drId)=>{

 // Prompt the user to provide a reason for rejection
 setProgress(20)
 const reason = window.prompt('Please provide a reason for rejection');
 setProgress(60)
 if (reason!=null) {
   setRejectionReason(reason);

   
  await axios.get(`/admin/cancelDeallocationRequest/${drId}/${reason}`, 
  {  headers: { Authorization: `Bearer ${token}` } })
   .then(res => {
      setProgress(80)
      if (res.status === 200) {
        alert("Request has been rejected.\nMail has been sent to the employee.")
        setProgress(100)
        navigate("/admindashboard")
      }
      else {
        alert("Request cannot be rejected.\nReason:" + res.data.status)
         setProgress(100)
      }
      setRequests(res.data);
    })
    .catch(error => {
      console.log(error);
   })

 }
 
}
const handleDeallocation=async(drId)=>{
  setProgress(20)
  console.log(token + "from deacllocate")
  await axios.get(`/admin/deallocateAsset/${drId}`, 
  {  headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          setProgress(40)
          if (res.status === 200) {
            setProgress(60)
            alert("Asset Deallocated Succesfully.")
            setProgress(100)
            navigate("/admindashboard")

          }
          else {
            setProgress(80)
            alert("Asset cannot be Deallocated.\nReason:" + res.data.status)
            setProgress(100)
          }
          setRequests(res.data);
        })
        .catch(error => {
          console.log(error);
        })


}
  return (
    <div>
      <LoadingBar
        color='#0000FF'
        progress={progress}
        height={5}
        onLoaderFinished={() => setProgress(0)}
      />
      <Sidebar />
      <div className='sm:mx-72 lg:mx-72 md:mx-72 mt-20'>
        {requests.length > 0 ? (<div className="grid grid-cols-3 gap-4 p-10">
          <div className="col-span-2">
            <h1 className="text-3xl font-bold mb-8">Deallocation Requests</h1>
            <div className="grid grid-cols-2 gap-4">
              {requests.map((request) => (
                <div
                  key={request.drId}
                  className="p-6 bg-white shadow-md rounded-lg"
                >
                  <h3 className="text-lg font-medium mb-4">{request.className}</h3>
                  Allocated to :
                  <p className="text-black-400 mb-4">{request.employeeId}</p>
                  Date of Request : 
                  <p className="text-black-400 mb-4">{new Date(request.dateOfRequest).toLocaleDateString()}</p>
                  <img
                    src={`data:image/png;base64,${request.png}`}
                    alt="request"
                    className="mb-4"
                  />
                  <ul className="mb-4">
                    {Object.entries(request.attributes).map(([key, value]) => (
                      <li key={key}>
                        {key}: {value}
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-end">
                    <button onClick={()=>handleDeallocation(request.drId)} className="bg-blue-500 hover:bg-blue-700 rounded-lg text-white font-bold py-2 px-4 mr-2">
                      Deallocate asset
                    </button>
                    <button onClick={()=>handleCancellation(request.drId)} className="bg-slate-400 hover:bg-slate-500 rounded-lg text-black font-bold py-2 px-4">
                      Cancel request
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
) : (
  <div className="flex flex-col items-center justify-center h-screen">
          <div className="bg-blue-500 text-white font-bold rounded-lg border shadow-lg p-10">
            <p className="mb-4 text-center">There is No Any Pending Request</p>
            <Link to="/admindashboard" className="block text-center underline hover:text-gray-900">Click here to Go to Dashboard</Link>
          </div>
        </div>
)}
              </div>

    </div>
  );
}

export default Deallocation;
