import React from 'react';
import { Link } from 'react-router-dom';

const Success = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-green-500 text-white font-bold rounded-lg border shadow-lg p-10">
        <p className="mb-4 text-center">Your password has been changed successfully.</p>
        <p className="mb-4 text-center">You are registered to DDU AMS system.</p>
        <Link to="/" className="block text-center underline hover:text-gray-900">Click here to go to login page</Link>
      </div>
    </div>
  );
};

export default Success;
