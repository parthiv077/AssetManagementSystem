import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import UserSidebar from '../../components/UserSidebar';
import axios from 'axios';
import { data } from 'autoprefixer';
import { fetchUserAuth } from '../../components/Verify';

function ChooseAsset() {
    const location = useLocation();
    const Fields = location.state.tags
    const name = location.state.name;
    const Navigate = useNavigate();
    const [params, setParams] = useState({});
    const navigate = useNavigate();
    const [flag, setFlag] = useState(true);

    useEffect(()=>{
        fetchUserAuth(navigate);
    },[])
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setParams((prevParamsData) => ({
            ...prevParamsData,
            [name]: value,
        }))

    };

    // console.log("params >> ", params)

    const handleSubmit = async (e) => {
        e.preventDefault();
        const AddAssetInfo = { name, params };
        const token = localStorage.getItem("token");
        const response = await axios.post("/user/searchAsset", AddAssetInfo,{headers : {Authorization : `Bearer ${token}`}});
        console.log(response.data);
        if (data.length === 0) {
            setFlag(false);
        }
        else {
            navigate("/makerequest/chooseasset/searchasset", { state: { data: response.data } })

        }


    }
    

    return (
        <div>
            <UserSidebar></UserSidebar>
            <div className='mx-72 mt-16'>
                <h5 className=" mt-0 mb-2 text-xl font-medium leading-tight text-primary">
                    Enter Your Requirements for {name}
                </h5>
            </div>
            <div className='sm:mx-72 md:mx-72 mx-5 mt-5'>

                <form onSubmit={handleSubmit}>
                    {Fields.map((field) => (
                        <>{flag && (<div className='my-2'>
                            <label htmlFor={field} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{field}</label>
                            <input onChange={handleInputChange} type="text" id={field} name={field} className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>)}



                            {!flag && (<div>
                                <label htmlFor={field} class="block mb-2 text-sm font-medium text-red-700 dark:text-red-500">{field}</label>
                                <input  type="text" id={field} class="bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500" placeholder="Error" />
                                <p class="mt-2 text-sm text-red-600 dark:text-red-500"><span class="font-medium">Sorry!</span>Required {field} {name} is not Available</p>
                            </div>)}
                        </>
                        // <div className="relative z-0 w-full mb-4 group" key={field}>
                        //     <input type="text" onChange={handleInputChange} name={field} id={field} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" "  />
                        //     <label htmlFor={field} className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">{field}</label>
                        // </div>
                    ))}

                    <div className='authButtons flex flex-row items-center justify-center py-10'>
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mx-5 ">Search</button>
                        <button type="button" onClick={() => { Navigate('/userdashboard') }} className="text-white bg-slate-400 hover:bg-slate-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-slate-400 dark:hover:bg-slate-500 dark:focus:ring-blue-800 ">Cancel</button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default ChooseAsset
