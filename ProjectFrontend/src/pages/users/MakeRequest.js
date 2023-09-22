import React, { useEffect, useState } from 'react'
import UserSidebar from '../../components/UserSidebar'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { fetchUserAuth } from '../../components/Verify';
function MakeRequest() {

    const [assetClassList, setAssetClassList] = useState([])
    const token = localStorage.getItem("token");
    const navigate = useNavigate()

    useEffect(() => {
        fetchUserAuth(navigate);
        const fetchData = async () => {
            await axios.get("/user/getAllClasses",{headers : {Authorization : `Bearer ${token}`}}).then(res => {
                let assetClassList = res.data.map((item) => ({
                    name: item.name,
                    feilds: item.keys
                }

                )
                );

                setAssetClassList(assetClassList);
            })
        }
        fetchData();

    }, [])

    return (
        <div>
            <UserSidebar></UserSidebar>
            <div className='mx-72 mt-16'>
                <h5 className=" mt-0 mb-2 text-xl font-medium leading-tight text-primary">
                    Select Category For Asset Which You Want To Acquire
                </h5>
            </div>
            <div className=' mx-72 my-3 grid md:grid-cols-3 md:gap-4'>
                {assetClassList.map((item, index) => (
                    <div className="max-w-sm m-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700" key={index}>
                        <div className="p-5">

                            <h5 className="mb-2 text-2xl  tracking-tight text-gray-900 dark:text-white">{item.name}</h5>

                            <button onClick={() => {
                                navigate('/makerequest/chooseasset', { state: { tags: item.feilds, name: item.name } });
                            }} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                Select
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MakeRequest
