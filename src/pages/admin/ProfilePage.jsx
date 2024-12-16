import React, { useState } from "react";
import { useSelector } from "react-redux";
import { AiOutlineMail, AiOutlinePhone, AiOutlineUser } from "react-icons/ai";

import ProfileImage from "../../components/ProfileImage";
import InputWithIcon from "../../components/InputWithIcon";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user } = useSelector((state) => state.user);
  console.log(user);

  const navigate = useNavigate();

  return (
    <>
      <div className="bg-white rounded-lg w-full mx-5 lg:mx-0">
        <h1 className="uppercase text-lg font-semibold px-5 py-3 border-b">
          Profile Settings
        </h1>
        <div className="w-full">
          <div className="lg:flex items-start gap-5 p-5">
            <div className="h-56 w-56 shrink-0">
              <ProfileImage user={user} />
            </div>

            <div className="w-full">
              <div className="lg:grid grid-cols-2 gap-5 ">
                <InputWithIcon
                  icon={<AiOutlineUser />}
                  title="First Name"
                  name={user?.name || "-"}
                />

                <InputWithIcon
                  icon={<AiOutlineMail />}
                  title="Email"
                  name={user?.email || "-"}
                />
                <InputWithIcon
                  icon={<AiOutlinePhone />}
                  title="Phone Number"
                  name={user?.contactNumber || "-"}
                />
              </div>
              <button
                type="submit"
                className="bg-main text-white w-full my-3 p-2 rounded-md"
                onClick={() => navigate('/edit-profile')}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
