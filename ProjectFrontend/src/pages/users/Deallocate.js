import React from 'react'
import UserSidebar from '../../components/UserSidebar'
import { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';

function Deallocate() {
    const [file, setFile] = useState(null);
    const [confirmDeallocate, setConfirmDeallocate] = useState(false);
    const location = useLocation();
    const assetId = location.state.assetId;
    const navigate  = useNavigate();
    const [progress,setProgress] = useState(0)

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setProgress(100)
    };

    const handleDeallocateClick = () => {
        setProgress(20)
        if(file ===null)
        {alert("Upload the image")}
        else{
            if (confirmDeallocate) {
                setProgress(50)
                const employeeId = localStorage.getItem("eid");
                const token=localStorage.getItem("token")
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = () => {
                    const png = reader.result.split(",")[1];
    
                    const obj = {assetId,employeeId,png}
                    console.log(obj);
                    axios.post(`/user/deallocationRequest`, 
                        obj,{ headers: { Authorization: `Bearer ${token}` } 
                    })
                        .then((response) => {
                            setProgress(80)
                            if(response.status===200)
                            {alert("Request For Deallocation is Succesful");
                            setProgress(100)
                            navigate('/acquiredassets');}
                            else{alert("try again")}
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                };
            } else {
                setConfirmDeallocate(true);
                setProgress(100)
            }
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
            <UserSidebar />
            
            <div className='sm:mx-72 lg:mx-72 md:mx-72 mt-20'>
            <div className=' flex gap-8 flex-row  justify-center items-center border-slate-400 border-dotted border-[2px] mx-3 px-4 py-4 rounded-3xl'>
                <div className="flex flex-col items-center justify-center h-screen">
                    {file ? (
                        <img src={URL.createObjectURL(file)} alt="Uploaded file" className="w-64 h-64 object-contain mb-4" />
                    ) : (
                        <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-4 mx-2">
                            <span className="text-gray-400">Upload an image</span>
                        </div>
                    )}
                    <input type="file" accept="image/png" onChange={handleFileChange} className="w-full mb-4" />
                    {confirmDeallocate ? (
                        <div className="flex justify-center mb-4 mx-2">
                            <p className="mb-4 text-center">Are You Sure You Want Send a Request For Deallocation</p>
                            <button onClick={handleDeallocateClick} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg mr-4">
                                Yes
                            </button>
                            <button onClick={() => setConfirmDeallocate(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-lg">
                                No
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setConfirmDeallocate(true)} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg mb-4">
                            Deallocate
                        </button>
                    )}
                </div>
                </div>
            </div>
        </div>
    )
}

export default Deallocate
