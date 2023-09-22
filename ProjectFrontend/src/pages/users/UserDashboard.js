import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import UserSidebar from '../../components/UserSidebar'
import { fetchUserAuth } from '../../components/Verify';

function UserDashboard() {
  const token = localStorage.getItem('token')
  const eid = localStorage.getItem('eid')
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetchUserAuth(navigate);
    axios.get(`/user/dashboard/${eid}`, { headers: { Authorization: `Bearer ${token}` } }).then((response) => {
        setData(response.data);
        console.log(response.data)
    });
}, []);
  return (
     <div>
      <UserSidebar />
       <div className='sm:mx-72 lg:mx-72 md:mx-72 mt-20'>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
           <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-medium mb-2">Acquired Assets</h2>
            <p className="text-gray-800 font-medium">{data && data.aquiredAssets}</p>
           </div>
           <div className="bg-white rounded-lg shadow-lg p-6">
             <h2 className="text-lg font-medium mb-2">Requested Assets</h2>
             <p className="text-gray-800 font-medium">{data && data.requestedAssets}</p>
           </div>

        </div>
      </div> 
    </div>
  )
}

export default UserDashboard
