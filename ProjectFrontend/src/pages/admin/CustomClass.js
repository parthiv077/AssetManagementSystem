import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { fetchAdminAuth } from '../../components/Verify';
function CustomClass() {
    const [name, setName] = useState();
    const [fieldList, setFieldList] = useState([""]);
    const Navigate = useNavigate();
    useEffect (()=>{
        fetchAdminAuth(Navigate);
    },[])
   // const [temp, setTemp] = useState("");
   // const [key, setKey] = useState(Math.random())
    // const [keys,setKeys] = useState([]);
    const addField = () => {
        setFieldList([...fieldList,""])
        // setKeys([...keys,temp])
        // console.log(keys);
    }
    const remove = (index) =>{
        const list = [...fieldList]
        list.splice(index,1);
        setFieldList(list);

        // const x = [...keys];
        // x.splice(index,1)
        // setKeys(x);

    }
    console.log(fieldList);

    // console.log("FieldList >> ", fieldList)
    const handleSubmit=async(e)=>{

        // setKeys(...keys,temp)
        e.preventDefault()
        const token = localStorage.getItem("token");
        const AssetClass={name,keys : fieldList};
        console.log(AssetClass)
        const response = await axios.post("/admin/addAssetClass",AssetClass,{headers : {Authorization : `Bearer ${token}`}});
        
        if(response.status===200)
        {
            alert("Class Added Succesfully");
            Navigate('/addassetclass')
        }
    }

    return (
        <div>
            <Sidebar></Sidebar>
            <div>

                <form>
                    <div className="mt-20 ml-72">
                        <label htmlFor="AssetClassName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter Name Of Asset Category</label>
                        <input  onChange={(e)=>{setName(e.target.value)}} type="text" id="AssetClassName" className="w-2/6 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Name" required />
                    </div>
                    <div className="mt-10 ml-72">
                        <label htmlFor="keys" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fields</label>

                        {fieldList.map((singleField, index) => (
                            <div key={index}>
                                <div className="my-2 flex flex-row flex-wrap">
                                    <input onChange={(e) =>{
                                        let fields = fieldList;
                                        fields[index] = e.target.value;
                                        setFieldList(fields);

                                    }} values = { singleField } type="text" id="keys" name="field" className="mt-1 w-2/6  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='Field' required />
                                    {fieldList.length>1 &&(
                                        <button onClick={()=>{
                                            let field = fieldList.filter((item, itemIndex) => itemIndex != index);
                                            // console.log("filtered >> " , fi)
                                            setFieldList(field);
                                        // setKey(Math.random())
                                            

                                        }} type="button" className="ml-2 text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center  dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">Remove</button>
                                    )}
                                    
                                </div>
                                {fieldList.length - 1 === index &&  (
                                    <div className='mt-2'>
                                        <button onClick={addField} className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                                            <span className="relative px-4 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                                Add Field
                                            </span>
                                        </button>
                                    </div>
                                )}

                            </div>
                        ))}


                    </div>

                    <button onClick={handleSubmit} className="ml-72 mt-10 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                </form>

            </div>
        </div>
    )
}

export default CustomClass
