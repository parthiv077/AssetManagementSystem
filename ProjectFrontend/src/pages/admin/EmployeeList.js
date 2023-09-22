import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import axios from 'axios';
import LoadingBar from 'react-top-loading-bar';
import { fetchAdminAuth } from '../../components/Verify';
import { useNavigate } from 'react-router-dom';

function EmployeeList() {

  const [progress,setProgress]=useState(0);
  const navigate = useNavigate()
  const [employees, setEmployees] = useState([]);
  const token = localStorage.getItem("token");

  const downloadExcel = async () => {
    const response = await axios.get('/admin/downloadEmployeeExcel', { headers: { Authorization: `Bearer ${token}` } });
    
    const binaryString = window.atob(response.data.excelBytes);
    const binaryData = new ArrayBuffer(binaryString.length);
   const dataView = new DataView(binaryData);
   for (let i = 0; i < binaryString.length; i++) {
      dataView.setUint8(i, binaryString.charCodeAt(i));
    }
    
    const blob = new Blob([binaryData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;  
    link.setAttribute('download', `${response.data.name}.xlsx`);
    document.body.appendChild(link);
    link.click();
  }

  useEffect(() => {
    fetchAdminAuth(navigate);
    axios.get('/admin/getAllEmployees',{headers : {Authorization : `Bearer ${token}`}})
      .then(response => {
        //console.log(response.data);
        setProgress(50);
        setEmployees(response.data);
        setProgress(100);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <LoadingBar
        color='#0000FF'
        progress={progress}
        height={5}
        onLoaderFinished={() => setProgress(0)}
      />
      <Sidebar></Sidebar>
      
        <div className="overflow-x-auto mt-20 sm:ml-72 lg:ml-72 md:ml-72">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Employee ID</th>
                <th className="py-3 px-6 text-left">First Name</th>
                <th className="py-3 px-6 text-left">Last Name</th>
                <th className="py-3 px-6 text-left">Department</th>
                <th className="py-3 px-6 text-left">Contact No</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Date of Joining</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {employees.map((employee) => (
                <tr
                  key={employee.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-4 px-6 text-left font-medium">
                    {employee.employeeId}
                  </td>
                  <td className="py-4 px-6 text-left font-medium">
                    {employee.employeeFirstName}
                  </td>
                  <td className="py-4 px-6 text-left font-medium">
                    {employee.employeeLastName}
                  </td>
                  <td className="py-4 px-6 text-left font-medium">
                    {employee.department}
                  </td>
                  <td className="py-4 px-6 text-left font-medium">
                    {employee.contactNo}
                  </td>
                  <td className="py-4 px-6 text-left font-medium">
                    {employee.email}
                  </td>
                  <td className="py-4 px-6 text-left font-medium">
                    {new Date(employee.dateOfJoining).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='ml-72 mt-5'>
        <button type="button" onClick={downloadExcel} className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800">Download Excel Of Employees</button>
        </div>
    </div>
  )
}

export default EmployeeList
