import React, { useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { fetchAdminAuth } from '../../components/Verify';
import { useState } from 'react';

function AdminDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAdminAuth(navigate);
    axios
      .get('/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } })
      .then(response => {
        console.log(response.data);
        setData(response.data);
      })
      .catch(error => {
        console.log(error);
        setData({
          totalAssets: 0,
          totalEmployees: 0,
          noOfRequests: 0,
          acquiredAssets: 0,
          availableAssets: 0,
        });
      });
  }, [token]);

  return (
    <div>
      <Sidebar />
      <div className="mt-20 sm:mx-72 md:mx-72 lg:mx-72">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-medium mb-2">Total Assets</h2>
            <p className="text-gray-800 font-medium">{data && data.totalAssets}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-medium mb-2">Total Employees</h2>
            <p className="text-gray-800 font-medium">{data && data.totalEmployees}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-medium mb-2">No. of Requests</h2>
            <p className="text-gray-800 font-medium">{data && data.noOfRequests}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-medium mb-2">Acquired Assets</h2>
            <p className="text-gray-800 font-medium">{data && data.acquiredAssets}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-medium mb-2">Available Assets</h2>
            <p className="text-gray-800 font-medium">{data && data.availableAssets}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
