import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import api from "../../utils/api";
import { toast } from "react-toastify";

const YourForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordAgain: "",
    openingTime: "",
    closingTime: "",
    address: "",
    imgURL: [],
    qrCode: "",
    about: "",
    district: "",
    city: "",
  });

  const [selectedDistrict, setSelectedDistrict] = useState({
    id: "",
    name: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [districts, setDistricts] = useState([{ id: "", name: "" }]);
  const [cities, setCities] = useState([{}]);
  const [relatedCities, setRelatedCities] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resDistricts = await api.get("super-admin/districts");
        console.log(resDistricts);
        setDistricts(resDistricts?.data?.districts);

        const resCities = await api.get("super-admin/cities");
        console.log(resCities);
        setCities(resCities?.data?.cities);
      } catch (err) {
      } finally {
      }
    };
    fetchData();
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    multiple: true,
    onDrop: (acceptedFiles) => handleImageChange(acceptedFiles),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "district") {
      setSelectedDistrict({ id: e.target.value });
      setRelatedCities(
        cities.filter((city) => city.district._id == e.target.value)
      );
      // setCities((prev) =>
      //   prev.filter((city) => city.district._id == e.target.value)
      // );
      console.log("cites for selected district", relatedCities);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCityChange = (e) => {
    const { name, value } = e.target;
    console.log(e.target);

    // setCities((prev) =>
    //   prev.filter((city) => city.district._id == e.target.value)
    // );
    console.log("cites for selected district", relatedCities);

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (files) => {
    if (files) {
      setFormData((prev) => ({ ...prev, imgURL: files })); // Store the file object
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imgURL: prev.imgURL.filter((_, i) => i !== index),
    }));
  };

  const togglePasswordVisibility = () => setPasswordVisible((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setConfirmPasswordVisible((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await api.post("super-admin/admin", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      });
      if (res.status) {
        toast.success("Dealer created successfully");
        setFormData({
          name: "",
          email: "",
          password: "",
          passwordAgain: "",
          openingTime: "",
          closingTime: "",
          address: "",
          imgURL: [],
          qrCode: "",
          about: "",
          district: "",
          city: "",
        });
      }
    } catch (err) {
      console.log(err);
      toast.error("Error while creating dealer");
    } finally {
      setIsLoading(false);
    }
    console.log(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 xl:w-[70%] mx-auto l-auto p-6 border border-gray-300 rounded-lg"
    >
      {/* Name, Email, Password, and Confirm Password */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={passwordVisible ? "text" : "password"}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm"
            >
              {passwordVisible ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="passwordAgain"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="passwordAgain"
              name="passwordAgain"
              type={confirmPasswordVisible ? "text" : "password"}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              value={formData.passwordAgain}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm"
            >
              {confirmPasswordVisible ? "Hide" : "Show"}
            </button>
          </div>
        </div>
      </div>

      {/* Opening Time and Closing Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="openingTime"
            className="block text-sm font-medium text-gray-700"
          >
            Opening Time
          </label>
          <input
            id="openingTime"
            name="openingTime"
            type="time"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            value={formData.openingTime}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label
            htmlFor="closingTime"
            className="block text-sm font-medium text-gray-700"
          >
            Closing Time
          </label>
          <input
            id="closingTime"
            name="closingTime"
            type="time"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            value={formData.closingTime}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Address */}
      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700"
        >
          Address
        </label>
        <input
          id="address"
          name="address"
          type="text"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Upload Images
        </label>
        <div
          {...getRootProps()}
          className="mt-1 block w-full xl:w-[40%] px-3 py-10 border border-gray-300 rounded-md shadow-sm focus:outline-none cursor-pointer"
        >
          <input {...getInputProps()} />
          <p className="text-center text-sm text-gray-500">
            Drag & drop or click to upload
          </p>
        </div>

        <div className="mt-4 grid grid-cols-6 gap-4">
          {formData.imgURL.map((img, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(img)}
                alt={`preview-${index}`}
                className="aspect-video object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 w-5 h-5 bg-red-400 hover:bg-red-600 duration-200 text-white rounded-full"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* QR Code */}
      <div>
        <label
          htmlFor="qrCode"
          className="block text-sm font-medium text-gray-700"
        >
          Google My Bussiness Link
        </label>
        <input
          id="qrCode"
          name="qrCode"
          value={formData.qrCodes}
          type="text"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          onChange={handleChange}
        />
      </div>

      {/* About */}
      <div>
        <label
          htmlFor="about"
          className="block text-sm font-medium text-gray-700"
        >
          About
        </label>
        <textarea
          id="about"
          name="about"
          rows="4"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          value={formData.about}
          onChange={handleChange}
          required
        ></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="district"
            className="block text-sm font-medium text-gray-700"
          >
            District
          </label>
          <FormControl fullWidth margin="dense">
            <InputLabel id="district-select-label">District</InputLabel>
            <Select
              labelId="district-select-label"
              value={formData.district}
              onChange={(e) => handleChange(e)}
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

        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700"
          >
            City
          </label>
          <FormControl fullWidth margin="dense">
            <InputLabel id="district-select-label">City</InputLabel>
            <Select
              labelId="city-select-label"
              value={formData.city}
              onChange={(e) => handleCityChange(e)}
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

      {/* Other form fields */}

      <div>
        <button
          disabled={isLoading}
          type="submit"
          className={`w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 ${
            isLoading && "cursor-not-allowed"
          }`}
        >
          {isLoading ? "Submitting" : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default YourForm;
