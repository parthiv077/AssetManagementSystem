import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';

function FirstTimeLogin() {
    const [password, setPassword] = useState(null)
    const [cpassword, setCpassword] = useState(null)
    const navigate = useNavigate();
    let {token} = useParams();
    const handleSubmit = async (response) => {
        if (password === cpassword) {
            response.preventDefault()
            console.log(token);
            response = await axios.post("/auth/setPassword", FirstLoginRequest)
            console.log(response.data)
            if(response.status===200)
            {
                navigate('/successfull');
            }
        }
        else {
            alert("You Entered different values in both password field");
            setPassword("")
            setCpassword("")
        }
    }
    const FirstLoginRequest ={
        token,password

    }
    
    return (
        <div>
            <section className="bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <h1 className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        AssetManagementSystem
                    </h1>
                    <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
                        <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Set Password
                        </h2>
                        <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" onSubmit={handleSubmit}>

                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New Password</label>
                                <input type="password" name="password" id="password" placeholder="••••••••" onChange={(e) => { setPassword(e.target.value) }} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                            </div>
                            <div>
                                <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                                <input type="password" name="confirm-password" id="confirm-password" placeholder="••••••••" onChange={(e) => { setCpassword(e.target.value) }} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                            </div>
                            <button type="submit"  onSubmit={handleSubmit} className="w-full text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Reset passwod</button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default FirstTimeLogin
