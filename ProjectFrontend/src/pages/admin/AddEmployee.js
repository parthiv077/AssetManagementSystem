import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../components/Auth';
import LoadingBar from 'react-top-loading-bar';
import { fetchAdminAuth } from '../../components/Verify';

function AddEmployee() {

  const [progress,setProgress] = useState(0);

  const [employeeId,setEmployeeId]=useState(null);
  const [employeeFirstName, setEmployeeFirstName] = useState(null);
  const [employeeMiddleName, setEmployeeMiddleName] = useState(null);
  const [employeeLastName, setEmployeeLastName] = useState(null);
  const [department, setDepartment] = useState(null);
  const [role, setRole] = useState(null);
  const [contactNo, setContactNo] = useState(null);
  const [email, setEmail] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [dateOfJoining, setDateOfJoining] = useState(null);
  const Navigate = useNavigate()

  useEffect(()=>{
    fetchAdminAuth(Navigate);
  },[])

  const handleSubmit = async (e) => {
    setProgress(20);
    e.preventDefault()
    const employee = {
      employeeId,
      employeeFirstName,
      employeeMiddleName,
      employeeLastName,
      department,
      role,
      contactNo,
      email,
      dateOfBirth,
      dateOfJoining
    }
    setProgress(40);
    //console.log(employee)
    const token = localStorage.getItem("token");
    const response = await axios.post("/admin/addEmployee", employee, {headers : {Authorization : `Bearer ${token}`}})
    setProgress(60);
    //console.log("response data >>", response);
    setProgress(80);
    if (response.status === 200) {
      alert("Employee Added successfully");
      setProgress(100);
      Navigate('/admindashboard')

    }
    if (response.status === 204) {
      alert("Error Occur to add employee");
      setEmployeeId("")
      setEmployeeFirstName("")
      setEmployeeMiddleName("")
      setEmployeeLastName("")
      setDepartment("")
      setRole("")
      setContactNo("")
      setEmail("")
      setDateOfBirth("")
      setDateOfJoining("")
      setProgress(100);

      Navigate('/addemployee')
    }
    if(response.status===409){
      alert("employee already exist please enter valid data")
      alert("Error Occur to add employee");
      setEmployeeId("")
      setEmployeeFirstName("")
      setEmployeeMiddleName("")
      setEmployeeLastName("")
      setDepartment("")
      setRole("")
      setContactNo("")
      setEmail("")
      setDateOfBirth("")
      setDateOfJoining("")
      setProgress(100);
    }
  }

  return (
    <>
      <LoadingBar
        color='#0000FF'
        progress={progress}
        height={5}
        onLoaderFinished={() => setProgress(0)}
      />
      <Sidebar></Sidebar>
      <div className='py-24 sm:mx-72 md:mx-72 mx-5'>
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-3 md:gap-4">
            <div className="relative z-0 w-full mb-4 group">
              <input type="text" name="FirstName" id="FirstName" onChange={(e) => { setEmployeeFirstName(e.target.value) }} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
              <label htmlFor="FirstName" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">First name</label>
            </div>
            <div className="relative z-0 w-full mb-4 group">
              <input type="text" name="MiddleName" id="MiddleName" onChange={(e) => { setEmployeeMiddleName(e.target.value) }} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
              <label htmlFor="MiddleName" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Middle name</label>
            </div>
            <div className="relative z-0 w-full mb-4 group">
              <input type="text" name="LastName" id="LastName" onChange={(e) => { setEmployeeLastName(e.target.value) }} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
              <label htmlFor="LastName" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Last name</label>
            </div>
          </div>
          <div className="grid md:grid-cols-3 md:gap-4">

            <div className="relative z-0 w-full mb-6 group">
              <input type="text" name="Department" id="Department" onChange={(e) => { setDepartment(e.target.value) }} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
              <label htmlFor="Department" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Departemnet</label>
            </div>
            <div className="relative z-0 w-full mb-6 group">
              <input type="text" name="Id" id="Id" onChange={(e) => { setEmployeeId(e.target.value) }} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
              <label htmlFor="Id" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Id</label>
            </div>
            <div className="relative z-0 w-full mb-6 group">
              <input type="text" name="Role" id="Role" onChange={(e) => { setRole(e.target.value) }} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
              <label htmlFor="Role" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Role</label>
            </div>
          </div>
          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="relative z-0 w-full mb-6 group">
              <input type="email" name="Email" id="Email" onChange={(e) => { setEmail(e.target.value) }} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
              <label htmlFor="Email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email Address</label>
            </div>

            <div className="relative z-0 w-full mb-6 group">
              <input type="tel" name="PhoneNumber" id="PhoneNumber" onChange={(e) => { setContactNo(e.target.value) }} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
              <label htmlFor="PhoneNumber" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Phone Number</label>
            </div>
          </div>
          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="relative z-0 w-full mb-6 group py-2">
              <input type="date" name="DateOfBirth" id="DateOfBirth" onChange={(e) => { setDateOfBirth(e.target.value) }} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
              <label htmlFor="DateOfBirth" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Date Of Birth</label>
            </div>
            <div className="relative z-0 w-full mb-6 group py-2">
              <input type="date" name="DateOfJoining" id="DateOfJoining" onChange={(e) => { setDateOfJoining(e.target.value) }} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
              <label htmlFor="DateOfBirth" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Date Of Joining</label>
            </div>
          </div>
          <div className='authButtons flex flex-row items-center justify-center py-10'>
            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mx-5 ">Add Employee</button>
            <button type="button" onClick={() => { Navigate('/admindashboard') }} className="text-white bg-slate-400 hover:bg-slate-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-slate-400 dark:hover:bg-slate-500 dark:focus:ring-blue-800 ">Cancel</button>
          </div>
        </form>

      </div>
    </>
  )
}

export default AddEmployee


