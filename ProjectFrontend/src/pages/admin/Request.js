import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import { fetchAdminAuth } from '../../components/Verify';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';

const Request = () => {
  const [requests, setRequests] = useState([]);
  const [requestStatus, setRequestStatus] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem("token")
  const [progress,setProgress] = useState(0);

  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    setProgress(20);
    fetchAdminAuth(navigate);
    setProgress(40)
    axios.get('/admin/getAllRequests', { headers: { Authorization: `Bearer ${token}` } })
      .then(response => {
        setRequests(response.data);
        setProgress(100)
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleAccept = async (requestId) => {
    setProgress(30)
    const confirmed = window.confirm("Are you sure you want to accept the request?");
    setProgress(60)
    if (confirmed) {
      // Perform the action to accept the request
      // console.log("in confirmed......")
      await axios.post(`/admin/acceptRequest/${requestId}`, {}, { withCredentials: true, headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          setProgress(70)
          if (res.data.status === "Success") {
            setProgress(90)
            alert("Request has been accepted.\n Mail has been sent to the employee.")
            setProgress(100)
            navigate("/admindashboard")

          }
          else {
            alert("Request cannot be accepted.\nReason:" + res.data.status)
          }
          setRequests(res.data.requests);
        })
        .catch(error => {
          console.log(error);
        })
      // Update the status of the request to "accepted"
      setRequestStatus('accepted');
    }
  }


  const handleReject = (requestId) => {
    // Prompt the user to provide a reason for rejection
    setProgress(20)
    const reason = window.prompt('Please provide a reason for rejection');
    setProgress(40)
    if (reason!=null) {
      setRejectionReason(reason);

      setRequestStatus('rejected');
setProgress(60)
      axios.post(`/admin/rejectRequest/${requestId}`, { reason: rejectionReason }, { withCredentials: true, headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
    setProgress(80)
        if (res.data.status === "Success") {
          alert("Request has been rejected.\nMail has been sent to the employee.")
          setProgress(100)
          navigate("/admindashboard")
        }
        else {
          alert("Request cannot be rejected.\nReason:" + res.data.status)
          setProgress(100)
        }
        setRequests(res.data.requests);
      })
      .catch(error => {
        console.log(error);
      })

    }
    
  };


  return (
    <div>
        <LoadingBar
        color='#0000FF'
        progress={progress}
        height={5}
        onLoaderFinished={() => setProgress(0)}
      />
      <Sidebar></Sidebar>
      {requests.length > 0 ? (<div className="flex flex-col items-center lg:ml-72 sm:ml-72 mt-20">
        <h1 className="text-2xl font-bold mb-4">Requests</h1>
        <div className="w-full border-b-2 mb-4 drop-shadow-sm"></div>
        {requests.map((request) => (
          <div key={request.requestId} className="flex flex-col items-start w-full px-4 py-2 my-2 border rounded-lg">
            <div className="flex items-center w-full justify-between mb-2">
              <p className="text-sm text-gray-500">{`Employee : ${request.employeeId}`}</p>
              <div className="flex">
                <button
                  onClick={() => handleAccept(request.requestId)}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(request.requestId)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
            <h2 className="text-lg font-bold mb-2">{request.name}</h2>
            {Object.keys(request.attributes).map((key) => (
              <p key={key} className="text-sm">{`${key}: ${request.attributes[key]}`}</p>
            ))}
            <p className="text-xs text-gray-500 mt-2">{`Date of Request: ${new Date(request.dateOfRequest).toLocaleDateString()}`}</p>
          </div>
        ))}
        {requestStatus && <p className="text-lg mt-4">{`Request has been ${requestStatus}`}</p>}
      </div>) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="bg-blue-500 text-white font-bold rounded-lg border shadow-lg p-10">
            <p className="mb-4 text-center">There is No Any Pending Request</p>
            <Link to="/admindashboard" className="block text-center underline hover:text-gray-900">Click here to Go to Dashboard</Link>
          </div>
        </div>
      )}

    </div>
  );
};

export default Request;
