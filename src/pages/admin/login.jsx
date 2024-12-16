import React, { useEffect, useState } from "react";
import Logo from "../../../public/hp_logo.png";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/actions/userActions";
import { updateError } from "../../redux/reducers/userSlice";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { user, loading, error } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const initialValues = {
    email: "",
    password: "",
  };

  const schema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter a valid email.")
      .required("Please enter email."),
    password: yup
      .string()
      .min(4, "Password must be at least 4 characters")
      .max(15, "Password is too long.")
      .required("Please enter password."),
  });

  useEffect(() => {
    if (user) {
      if (!user.isEmailVerified) {
        navigate("/otp");
      } else {
        navigate("/");
      }
    }
    return () => {
      dispatch(updateError(""));
    };
  }, [user]);



  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data) => {
    dispatch(loginUser(data));
    navigate('/')

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
        <p className="w-full h-5 text-sm text-red-500">
          {errors.email?.message}
        </p>

        <div className="w-full relative">
          <input
            className="w-full p-2 outline-none border placeholder:text-sm"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            {...register("password")}
          />
          <p className="w-full h-5 text-sm text-red-500">
            {errors.password?.message}
          </p>

          <button
            type="button"
            className="absolute text-base right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
          </button>
        </div>
        <button
          className={`bg-main rounded-md hover:bg-sky-700 duration-200 text-white p-2 ${
            loading && "cursor-not-allowed"
          }`}
          type="submit"
          disabled={loading}
        >
          {loading ? "Loggin in" : "Login"}
        </button>
      </form>
    </section>
  );
};

export default Login;
