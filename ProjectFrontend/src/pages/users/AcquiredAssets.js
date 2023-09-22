import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { fetchUserAuth } from '../../components/Verify';
import { Link, useNavigate } from "react-router-dom";
import UserSidebar from "../../components/UserSidebar"
import LoadingBar from 'react-top-loading-bar';
function AcquiredAssets() {
  const [progress, setProgress] = useState(0);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const eid = localStorage.getItem("eid")
  const token = localStorage.getItem("token");
  const getUniqueNames = () => {
    const uniqueNames = [...new Set(data.map((item) => item.name))];
    return uniqueNames;
  };
  useEffect(() => {
    fetchUserAuth(navigate);
    setProgress(20);
    axios.get(`/user/getAllAssets/${eid}`, { headers: { Authorization: `Bearer ${token}` } }).then((response) => {
      setData(response.data);
      setProgress(100);
      console.log(response.data)
    });
  }, []);
  const renderTableForName = (name) => {
    const filteredData = data.filter((item) => item.name === name);
    const attributes = Object.keys(filteredData[0].attributes);

    return (
      <div key={name} className="mt-8">
        <h2 className="text-lg font-medium">{name}</h2>
        <table className="mt-5 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Index</th>
              {attributes.map((attribute, index) => (
                <th scope="col" className="px-6 py-3">
                  {attribute}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={item.assetId} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-4">{index + 1}</td>
                {attributes.map((attribute, index) => (
                  <th key={index} scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {item.attributes[attribute]}
                  </th>
                ))}

                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => {console.log(item.aid)
                    navigate('/deallocateasset', { state: {  assetId: item.aid} })
                  
                  }} className="text-red-600 hover:text-red-900">
                    Deallocate Asset
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <LoadingBar
        color='#0000FF'
        progress={progress}
        height={5}
        onLoaderFinished={() => setProgress(0)}
      />
      <UserSidebar></UserSidebar>
      <div className='md:mx-72 lg:mx-72 sm:mx-72'>



        {data.length > 0 ? (<div className='mt-20'>
          <h1 className="text-2xl font-bold mt-8">Acquired Assets</h1>
          {getUniqueNames().map((name) => renderTableForName(name))}
        </div>) : (
          <div className="flex flex-col items-center justify-center h-screen">
            <div className="bg-red-500 text-white font-bold rounded-lg border shadow-lg p-10">
              <p className="mb-4 text-center">Sorry You have No Acquired Assets Right Now</p>
              <Link to="/makerequest" className="block text-center underline hover:text-gray-900">Click here to Make Request For Asset</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AcquiredAssets