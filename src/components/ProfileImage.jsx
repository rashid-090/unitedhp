import React from "react";
import { URL } from "../Common/api";
import { cloudinary } from "../utils/cloudinaryBaseURL";
import UserAvathar from '../assets/images/user.png'

const ProfileImage = ({ user, radius }) => {
  const imageRadius = radius || "full";

  if (user.profileImgURL) {
    return (
      <div
        className={`h-full w-full rounded-${imageRadius} shrink-0 overflow-clip`}
      >
        <img
             src={
              user.profileImgURL
                ? `${cloudinary}/${user.profileImgURL}`
                : UserAvathar
            }
          alt="profile"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  if (user.profileImageURL) {
    return (
      <div
        className={`h-full w-full rounded-${imageRadius} shrink-0 overflow-clip`}
      >
        <img
          src={`${user.profileImageURL}`}
          alt="profile"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }
  return (
    <div
      className={`w-full h-full bg-gray-100 rounded-${imageRadius} shrink-0`}
    ></div>
  );
};

export default ProfileImage;
