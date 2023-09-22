import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar';
import LoadingBar from 'react-top-loading-bar';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { fetchAdminAuth } from '../../components/Verify';
import { FaFile } from 'react-icons/fa';

function AddAsset() {

  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState(null);
  const Navigate = useNavigate();

  useEffect(() => {              //aa navu naikhu 6
    fetchAdminAuth(Navigate);
  }, [])
  const token = localStorage.getItem("token");
  const location = useLocation();
  const Fields = location.state.tags
  const name = location.state.name;
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);

  const [params, setParams] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setParams((prevParamsData) => ({
      ...prevParamsData,
      [name]: value,
    }))
    console.log(params);

  };

  const handleSubmit = async (e) => {
    setProgress(10);
    e.preventDefault();
    setProgress(20);
    const AddAssetInfo = { name, params };
    setProgress(30);
    // console.log("AddAssetInfo >> ", AddAssetInfo);
    const response = await axios.post("/admin/addAsset", AddAssetInfo, { headers: { Authorization: `Bearer ${token}` } });
    // console.log(response);
    setProgress(50);
    if (response.status === 200) {
      setProgress(90);
      alert("Asset added Succesfully");
      setProgress(100);
      navigate('/assetlist')
    }
    else{
      alert("Error Occur During Adding Assets Please Try Again")
    }
  }
  const downloadExcel = async () => {
    setProgress(10);
    const response = await axios.get(`/admin/assetClassExcel/${name}`, { responseType: 'blob', headers: { Authorization: `Bearer ${token}` } });
    console.log(response.data.name);
    setProgress(20);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    setProgress(30);
    link.href = url;
    link.setAttribute('download', `${name}.xlsx`); // Set your file name here
    setProgress(60);
    document.body.appendChild(link);
    link.click();
    setProgress(100);


  }
    const handleFileInput = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const base64String = btoa(XLSX.write(workbook, { type: 'binary', bookType: 'xlsx' }));
        setSelectedFile(base64String)
      };
      reader.readAsArrayBuffer(file);
      setFile(file);
    };
    
    const handleUpload = async (event) => {
      const ExcelObj = {
        name : `${name}`,
        excelBytes : `${selectedFile}`
      }
      const response = await axios.post("/admin/addAssetExcel", ExcelObj, { headers: { Authorization: `Bearer ${token}` } });
      if(response.status === 200){
        alert("Successfully inserted.");
        navigate("/userdashboard")
      }
    };
    const excelFileToJSON = (file) => {
      try {
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = (e) => {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: "binary" });
          var result = {};
  
          workbook.SheetNames.forEach(function (sheetName) {
            var roa = XLSX.utils.sheet_to_row_object_array(
              workbook.Sheets[sheetName]
            );
            if (roa.length > 0) {
              result[sheetName] = roa;
            }
          });
          //setJsonData(result);
          return {
              type:"data",
              exceldata: result
          }
        };
      } catch (error) {
        console.log(error);
        return {
          type: "error",
          error: error[0]
      }
      }
    };
    const readUploadFile = (files) => {
      if (files.length === 0) {
        alert("Please choose any file...");
        return;
      }
      var filename = files[0].name;
      var extension = filename.substring(filename.lastIndexOf(".")).toUpperCase();
      if (extension === ".XLS" || extension === ".XLSX") {
        // console.log(files[0]);
        return excelFileToJSON(files[0]);
      } else {
              return {
              type: "error",
              message:"Please select a valid excel file."
          }
      }
    };
  const handleOpenFile = () => {
    const url = URL.createObjectURL(file);
    window.open(url);
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
        <div className=" w-full flex flex-col lg:ml-72 sm:ml-72 mt-20">
          <h1 className="text-xl font-medium mb-2">Add Data Through Excel</h1>
          <div className="w-full border-b-2 mb-4 drop-shadow-sm"></div>
        </div>

        <div className=" flex gap-8 flex-row sm:mx-72 md:mx-72  justify-center items-center border-slate-400 border-dotted border-[2px] mx-3 px-4 py-4 rounded-3xl">
        {file && (
        <div className="flex items-center bg-white rounded-lg shadow-md px-4 py-3 mt-4">
          <FaFile className="text-blue-500 mr-2" />
          <span className="mr-2">{file.name}</span>
          <button onClick={handleOpenFile} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Open
          </button>
        </div>
      )}
          <button onClick={downloadExcel} className=" bg-grey-light py-2 px-5  text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center">
            <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg>
            <span>Download Template File</span>
          </button>
          <label htmlFor="file-input" className="bg-gray-200 rounded-lg py-2 px-4 text-gray-700 font-bold cursor-pointer hover:bg-gray-300 ">
            Choose a file
          </label>
          <input
            id="file-input"
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileInput}
            className="hidden "
          />
          <button onClick={handleUpload} className=" ml-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg ">
            Upload
          </button>
        </div>

          <div className="flex flex-col lg:ml-72 sm:ml-72 text-gray-400 mt-10">
            -------------------------------------------------------------------OR-------------------------------------------------------------------
          </div>

        <div className="flex flex-col lg:ml-72 sm:ml-72 mt-10">
          <h1 className="text-xl font-medium mb-2">Enter the Required Fields For {name}</h1>
          <div className="w-full border-b-2 mb-4 drop-shadow-sm"></div>
        </div>
        <div className=' sm:mx-72 md:mx-72 mx-5'>
          <form onSubmit={handleSubmit}>
            {Fields.map((field) => (
              <div className="relative z-0 w-full mb-4 group" key={field}>
                <input type="text" onChange={handleInputChange} name={field} id={field} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                <label htmlFor={field} className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">{field}</label>
              </div>
            ))}

            <div className='authButtons flex flex-row items-center justify-center py-10'>
              <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mx-5 ">Add Asset</button>
              <button type="button" onClick={() => { Navigate('/admindashboard') }} className="text-white bg-slate-400 hover:bg-slate-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-slate-400 dark:hover:bg-slate-500 dark:focus:ring-blue-800 ">Cancel</button>
            </div>

          </form>
        </div>
      </div>
    )
  }

  export default AddAsset