import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import LoadingBar from 'react-top-loading-bar';
import { fetchAdminAuth } from '../../components/Verify';


function AddAssetClass() {

  const [progress, setProgress] = useState(0);

  const [assetClassList, setAssetClassList] = useState([])
  const navigate = useNavigate();
  useEffect(() => { 
    fetchAdminAuth(navigate);
    

    setProgress(20);
    const token = localStorage.getItem("token");
    const fetchData = async () => {
      await axios.get("/admin/getAllClasses",{headers : {Authorization : `Bearer ${token}`}}).then(res => {
        let assetClassList = res.data.map((item) => ({
          name: item.name,
          feilds: item.keys
        }
        )
        );

        console.log(assetClassList)
        setAssetClassList(assetClassList);
      })
      setProgress(100)
    }
    fetchData();
    setProgress(40);

  }, []);
  const handleClick = () => {
    navigate('/addassetclass/addasset')
  }
  return (

    <div>
      <LoadingBar
        color='#0000FF'
        progress={progress}
        height={5}
        onLoaderFinished={() => setProgress(0)}
      />
      <Sidebar></Sidebar>
      <div className='mx-72 mt-16'>

        <h5 className=" mt-0 mb-2 text-xl font-medium leading-tight text-primary">
          Choose Category For Asset or Add Custom Category for Asset
        </h5>
      </div>
      <div className=' mx-72 my-3 grid md:grid-cols-3 md:gap-4'>
        {assetClassList.map((item, index) => (
          <div className="max-w-sm m-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700" key={index}>
            <div className="p-5">

              <h5 className="mb-2 text-2xl  tracking-tight text-gray-900 dark:text-white">{item.name}</h5>

              <button onClick={() => {
                navigate('/addassetclass/addasset', { state: { tags: item.feilds, name: item.name } });

              }} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Select
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className='lg:mx-72 flex flex-col items-center'>
        <button type="button" onClick={() => { navigate('/addassetclass/customclass') }} className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add Custom Category</button>
      </div>
    </div>
  )
}

export default AddAssetClass
