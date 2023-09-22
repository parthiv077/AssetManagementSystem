import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import CardList from '../../components/CardList';
import UserSidebar from '../../components/UserSidebar';
import { fetchUserAuth } from '../../components/Verify';
function SearchAsset() {
  const location = useLocation();
const name = location.state.name;
const data = location.state.data;
console.log("data >> " ,data);
  const navigate = useNavigate();
  useEffect(()=>{
    fetchUserAuth(navigate);
  },[])
  return (
    <div>
      <UserSidebar/>
      <div className='sm:mx-72 md:mx-72 lg:mx-72 '>
        <CardList data={data}/>
      </div>
    </div>
  )
}

export default SearchAsset
