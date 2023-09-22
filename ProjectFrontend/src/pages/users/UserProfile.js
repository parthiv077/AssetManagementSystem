import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import {  fetchUserAuth } from "../../components/Verify";
import Profile from '../../components/Profile';
import UserSidebar from '../../components/UserSidebar';
function UserProfile() {
    const [profile, setProfile] = useState(null)
    const eid = localStorage.getItem('eid');
    const token = localStorage.getItem('token')
    const navigate = useNavigate();


    useEffect(() => {
        fetchUserAuth(navigate);
        axios.get(`/user/getEmployee/${eid}`, { headers: { Authorization: `Bearer ${token}` } }).then((response) => {
            setProfile(response.data);
            console.log(response.data)
        });
    }, []);
    return (
        <div>
            <UserSidebar></UserSidebar>
            <div className='lg:mx-72 sm:mx-72 mt-20 md:mx-72'>
                <Profile user={profile} />
            </div>
        </div>
    )
}

export default UserProfile

