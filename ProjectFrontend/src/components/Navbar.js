import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from './Auth';
function Navbar() {
  const auth = useAuth();
  return (
    <div>
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">AssetManagementSystem</span>
            </div>
            <div className="flex items-center">
              <div className="flex items-center ml-3">
                <div className='flex'>
                  <div className='mx-5'>
                  <Link to="/request">
                  <span class="relative inline-block">
                    <svg class="w-6 h-6 text-gray-700 fill-current" viewBox="0 0 20 20"><path d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clip-rule="evenodd" fill-rule="evenodd"></path></svg>
                    <span class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">0</span>
                  </span>
                </Link>
                </div>
                <Link to="/profile" type="button" className="flex text-sm bg-slate-400 rounded-full focus:ring-4 focus:ring-slate-400 dark:focus:ring-gray-600"  >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </Link>
                <button className={"bg-blue-500 hover:bg-blue-700 text-white font-bold  px-2 mx-2 rounded"} onClick={() => { auth.logout() }}>Logout</button>
              </div>
            </div>
          </div>
        </div>
    </div>
      </nav >
    </div >
  )
}

export default Navbar
