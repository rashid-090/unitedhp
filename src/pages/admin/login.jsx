import React, { useState } from "react";
import Logo from "../../../public/hp_logo.png";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(4).max(15).required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const res = await api.post("auth/login", data);
      if (res?.status) {
        toast.success("Login success");
        navigate("/");
      }
      console.log(res);
    } catch (err) {
      if (err?.response?.data?.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error("Something went wrong. Try again...");
      }

      console.log(err);
    } finally {
      setIsLoading(false);
    }
    console.log(data);
  };

  return (
    <section className="min-h-screen w-full flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-100 border rounded-2xl shadow-xl w-96 p-5 py-16 flex flex-col gap-5"
      >
        <div className="bg-white shadow-lg rounded-xl p-3 -mt-24 border mb-3">
          <img
            className="w-16 h-16 mx-auto object-contain"
            src={Logo}
            alt="logo"
          />
        </div>
        <div className="w-full">
          <input
            className="w-full p-2 outline-none border placeholder:text-sm"
            type="text"
            placeholder="Email"
            {...register("email")}
          />
        </div>
        <p className="w-full h-5  text-red-500">{errors.email?.message}</p>

        <div className="w-full relative">
          <input
            className="w-full p-2 outline-none border placeholder:text-sm"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            {...register("password")}
          />
          <p className="w-full h-5 text-red-500">{errors.password?.message}</p>

          <button
            type="button"
            className="absolute text-base right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
          </button>
        </div>
        <button
          className="bg-main rounded-md hover:bg-sky-700 duration-200 text-white p-2"
          type="submit"
        >
          Login
        </button>
      </form>
    </section>
  );
};

export default Login;
