import React, { useEffect, useState } from "react";
import { FaPhoneAlt, FaRegCalendarAlt, FaStore } from "react-icons/fa";
import BannerImage from "../assets/images/Banner.webp";
import axios from "axios";
import { URL } from "../Common/api";
import { useParams } from "react-router-dom";

const StoreInner = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [store, setstore] = useState();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${URL}/user/store/${id}`);
        setstore(res.data.store);
        console.log(res);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  function getFormatedTime(time24) {
    // Split the time string into hours and minutes
    if (!time24) {
      return "";
    }
    const [hours, minutes] = time24.split(":");

    // Initialize the 12-hour format time
    let time12 = "";

    // Convert the hours to 12-hour format
    let hour = parseInt(hours);
    let ampm = "AM";
    if (hour > 12) {
      hour -= 12;
      ampm = "PM";
    } else if (hour === 0) {
      hour = 12;
    }

    // Construct the 12-hour format time
    time12 = `${hour.toString()}:${minutes} ${ampm}`;

    return time12;
  }

  function isWithinOpeningHours(openingTime, closingTime) {
    // Convert the opening and closing times to Date objects
    const openingDate = new Date();

    if (!openingTime || !closingTime) {
      return "";
    }
    const [openingHours, openingMinutes] = openingTime.split(":").map(Number);
    openingDate.setHours(openingHours, openingMinutes, 0, 0);

    const closingDate = new Date();
    const [closingHours, closingMinutes] = closingTime.split(":").map(Number);
    closingDate.setHours(closingHours, closingMinutes, 0, 0);

    // Get the current time as a Date object
    const currentDate = new Date();

    // Check if the current time is between the opening and closing times
    if (currentDate >= openingDate && currentDate < closingDate) {
      return true;
    } else {
      return false;
    }
  }

  if (isLoading) {
    return <h1>Loading</h1>;
  }

  return (
    <div className="min-h-[calc(100vh-9rem)] bg-gray-100 py-8 px-4 md:px-8 lg:px-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Section */}
        <div className="bg-white p-6 h-fit rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">{store.name}</h2>
          <div className="flex items-center mb-4">
            <FaRegCalendarAlt className="text-blue-500 mr-2" />
            <p>Open {getFormatedTime(store.closingTime)}</p>

            {isWithinOpeningHours(store?.openingTime, store?.closingTime) ? (
              <button className="ml-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                OPEN NOW
              </button>
            ) : (
              <button className="ml-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">
                CURRENTLY CLOSED
              </button>
            )}
          </div>
          <div className="flex items-center mb-4">
            <FaPhoneAlt className="text-blue-500 mr-2" />
            <a
              href={`tel:${store.contactNumber}`}
              className="text-blue-500 hover:underline"
            >
              Call {store.contactNumber}
            </a>
          </div>
          <div className="flex items-center mb-4">
            <FaPhoneAlt className="text-blue-500 mr-2" />
            <p>Request a Call Back</p>
          </div>
          {/* <div className="flex items-center">
            <FaStore className="text-blue-500 mr-2" />
            <p>Get Store Details on Phone</p>
          </div> */}
          <p className="mt-4 text-gray-600">Call to check for home delivery</p>
          <div className="mt-4">
            <p className="text-gray-600">{store.address}</p>

            <p className="text-gray-600">{store.pinCode}</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <img
            src={BannerImage}
            alt="HP Laptop"
            className="w-full h-auto rounded-lg mb-4"
          />
        </div>
      </div>
      {store?.about && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">About {store.name}</h2>
          <p className="text-gray-600">{store.about}</p>
        </div>
      )}
    </div>
  );
};

export default StoreInner;
