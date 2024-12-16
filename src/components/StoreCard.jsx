import React from "react";
import { BiSolidMessageMinus } from "react-icons/bi";
import { FaPhone, FaPhoneAlt } from "react-icons/fa";
import { HiMiniBuildingOffice } from "react-icons/hi2";
import { IoMdTime } from "react-icons/io";
import { PiEye } from "react-icons/pi";
import { Link } from "react-router-dom";

const StoreCard = ({ store }) => {
  return (
    <div className="shadow w-full flex flex-col sm:flex-row items-start sm:items-center border rounded-xl p-4 hover:shadow-md transition-all duration-300 space-y-3 sm:space-y-0 sm:space-x-4 mb-4">
      {/* Store Info Section */}
      <div className="flex-grow w-full min-w-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-800 truncate w-full sm:w-auto mb-2 sm:mb-0">
            {store.name}
          </h3>
        </div>

        <div className="grid grid-cols-1  gap-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <IoMdTime className="text-main min-w-[20px]" />
            <span className="truncate">Open until {store.closingTime}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaPhoneAlt className="text-main min-w-[20px]" />
            <span className="truncate">{store.contactNumber}</span>
          </div>
          <div className="flex items-center space-x-2 lg:col-span-2">
            <HiMiniBuildingOffice className="text-main min-w-[20px]" />
            <span className="truncate">{store.address}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full sm:w-auto flex flex-row sm:flex-col justify-between sm:justify-center items-center space-x-3 sm:space-x-0 sm:space-y-2">
        <div className="flex space-x-2 relative">
          <button
            className="bg-main/10 group text-main hover:bg-main hover:text-white p-2 rounded-lg transition-colors"
            aria-label="Call Store"
          >
            <FaPhoneAlt className="text-lg" />
            <div className="bg-gray-300 p-1 left-0 text-sm absolute rounded-lg hidden group-hover:block -top-7">
              Call
            </div>
          </button>
          <button
            className="bg-main/10 text-main group hover:bg-main hover:text-white p-2 rounded-lg transition-colors"
            aria-label="Message Store"
          >
            <BiSolidMessageMinus className="text-lg" />
            <div className="bg-gray-300 p-1 text-sm left-0 absolute rounded-lg hidden group-hover:block -top-7">
              Message
            </div>
          </button>
        </div>

        <Link
          to={`/store/${store._id}`}
          className="flex items-center text-main hover:underline text-xs space-x-1"
        >
          <PiEye className="text-base" />
          <span className="text-nowrap">View Details</span>
        </Link>
      </div>
    </div>
  );
};

export default StoreCard;
