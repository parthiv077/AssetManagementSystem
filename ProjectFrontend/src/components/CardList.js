import React from 'react'
import Card from './Card';
const CardList = ({ data }) => {
    return (
    //   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    //     {data.map((item, index) => (
    //       <Card key={index} name={item.name} attributes={item.attributes} />
    //     ))}
    //   </div>
    <div className=" min-h-screen py-8 mt-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-gray-800 text-2xl font-bold mb-4">Available Assets Bases On Your Requirements</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((item, index) => (
            <Card key={index} name={item.name} attributes={item.attributes} />
          ))}
        </div>
      </div>
    </div>
    );
  };

export default CardList
