import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/Auth';
import LoadingBar from 'react-top-loading-bar';

function Login() {

  const [progress,setProgress] = useState(0);

  const auth = useAuth()
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault()

    setProgress(20); //1

    const user = { employeeId, password }
    console.log(user)

    setProgress(40); //2

    const response = await axios.post("/auth/authenticate", user)

    setProgress(60); //3

    const data = response.data;

    setProgress(80); //4

    //console.log("response data >>", response);
    localStorage.setItem('token',data.token);
    localStorage.setItem('eid',data.employeeId);
    //console.log("empId >> ",localStorage.getItem('empId'))
    if (data.role === 'ADMIN') {

      setProgress(90);// 5

      auth.login(employeeId)

      setProgress(100);// 5

      navigate('/admindashboard');

    }
    if (data.role === 'USER') {

      setProgress(90);// 5

      auth.login(employeeId)

      setProgress(100);// 5

      navigate('/userdashboard');

    }
    console.log(response.status)
    if (response.status === 401) {

      setProgress(100);// 5

      setEmployeeId("");
      setPassword("");
      alert('UserName or Password is Wrong')

    }
  }

  return (
    <div className='flex h-screen items-center justify-center '>
      <LoadingBar
        color='#0000FF'
        progress={progress}
        height={5}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className="w-full max-w-xs">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 " onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="employeeId">
              EmployeeId
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="employeeId" type="text" placeholder="EmployeeId" value={employeeId} onChange={(e) => { setEmployeeId(e.target.value) }} />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" value={password} onChange={(e) => { setPassword(e.target.value) }} />
          </div>
          <div className="flex items-center justify-between">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>


  )
}

export default Login
