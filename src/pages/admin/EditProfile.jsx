import React, { useState } from "react";
import UserAvatar from "../../assets/images/user.png";

import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { useDispatch, useSelector } from "react-redux";
import { getPassedDateOnwardDateForInput } from "../../Common/functions";
import { editUserProfile } from "../../redux/actions/userActions";
import { cloudinary } from "../../utils/cloudinaryBaseURL";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);
  console.log(user);

  const [imagePreview, setImagePreview] = useState();
  const [imageFile, setImageFile] = useState(null);

  const initialValues = {
    name: user.name || "",
    lastName: user.lastName || "",
    email: user.email || "",
    contactNumber: user.contactNumber || "",
    dateOfBirth: getPassedDateOnwardDateForInput(user.dateOfBirth) || "",
  };

  const schema = Yup.object().shape({
    name: Yup.string().required("First Name is required"),
    email: Yup.string().email().required("Email is required"),
    contactNumber: Yup.number()
      .typeError("Phone number should be digits")
      .moreThan(999999999, "Not a valid phone number"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Handle form submission
  const onSubmit = async(data) => {
    const formData = new FormData();

    // Append the form fields
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("contactNumber", data.contactNumber);

    // Append the image file if it exists
    if (imageFile) {
      formData.append("profileImgURL", imageFile);
    }

    console.log([...formData.entries()]); // For debugging: View FormData content

    // Dispatch the action
    const res = await dispatch(editUserProfile(formData));
    console.log(res);
    
  };

  // Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="w-11/12 xl:w-10/12 mx-auto h-full overflow-hidden py-10 text-black">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 text-black"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-5">
            <img
              className="h-40 w-40 rounded-md border-2 object-cover"
              src={
                imagePreview
                  ? imagePreview
                  : user.profileImgURL
                  ? `${cloudinary}/${user.profileImgURL}`
                  : UserAvatar
              }
              alt="Profile"
            />
            <label className="block">
              <span className="capitalize">Update Profile Photo</span>
              <input
                type="file"
                className="block pt-3 w-full text-sm 
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-violet-50 file:text-violet-700
                  hover:file:bg-violet-100"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {/* Profile fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block font-semibold mb-1">
                First Name
              </label>
              <input
                type="text"
                id="name"
                defaultValue={initialValues.name}
                className="w-full p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-main"
                {...register("name")}
              />
              <p className="text-red-600 pt-1">{errors.name?.message}</p>
            </div>
            <div>
              <label for="contactNumber" className="block font-semibold mb-1">
                Phone number
              </label>
              <input
                type="number"
                id="contactNumber"
                name="contactNumber"
                defaultValue={initialValues.contactNumber}
                className="w-full p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-main [&::-webkit-inner-spin-button]:appearance-none"
                {...register("contactNumber")}
              />
              <p className="w-full h-5 text-nowrap text-red-600 pt-1">
                {errors.contactNumber?.message}
              </p>
            </div>
          </div>

          <div>
            <label for="email" className="block font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              defaultValue={initialValues.email}
              className="w-full p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-main"
              {...register("email")}
            />
            <p className="w-full h-5 text-nowrap text-red-600 pt-1">
              {errors.email?.message}
            </p>
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-main text-white rounded-md hover:bg-main-dark"
            disabled={loading}
          >
            {loading ? "Loading..." : "Edit Profile"}
          </button>
          {error && <p className="text-red-400">{error}</p>}
        </form>
      </div>
    </section>
  );
};

export default Profile;
