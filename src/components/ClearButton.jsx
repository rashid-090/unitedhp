import React from 'react';
import { IoMdCloseCircleOutline } from 'react-icons/io';

const ClearButton = ({ onClick, className = '', disabled = false }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center 
        p-2 rounded-full 
        bg-gray-100 hover:bg-gray-200 
        text-gray-600 hover:text-gray-800 
        transition-colors duration-200 
        
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      aria-label="Clear"
    >
      <IoMdCloseCircleOutline size={20} strokeWidth={2} />
    </button>
  );
};

export default ClearButton;