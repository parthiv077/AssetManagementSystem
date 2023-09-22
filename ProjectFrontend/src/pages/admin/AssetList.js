import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar"
import LoadingBar from 'react-top-loading-bar';
import { fetchAdminAuth } from "../../components/Verify";
import './assetlist.css';

function AssetList() {

  const [progress, setProgress] = useState(0);
  const [searchbar, setSearchbar] = useState(false);
  const [data, setData] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [buffer, setBuffer] = useState([]);
  const [message, setMessage] = useState(false);


  useEffect(() => {
    fetchAdminAuth(navigate);
    setProgress(20);
    axios.get("/admin/getAllAssets", { headers: { Authorization: `Bearer ${token}` } }).then((response) => {
      setData(response.data);
      setBuffer(response.data);
      setProgress(100);
      console.log(response.data)
    });
  }, []);

  const getUniqueNames = () => {
    const uniqueNames = [...new Set(data.map((item) => item.name))];
    return uniqueNames;
  };

  // const handleFilterClick = () => {
  //   const filteredData = data.filter(item => item.attributes[filterCategory].toLowerCase() === filterValue.toLowerCase());
  //   console.log("Filter data >> ", filteredData)
  //   if (filteredData.length != 0) { setData(filteredData); }
  //   else {
  //     setMessage(true)
  //     setData(buffer)
  //   }
  // };
  const handleFilterClick = (name) => {
    const filteredData = buffer.filter((item) => item.name ===name).filter((item) => item.attributes[filterCategory].toLowerCase() === filterValue.toLowerCase());
    console.log("Filter data >> ", filteredData)
    if (filteredData.length !== 0) {
      setData(filteredData);
      setMessage(false);
    } else {
      setMessage(true);
      setData(buffer);
    }
  };
    
  const downloadAsset = async (className) => {
    const response = await axios.post(`/admin/downloadAssetExcel`,{ name : className , params : {} }, { headers: { Authorization: `Bearer ${token}` } });

    const binaryString = window.atob(response.data.excelBytes);
    const binaryData = new ArrayBuffer(binaryString.length);
    const dataView = new DataView(binaryData);
    for (let i = 0; i < binaryString.length; i++) {
      dataView.setUint8(i, binaryString.charCodeAt(i));
    }

    const blob = new Blob([binaryData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${response.data.name}.xlsx`);
    document.body.appendChild(link);
    link.click();
  }

  const renderTableForName = (name) => {
    const filteredData = data.filter((item) => item.name === name);
    const attributes = Object.keys(filteredData[0].attributes);

    return (
      <div key={name} className="mt-8">
        <div className="flex flex-col sm:flex-row justify-between">
          <h2 className="text-lg text-left mb-2 sm:mb-0 font-medium">{name}</h2>
          {!searchbar ? (<button type="button" onClick={() => { setSearchbar(true) }} className="text-right text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5   mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 mr-96">Filter</button>) : (<button type="button" onClick={() => { setSearchbar(false); setData(buffer); setFilterValue('') }} className="text-right text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5   mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 mr-96">Clear Filter</button>)}
        </div>
        {searchbar && (
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex-1">
              <select
                className="w-40 border border-gray-400 py-2 px-3 rounded-lg"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                {attributes.map((attr) => (
                  <option value={attr}>{attr}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <input
                className="w-40 border border-gray-400 py-2 px-3 rounded-lg"
                type="text"
                value={filterValue}
                onChange={(e) => { setFilterValue(e.target.value); console.log(filterValue) }}
              />
            </div>
            <div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-96"
                onClick={()=>handleFilterClick(name)}
              >
                Search
              </button>
            </div>
          </div>
        )}{message && (<h2 className="text-lg text-left mb-2 sm:mb-0 font-medium text-red-600">Sorry Not Available</h2>)}
        <div className="max-h-80 scrolling">

        <table className="mt-10 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
          <div className="max-h-80 overflow-y-auto"></div>
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
        </table>
        </div>
        <button type="button" onClick={() => downloadAsset(name)} className="mr-auto text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800">Download Asset List</button>
        
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
      <div class="container mx-auto px-4 md:ml-72 mt-20 sm:mx-72 ml-5">
        <h1 class="text-2xl font-bold mt-8">Available Assets</h1>
        {getUniqueNames().map((name) => (<>
          <div class="">  
            {renderTableForName(name)}
          </div>
        </>

        ))}
      </div>
    </div>
  );
}

export default AssetList
