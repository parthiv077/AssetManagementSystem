import React from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// const Card = ({ name, attributes }) => {
//     const attributeList = Object.entries(attributes);

//     return (
//       <div className="max-w-sm rounded overflow-hidden shadow-lg">
//         <div className="px-6 py-4">
//           <div className="font-bold text-xl mb-2">{name}</div>
//           {attributeList.map(([key, value]) => (
//             <p key={key} className="text-gray-700 text-base">
//               <span className="font-bold">{key}:</span> {value}
//             </p>
//           ))}
//         </div>
//       </div>
//     );
//   };



const Card = ({ name, attributes }) => {
    const attributeList = Object.entries(attributes);
    const navigate = useNavigate()


    const handleClick =async()=>{
    const confirmed = window.confirm("Are you sure you want to send  the request ?");
    const AssetRequest={
        name:name,
        employeeId:localStorage.getItem('eid'),
        dateOfRequest:new Date(),
        attributes:attributes
    }
    const token = localStorage.getItem("token");
    console.log(AssetRequest);
        if(confirmed)
       { const response =await axios.post("/user/requestAsset",AssetRequest,{headers : {Authorization : `Bearer ${token}`}});
        console.log(response.data) 
       if(response.data === "Success")
        {
            alert("Your request is considered.\nRequest Send to the admin Successfully");
            navigate("/MakeRequest");
        }
        else {
            alert(response.data);
        }
    }
    }

    return (
        <div className="max-w-md w-full rounded overflow-hidden shadow-lg mx-auto my-4">
            <div className="bg-white p-6">
                <div className="font-bold text-xl mb-2">{name}</div>
                {attributeList.map(([key, value]) => (
                    <div key={key} className="mb-2">
                        <p className="text-gray-600 text-sm">{key}</p>
                        <p className="text-gray-900 font-semibold">{value}</p>
                    </div>
                ))}
                <button onClick={handleClick} className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-full">
                    Make Request
                </button>
            </div>

        </div>
    );
};

export default Card