import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const YourForm = () => {
  const [images, setImages] = useState([]);
  const [qrCode, setQrCode] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // State to toggle confirm password visibility

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      setImages((prevImages) => [...prevImages, ...acceptedFiles]);
    },
  });

  const handleQrCodeChange = (e) => {
    setQrCode(URL.createObjectURL(e.target.files[0]));
  };

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev); // Toggle password visibility
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible((prev) => !prev); // Toggle confirm password visibility
  };

  return (
    <form className="space-y-4 xl:w-[70%] mx-auto l-auto p-6 border border-gray-300 rounded-lg">
      {/* Name, Email, Password, and Confirm Password - First Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="name"
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-main"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-main"
            required
          />
        </div>

        {/* Password Field with Show/Hide Option */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={passwordVisible ? 'text' : 'password'} // Toggle between password and text
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-main"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility} // Toggle visibility on button click
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm"
            >
              {passwordVisible ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {/* Confirm Password Field with Show/Hide Option */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={confirmPasswordVisible ? 'text' : 'password'} // Toggle between password and text
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-main"
              required
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility} // Toggle visibility on button click
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm"
            >
              {confirmPasswordVisible ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
      </div>

      {/* Opening Time and Closing Time - Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="openingTime" className="block text-sm font-medium text-gray-700">
            Opening Time
          </label>
          <input
            id="openingTime"
            type="time"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-main"
            required
          />
        </div>

        <div>
          <label htmlFor="closingTime" className="block text-sm font-medium text-gray-700">
            Closing Time
          </label>
          <input
            id="closingTime"
            type="time"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-main"
            required
          />
        </div>
      </div>

      {/* Address - Single Column */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <input
          id="address"
          type="text"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-main"
          required
        />
      </div>

      {/* Image Upload with Preview and Close */}
      <div>
        <label htmlFor="images" className="block text-sm font-medium text-gray-700">
          Upload Images
        </label>
        <div
          {...getRootProps()}
          className="mt-1 block w-full xl:w-[40%] px-3 py-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-main cursor-pointer"
        >
          <input {...getInputProps()} id="images" />
          <p className="text-center text-sm text-gray-500">Drag & drop some images, or click to select files</p>
        </div>
        <div className="mt-4 grid grid-cols-6 gap-4">
          {images.map((file, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt={`image-preview-${index}`}
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

      {/* QR Code Image Upload */}
      <div>
        <label htmlFor="qrCode" className="block text-sm font-medium text-gray-700">
          Upload QR Code Image
        </label>
        <input
            id="email"
            type="email"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-main"
            required
          />
      </div>

      {/* About */}
      <div>
        <label htmlFor="about" className="block text-sm font-medium text-gray-700">
          About
        </label>
        <textarea
          id="about"
          rows="4"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-main"
          required
        ></textarea>
      </div>

      {/* District and City */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="district" className="block text-sm font-medium text-gray-700">
            District
          </label>
          <select
            id="district"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-main"
            required
          >
            <option value="">Select District</option>
            <option value="district1">District 1</option>
            <option value="district2">District 2</option>
            <option value="district3">District 3</option>
          </select>
        </div>
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City
          </label>
          <select
            id="city"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-main"
            required
          >
            <option value="">Select City</option>
            <option value="city1">City 1</option>
            <option value="city2">City 2</option>
            <option value="city3">City 3</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-main hover:bg-sky-600 text-white py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
      >
        Submit
      </button>
    </form>
  );
};

export default YourForm;
