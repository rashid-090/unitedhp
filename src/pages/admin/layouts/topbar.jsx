import React, { useState } from 'react';
import Logo from '../../../../public/hp_logo.png'
const Topbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <div className="w-full h-16 bg-gray-100 flex items-center px-4 relative">
      {/* <div className="text-xl font-semibold ">Dashboard</div> */}
      <div className="ml-auto flex items-center space-x-4">
        <button
          onClick={toggleModal}
          className="p-1 rounded-full bg-gray-300 hover:bg-gray-200 focus:outline-none"
        >
          <img
            src={Logo}
            alt="User Avatar"
            className="w-9 h-9 rounded-full"
          />
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="absolute top-16 text-sm border right-2 bg-white shadow-lg rounded-md py-2 w-fit z-50">
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => alert('Profile clicked')}
          >
            Profile
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => alert('Logout clicked')}
          >
            Logout
          </button>
        </div>
      )}

      {/* Overlay to close modal */}
      {isModalOpen && (
        <div
          onClick={toggleModal}
          className="fixed inset-0 bg-black opacity-0 z-40"
        ></div>
      )}
    </div>
  );
};

export default Topbar;
