import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Required Leaflet styles
import L from "leaflet";

import { BsSuitcaseLg } from "react-icons/bs";
import { HiMiniBuildingOffice } from "react-icons/hi2";
import { FaPhone } from "react-icons/fa6";
import { BiSolidMessageMinus } from "react-icons/bi";
import { LuCalendarClock } from "react-icons/lu";
import { PiEye } from "react-icons/pi";
import { IoMdTime } from "react-icons/io";

import Shop from "../assets/images/15861 (1).jpg";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

// Define a custom marker icon
const customIcon = L.icon({
  iconUrl: "/../public/map-marker.svg", // Path to your custom marker image
  iconSize: [32, 32], // Size of the icon [width, height]
  iconAnchor: [16, 32], // Point of the icon which corresponds to the marker's location
  popupAnchor: [0, -32], // Point from which the popup should open relative to the iconAnchor
});

const Home = () => {
  // Locations array (example data)
  const locations = [
    { id: 1, name: "Store 1", lat: 11.258753, lng: 75.780411 },
    { id: 2, name: "Store 2", lat: 11.268019021984289, lng: 75.94278694739964 },
    { id: 3, name: "Store 3", lat: 10.527642, lng: 76.214434 },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
   
  };

  return (
    <section className=" space-y-10 ">
      <div className="bg-ptn-bg bg-cover py-20">
        {/* search */}
        <h1 className="text-4xl font-medium text-white text-center pb-2 uppercase">
          HP World
        </h1>
        <form className="w-11/12 xl:w-10/12 mx-auto  p-5 bg-white rounded-2xl flex flex-col xl:flex-row gap-5 items-center xl:gap-3 text-sm">
          <div className="flex flex-col xl:flex-row gap-3 xl:divide-x-2 items-center w-full">
            <div className="w-full xl:pr-5">
              <select className="w-full  rounded-lg outline-none ">
                <option value="">Select District</option>
                <option value="Assam">Assam</option>
                <option value="Kerala">Kerala</option>
                <option value="Tamilnadu">Tamilnadu</option>
              </select>
            </div>
            <div className="w-full xl:pl-3">
              <select className="w-full  rounded-lg outline-none ">
                <option value="">Select City</option>
                <option value="Kozhikode">Kozhikode</option>
                <option value="Malappuram">Malappuram</option>
                <option value="Kannur">Kannur</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button className="border h-11 px-8 rounded-xl text-sm font-medium tracking-wider border-main hover:border-main text-main hover:text-white hover:bg-black duration-200">
              Reset
            </button>
            <button
              onClick={handleSearch}
              className="border border-gray-300 h-11 px-8 rounded-xl text-sm font-medium tracking-wider bg-main text-white hover:bg-black duration-200"
            >
              Search
            </button>
          </div>
        </form>
      </div>
      {/* map */}
      <div className="w-11/12 xl:w-10/12 mx-auto h-[50vh] rounded-xl overflow-hidden">
        <MapContainer
          center={[11.258753, 75.780411]} // Initial map center
          zoom={8} // Zoom level
          className="w-full h-full"
        >
          {/* Add Google Maps Tile Layer */}
          <TileLayer
            url={`https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}`}
            attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
          />
          {locations.map((location) => (
            <Marker
              key={location.id}
              position={[location.lat, location.lng]}
              icon={customIcon} // Apply the custom icon
            >
              <Popup>{location.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      {/* location lists */}
      <div className="w-11/12 xl:w-10/12 mx-auto pb-10">
        <p className="text-xl font-medium pb-2">HP World Stores in Kozhikode</p>
        {/* list */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <div className="border p-5 rounded-xl hover:bg-gray-100 hover:border-main duration-500 hover:shadow-lg">
            <div className="pt-3 text-sm flex flex-col gap-3">
              {/* <img className="rounded-lg" src={Shop} alt="" /> */}

              <p className="text-lg font-semibold">ABC Enterprise</p>

              <span className="flex gap-2">
                <div>
                  <IoMdTime className="text-xl text-main" />
                </div>
                <p>open until 08:30 PM</p>
              </span>
              <span className="flex gap-2">
                <div>
                  <HiMiniBuildingOffice className="text-xl text-main" />
                </div>
                <p>
                  Lorem ipsum dolor sit amet consectetur,<br></br> adipisicing
                  elit. Odio,<br></br> recusandae. 67300
                </p>
              </span>
              <p className="font-semibold">Call to check for home delivery</p>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative group">
                    <button className="bg-transparent text-main hover:bg-main hover:text-white border p-2 w-fit rounded-lg flex items-center justify-center gap-2">
                      <FaPhone className="text-lg" />
                    </button>
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block text-xs px-2 bg-gray-600 text-white p-1 rounded-lg shadow-lg">
                      Call
                    </span>
                  </div>
                  <div className="relative group">
                    <button className="bg-transparent text-main hover:bg-main hover:text-white border p-2 w-fit rounded-lg flex items-center justify-center gap-2">
                      <BiSolidMessageMinus className="text-lg" />
                    </button>
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block text-xs px-2 bg-gray-600 text-white p-1 rounded-lg shadow-lg">
                      Message
                    </span>
                  </div>
                </div>

                <Link className="flex gap-1 items-center capitalize hover:underline">
                  <PiEye className="text-base text-main" />
                  <p className="text-xs">view store details</p>
                </Link>
              </div>
            </div>
          </div>
          {/*  */}
          <div className="border p-5 rounded-xl hover:bg-gray-100 hover:border-main duration-500 hover:shadow-lg">
            <div className="pt-3 text-sm flex flex-col gap-3">
              {/* <img className="rounded-lg" src={Shop} alt="" /> */}

              <p className="text-lg font-semibold">ABC Enterprise</p>

              <span className="flex gap-2">
                <div>
                  <IoMdTime className="text-xl text-main" />
                </div>
                <p>open until 08:30 PM</p>
              </span>
              <span className="flex gap-2">
                <div>
                  <HiMiniBuildingOffice className="text-xl text-main" />
                </div>
                <p>
                  Lorem ipsum dolor sit amet consectetur,<br></br> adipisicing
                  elit. Odio,<br></br> recusandae. 67300
                </p>
              </span>
              <p className="font-semibold">Call to check for home delivery</p>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative group">
                    <button className="bg-transparent text-main hover:bg-main hover:text-white border p-2 w-fit rounded-lg flex items-center justify-center gap-2">
                      <FaPhone className="text-lg" />
                    </button>
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block text-xs px-2 bg-gray-600 text-white p-1 rounded-lg shadow-lg">
                      Call
                    </span>
                  </div>
                  <div className="relative group">
                    <button className="bg-transparent text-main hover:bg-main hover:text-white border p-2 w-fit rounded-lg flex items-center justify-center gap-2">
                      <BiSolidMessageMinus className="text-lg" />
                    </button>
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block text-xs px-2 bg-gray-600 text-white p-1 rounded-lg shadow-lg">
                      Message
                    </span>
                  </div>
                </div>

                <Link className="flex gap-1 items-center capitalize hover:underline">
                  <PiEye className="text-base text-main" />
                  <p className="text-xs">view store details</p>
                </Link>
              </div>
            </div>
          </div>
          {
            /*  */
            <div className="border p-5 rounded-xl hover:bg-gray-100 hover:border-main duration-500 hover:shadow-lg">
              <div className="pt-3 text-sm flex flex-col gap-3">
                {/* <img className="rounded-lg" src={Shop} alt="" /> */}

                <p className="text-lg font-semibold">ABC Enterprise</p>

                <span className="flex gap-2">
                  <div>
                    <IoMdTime className="text-xl text-main" />
                  </div>
                  <p>open until 08:30 PM</p>
                </span>
                <span className="flex gap-2">
                  <div>
                    <HiMiniBuildingOffice className="text-xl text-main" />
                  </div>
                  <p>
                    Lorem ipsum dolor sit amet consectetur,<br></br> adipisicing
                    elit. Odio,<br></br> recusandae. 67300
                  </p>
                </span>
                <p className="font-semibold">Call to check for home delivery</p>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative group">
                      <button className="bg-transparent text-main hover:bg-main hover:text-white border p-2 w-fit rounded-lg flex items-center justify-center gap-2">
                        <FaPhone className="text-lg" />
                      </button>
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block text-xs px-2 bg-gray-600 text-white p-1 rounded-lg shadow-lg">
                        Call
                      </span>
                    </div>
                    <div className="relative group">
                      <button className="bg-transparent text-main hover:bg-main hover:text-white border p-2 w-fit rounded-lg flex items-center justify-center gap-2">
                        <BiSolidMessageMinus className="text-lg" />
                      </button>
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block text-xs px-2 bg-gray-600 text-white p-1 rounded-lg shadow-lg">
                        Message
                      </span>
                    </div>
                  </div>

                  <Link className="flex gap-1 items-center capitalize hover:underline">
                    <PiEye className="text-base text-main" />
                    <p className="text-xs">view store details</p>
                  </Link>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  );
};

export default Home;
