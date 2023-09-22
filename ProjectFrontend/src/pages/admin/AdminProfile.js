import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { fetchAdminAuth } from "../../components/Verify";
import Sidebar from '../../components/Sidebar';
import Profile from '../../components/Profile';
function AdminProfile() {
    const [profile, setProfile] = useState(null)
    const eid = localStorage.getItem('eid');
    const token = localStorage.getItem('token')
    const navigate = useNavigate();


    useEffect(() => {
        fetchAdminAuth(navigate);
        axios.get(`/admin/getEmployee/${eid}`, { headers: { Authorization: `Bearer ${token}` } }).then((response) => {
            setProfile(response.data);
            console.log(response.data)
        });
    }, []);
    return (
        <div>
            <Sidebar></Sidebar>
            <div className='lg:mx-72 sm:mx-72 mt-20 md:mx-72'>
                <Profile user={profile} />

            </div>
        </div>
    )
}

export default AdminProfile

