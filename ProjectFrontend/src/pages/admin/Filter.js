import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar"
import LoadingBar from 'react-top-loading-bar';
import { fetchAdminAuth } from "../../components/Verify";

function AssetList() {

  const [progress, setProgress] = useState(0);
  const [searchCriteria, setSearchCriteria] = useState({});
  const handleSearchChange = (column, value) => {
    setSearchCriteria({...searchCriteria, [column]: value});
  };
  
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    fetchAdminAuth(navigate);
    setProgress(20);
    axios.get("/admin/getAllAssets", { headers: { Authorization: `Bearer ${token}` } }).then((response) => {
      setData(response.data);
      setProgress(100);
      //console.log(response.data)
    });
  }, []);

  const getUniqueNames = () => {
    const uniqueNames = [...new Set(data.map((item) => item.name))];
    return uniqueNames;
  };

  const handleFilter = () => {

  };

  const renderTableForName = (name) => {
    const filteredData = data.filter((item) => item.name === name);
    const attributes = Object.keys(filteredData[0].attributes);

    const handleFilter = () => {
      console.log(searchCriteria)
        axios.post('/admin/filterAsset', searchCriteria, { headers: { Authorization: `Bearer ${token}` } }).then((response) => {
          setData(response.data);
        });
      };
      

    return (
        <div key={name} className="mt-8">
        <h2 className="text-lg font-medium">{name}</h2>
        <div className="flex justify-end">
          <button onClick={handleFilter}>Filter</button>
        </div>
        <div className="flex mt-4">
          <input
            type="text"
            placeholder="Allocated To"
            value={searchCriteria.allocatedTo || ''}
            onChange={(event) => handleSearchChange('allocatedTo', event.target.value)}
            className="px-2 py-1 border rounded"
          />
          {/* Add similar input fields for other columns */}
        </div>
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Index</th>
                <th scope="col" className="px-6 py-3">Allocated To</th>
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
                  <td className="px-6 py-4">{item.allocatedTo}</td>
                  {attributes.map((attribute, index) => (
                    <th key={index} scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {item.attributes[attribute]}
                    </th>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => {
                      console.log("id >>", item.assetId)
                      const cofirmed = window.confirm("Are You Sure You Want To Delete Asset From Database");
                      if (cofirmed) {
                        axios.get(`/admin/deleteAsset/${item.assetId}`, { headers: { Authorization: `Bearer ${token}` } }).then((response) => {
                          console.log(response.data)
                          setData(response.data.assets)
                          if (response.status === 200) {
                            alert("Asset Is Removed Successfully");
                          }
                          else {
                            alert("Error Occured");
                          }
                        });
                      }
                    }} className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
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
      <Sidebar></Sidebar>
      <div className="container mx-auto px-4 md:ml-72 mt-20 sm:mx-72 ml-5">
        <h1 className="text-2xl font-bold mt-8">Available Assets</h1>
        {getUniqueNames().map((name) => renderTableForName(name))}
      </div>
    </div>
  );
}

export default AssetList

