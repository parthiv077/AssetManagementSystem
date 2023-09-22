import React, { useState, useEffect } from 'react'
import UserSidebar from '../../components/UserSidebar';
import axios from 'axios';
import { fetchUserAuth } from '../../components/Verify';

import { useNavigate } from 'react-router-dom';
function RequestedAssets() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const eid = localStorage.getItem('eid')
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    axios.get(`/user/getAllRequestedAssets/${eid}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(response => setAssets(response.data))
      .catch(error => console.log(error));
  }, []);

  const groupedAssets = assets.reduce((accumulator, asset) => {
    const { name, attributes } = asset;
    if (!name || !attributes) return accumulator;

    if (accumulator[name]) {
      accumulator[name].push(attributes);
    } else {
      accumulator[name] = [attributes];
    }

    return accumulator;
  }, {});


  return (
    <div>
      <UserSidebar></UserSidebar>
      <div className='sm:mx-72 lg:mx-72 md:mx-72 mt-20'>
        <div className="bg-white-100 p-6 rounded-md shadow-md">
          <h1 className="text-xl font-bold mb-4">Requested Assets</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(groupedAssets).map(([name, attributesArray], index) => (
              <div key={index} className="bg-white p-4 rounded-md shadow-md">
                <h2 className="text-lg font-bold mb-2">{name}</h2>
                <ul className="list-disc list-inside">
                  {attributesArray.map((attributes, index) => (
                    <li key={index} className="mt-2">
                      {Object.entries(attributes).map(([key, value], index) => (
                        <p key={index}>
                          <span className="font-bold capitalize">{key}: </span>
                          {value}
                        </p>
                      ))}

                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RequestedAssets


