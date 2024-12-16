import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { cloudinaryURL } from "../../Common/api";

const EditStore = () => {
  const [formData, setFormData] = useState({
    openingTime: "",
    closingTime: "",
    address: "",
    imgURL: [],
    tempImages: [],
    gMapLink: "",
    about: "",
    district: "",
    city: "",
  });

  const navigate = useNavigate();

  const [selectedDistrict, setSelectedDistrict] = useState({
    id: "",
    name: "",
  });
  const [selectedCIty, setSelectedCIty] = useState({
    id: "",
    name: "",
  });

  const [districts, setDistricts] = useState([{ id: "", name: "" }]);
  const [cities, setCities] = useState([{}]);
  const [relatedCities, setRelatedCities] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          // Fetch districts
          const resDistricts = await api.get("super-admin/districts");
          console.log(resDistricts);
          setDistricts(resDistricts?.data?.districts);

          // Fetch cities
          const resCities = await api.get("super-admin/cities");
          console.log(resCities);
          setCities(resCities?.data?.cities);

          // Fetch store details if an ID is provided
          const resStore = await api.get(`super-admin/admin/${id}`);
          console.log(resStore);

          // Prefill the form data with the response from the API
          setFormData({
            address: resStore?.data?.admin?.address || "",
            contactNumber: resStore?.data?.admin?.contactNumber || "",
            pinCode: resStore?.data?.admin?.pinCode || "",
            openingTime: resStore?.data?.admin?.openingTime || "",
            closingTime: resStore?.data?.admin?.closingTime || "",
            imgURL: resStore?.data?.admin?.imgURL || [],
            gMapLink: resStore?.data?.admin?.gMapLink || "",
            about: resStore?.data?.admin?.about || "",
            district: resStore?.data?.admin?.district || "", // Direct ObjectId
            city: resStore?.data?.admin?.city || "", // Direct ObjectId
            tempImages: [],
          });

          // Update the selected district logic
          setSelectedDistrict({
            id: resStore?.data?.admin?.district || "",
            name:
              districts.find((d) => d._id === resStore?.data?.admin?.district)
                ?.name || "",
          });

          const sampleSelectedDistrict = {
            id: resStore?.data?.admin?.district || "",
            name:
              districts.find((d) => d._id === resStore?.data?.admin?.district)
                ?.name || "",
          };

          // Filter cities based on the selected district

          console.log("Cities 88", sampleSelectedDistrict);

          setRelatedCities(
            resCities?.data?.cities.filter(
              (city) => city.district._id === sampleSelectedDistrict.id
            )
          );
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [id]); // Adding `cities` in the dependency array so that the cities are filtered after they are fetched

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    multiple: true,
    onDrop: (acceptedFiles) => {
      const validFiles = acceptedFiles.filter(
        (file) =>
          file.type.startsWith("image/") &&
          ["jpeg", "jpg", "png"].includes(file.type.split("/")[1])
      );

      if (validFiles.length === 0) {
        toast.error("Only JPEG or PNG files are allowed.");
        return;
      }

      handleImageChange(validFiles);
    },
  });

  // Modify the handleChange method for district
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "district") {
      setSelectedDistrict({ id: value });
      setFormData({
        ...formData,
        city: "",
      });

      setRelatedCities(cities.filter((city) => city.district._id === value));
      console.log(
        "cities for selected district",
        cities.filter((city) => city.district === value)
      );
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
      setFormData((prev) => ({
        ...prev,
        tempImages: [...prev.tempImages, ...files],
      })); // Store the file object
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imgURL: prev.imgURL.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setFormData({ ...formData, imgURL: formData.tempImages });
    // return console.log(formData);

    try {
      setIsLoading(true);
      const res = await api.patch(`super-admin/admin/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      });

      console.log(res);
      if (res.status) {
        navigate("/all-dealers");
      }

      if (res.status) {
        toast.success("Dealer updated successfully");
        setFormData({
          pinCode: "",
          gMapLink: "",
          openingTime: "",
          closingTime: "",
          tempImages: [],
          address: "",
          imgURL: [],
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
  };

  return (
    <div className="">
      <h1 className="text-2xl pb-4  text-center">Edit Store</h1>
      <form
        onSubmit={handleSubmit}
        className=" space-y-4 xl:w-[70%] mx-auto l-auto p-6 border border-gray-300 rounded-lg"
      >
        {/* Opening Time and Closing Time */}
        <h1 className="text-xl text-main font-medium">Store Details</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="contact-number"
              className="block text-sm font-medium text-gray-700"
            >
              Contact Number
            </label>
            <input
              id="contact-number"
              name="contactNumber"
              type="number"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm [&::-webkit-inner-spin-button]:appearance-none"
              value={formData.contactNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label
              htmlFor="pin-code"
              className="block text-sm font-medium text-gray-700"
            >
              Pin Code
            </label>
            <input
              id="pin-code"
              name="pinCode"
              type="number"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm [&::-webkit-inner-spin-button]:appearance-none"
              value={formData.pinCode}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="google-map-link"
            className="block text-sm font-medium text-gray-700"
          >
            Google Map Link
          </label>
          <input
            id="google-map-link"
            name="gMapLink"
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            value={formData.gMapLink}
            onChange={handleChange}
            required
          />
        </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="">
            <label className="block text-sm font-medium text-gray-700">
              Upload Images
            </label>
            <div
              {...getRootProps()}
              className="mt-1 block w-full xl:w-[80%] px-3 py-10 border  border-gray-300 rounded-md shadow-sm focus:outline-none cursor-pointer"
            >
              <input {...getInputProps()} />
              <p className="text-center text-sm text-gray-500">
                Drag & drop or click to upload
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-6 gap-4">
            {formData.imgURL.length !== 0 &&
              formData.imgURL.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={`${cloudinaryURL}${img}`}
                    alt={`preview-${index}`}
                    className="aspect-video object-contain rounded-md"
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
            {formData.tempImages.length !== 0 &&
              formData.tempImages.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(img)} // This will be the local file preview before upload
                    alt={`preview-${index}`}
                    className="aspect-video object-contain rounded-md"
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
                  <MenuItem key={district} value={district._id}>
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
                required
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

        <div className="flex justify-center ">
          <button
            disabled={isLoading}
            type="submit"
            className={`w-full min-w-44 md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 ${
              isLoading && "cursor-not-allowed"
            }`}
          >
            {isLoading ? "Updating Store..." : "Update Store"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStore;
