import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
import BannerCarousel from "../components/BannerCarousel";

// Icons
import { FaPhoneAlt, FaPhone } from "react-icons/fa";
import { HiMiniBuildingOffice } from "react-icons/hi2";
import { BiSolidMessageMinus } from "react-icons/bi";
import { PiEye } from "react-icons/pi";
import { IoMdTime } from "react-icons/io";

import api from "../utils/api";
import { URL } from "../Common/api";
import { IoLocationOutline } from "react-icons/io5";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import StoreCard from "../components/StoreCard";

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // State for form and search results
  const [formData, setFormData] = useState({
    district: "",
    city: "",
  });

  const [selectedDistrict, setSelectedDistrict] = useState({
    id: null,
    name: null,
  });

  const bannerImages = [
    "/path/to/image1.jpg",
    "/path/to/image2.jpg",
    "/path/to/image3.jpg",
  ];

  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [relatedCities, setRelatedCities] = useState([]);
  const [stores, setStores] = useState([]);
  const [avalableStores, setAvalableStores] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState({
    district: "",
    city: "",
  });

  // Persist search results in localStorage
  useEffect(() => {
    // Check if we have stored search results
    const storedSearchResults = localStorage.getItem("searchResults");
    const storedAvailableStores = localStorage.getItem("availableStores");
    const storedSelectedLocation = localStorage.getItem("selectedLocation");

    if (storedSearchResults) {
      setStores(JSON.parse(storedSearchResults));
    }

    if (storedAvailableStores) {
      setAvalableStores(JSON.parse(storedAvailableStores));
    }

    if (storedSelectedLocation) {
      setSelectedLocation(JSON.parse(storedSelectedLocation));
    }
  }, []);

  // Fetch districts and cities on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resDistricts = await axios.get(`${URL}/super-admin/districts`);
        setDistricts(resDistricts?.data?.districts);

        const resCities = await axios.get(`${URL}/user/cities`);
        setCities(resCities?.data?.cities);
      } catch (err) {
        console.log(err);
        toast.error("Error fetching districts and cities");
      }
    };

    fetchData();
  }, []);

  // Handle district selection
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "district") {
      setSelectedDistrict({ id: value });
      const filteredCities = cities.filter(
        (city) => city.district._id == value
      );
      setRelatedCities(filteredCities);

      // Reset city when district changes
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      setFormData((prev) => ({
        ...prev,
        city: "",
      }));
    }
  };

  // Handle city selection
  const handleCityChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit search
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.district === "" || formData.district === null) {
      setAvalableStores(0);
      setStores([]);
      return toast.error("Please select district.");
    }

    try {
      // localStorage.removeItem("selectedLocation");

      const queryParams = new URLSearchParams();
      if (formData.district) queryParams.append("district", formData.district);
      if (formData.city) queryParams.append("city", formData.city);

      const response = await api.get(`/user/dealers?${queryParams.toString()}`);

      if (response.status) {
        const dealersData = response.data.dealers;
        const totalAvailableDealers = response.data.totalAvailableDealers;

        // Update state
        setStores(dealersData);
        setAvalableStores(totalAvailableDealers);

        const cityName = cities.find(
          (city) => city._id === formData?.city
        )?.name;
        // console.log("formData.city:", formData?.city);
        // console.log("cities:", cities);
        // const ids = cities.map((city) => city._id);
        // console.log("All city IDs:", ids);
        // console.log(
        //   "Is formData.city in cities?",
        //   ids.includes(formData?.city)
        // );
        // console.log(cityName);

        // Set selected location
        const locationInfo =
          dealersData.length > 0
            ? {
                district: dealersData[0]?.district?.name,
                city: cityName,
              }
            : { district: "", city: "" };

        setSelectedLocation(locationInfo);

        // Persist search results in localStorage
        localStorage.setItem("searchResults", JSON.stringify(dealersData));
        localStorage.setItem(
          "availableStores",
          JSON.stringify(totalAvailableDealers)
        );
        localStorage.setItem("selectedLocation", JSON.stringify(locationInfo));

        toast.success(`${totalAvailableDealers} Dealers found.`);
      }
    } catch (error) {
      console.error("Error fetching dealers:", error);
      toast.error("Error finding dealers");
    }
  };

  // Reset search form
  const handleReset = (e) => {
    e.preventDefault();

    // Clear form data
    setFormData({
      district: null,
      city: null,
    });

    // Clear related cities
    setRelatedCities([]);

    // Clear search results from state and localStorage
    setStores([]);
    setAvalableStores(0);
    setSelectedLocation({ district: "", city: "" });

    // Remove stored search results
    localStorage.removeItem("searchResults");
    localStorage.removeItem("availableStores");
    localStorage.removeItem("selectedLocation");
  };

  const locations = [
    { id: 1, name: "Store 1", lat: 11.258753, lng: 75.780411 },
    { id: 2, name: "Store 2", lat: 11.268019021984289, lng: 75.94278694739964 },
    { id: 3, name: "Store 3", lat: 10.527642, lng: 76.214434 },
  ];

  const customIcon = L.icon({
    iconUrl: "/../public/map-marker.svg", // Path to your custom marker image
    iconSize: [32, 32], // Size of the icon [width, height]
    iconAnchor: [16, 32], // Point of the icon which corresponds to the marker's location
    popupAnchor: [0, -32], // Point from which the popup should open relative to the iconAnchor
  });

  return (
    <div className="min-h-screen pt-0">
      <section className="space--10 grid  grid-cols-1 xl:grid-cols-6 ">
        {/* <BannerCarousel images={bannerImages} autoPlayInterval={3000} /> */}
        <div className="bg-ptn-b bg-cover py-20 col-span-4 ">
          <h1 className="text-4xl font-medium text-white text-center pb-2 uppercase">
            HP World
          </h1>

          <form className="w-11/12 xl:w-10/12 mx-auto p-5 border-2 border-[#3a7cde] bg-gray-50  rounded-2xl flex flex-col justify-center xl:flex-row gap-5 items-center xl:gap-3 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="min-w-60 flex flex-col md:flex-row items-center  ">
                <IoLocationOutline
                  className="flex mr-5"
                  color="#3a7cde"
                  size={60}
                />

                <FormControl fullWidth margin="dense">
                  <InputLabel id="district-select-label " className="">
                    District
                  </InputLabel>
                  <Select
                    className="outline-2 border-[1px] rounded-xl "
                    labelId="district-select-label"
                    value={formData.district || ""}
                    onChange={handleChange}
                    name="district"
                  >
                    {districts.map((district) => (
                      <MenuItem key={district._id} value={district._id}>
                        {district.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div className="bg">
                <FormControl fullWidth margin="dense">
                  <InputLabel id="city-select-label" className=" ">
                    City
                  </InputLabel>
                  <Select
                    className="outline-2 border-[1px] rounded-xl"
                    labelId="city-select-label"
                    value={formData.city || ""}
                    onChange={handleCityChange}
                    name="city"
                    disabled={!selectedDistrict.id}
                  >
                    {relatedCities?.map((city) => (
                      <MenuItem key={city._id} value={city._id}>
                        {city.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={handleReset}
                className="border h-11 px-8 rounded-xl text-sm font-medium tracking-wider border-main hover:border-main text-black hover:text-white hover:bg-black duration-200"
              >
                Reset
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="border border-gray-300 h-11 px-8 rounded-xl text-sm font-medium tracking-wider bg-main text-white hover:bg-[#255192] duration-200"
              >
                Search
              </button>
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 w-full pt-10">
            <div className="w-11/12 xl:w-10/12  mx-auto py-5  ">
              {avalableStores > 0 && (
                <p className="text-xl font-medium pb-2">
                  {avalableStores} HP World Stores in{" "}
                  {selectedLocation.district}, {selectedLocation.city}
                </p>
              )}

              <div className="flex flex-row md:flex-col pb-2 mdpb-0 md:space-y-3 md:h-[100vh] overflow-x-auto md:overflow-y-auto ">
                {stores.length === 0 ? (
                  <div className="w-full text-center text-2xl">
                    <h1>No stores found.</h1>
                  </div>
                ) : (
                  stores?.map((store) => (
                    <StoreCard key={store._id} store={store} />
                  ))
                )}
              </div>
            </div>

            <div className="w-11/12 xl:w-10/12 mx-auto h-[100vh] rounded-xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d244.56637734274625!2d75.77592641115187!3d11.256846760766908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba6593bc09bd27f%3A0x7a4555e5ab2f06a4!2sBasics%20Life.%20Kozhikode%2C%20Vellayil!5e0!3m2!1sen!2sin!4v1733573834406!5m2!1sen!2sin"
                width="600"
                height="750"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="bg-[#e6e2e4] min-h-screen col-span-2 p-5">
          <h1 className="text-xl border-[1px]  border-b-black">
            Leatest Updates
          </h1>
          {/* <BannerCarousel /> */}
          <BannerCarousel />
        </div>
      </section>
    </div>
  );
};

export default Home;
