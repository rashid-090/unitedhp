import React, { useState } from 'react';
import Logo from '../../../public/hp_logo.png';
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="min-h-screen w-full flex justify-center items-center">
      <form className="bg-gray-100 border rounded-2xl shadow-xl w-96 p-5 py-16 flex flex-col gap-5">
        <div className="bg-white shadow-lg rounded-xl p-3 -mt-24 border mb-3">
          <img className="w-16 h-16 mx-auto object-contain" src={Logo} alt="logo" />
        </div>
        <div className="w-full">
          <input
            className="w-full p-2 outline-none border placeholder:text-sm"
            type="text"
            placeholder="Email"
          />
        </div>
        <div className="w-full relative">
          <input
            className="w-full p-2 outline-none border placeholder:text-sm"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
          />
          <button
            type="button"
            className="absolute text-base right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <IoMdEyeOff/> : <IoMdEye/>}
          </button>
        </div>
        <button className="bg-main rounded-md hover:bg-sky-700 duration-200 text-white p-2" type="submit">
          Login
        </button>
      </form>
    </section>
  );
};

export default Login;
