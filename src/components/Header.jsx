import React from "react";
import Logo from "../../public/hp_logo.png";
import { Link } from "react-router-dom";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { IoGlobeOutline } from "react-icons/io5";

const socialLinks = [
  {
    icon: <FaFacebookF />,
    link: `#`,
  },
  {
    icon: <FaInstagram />,
    link: `#`,
  },
  {
    icon: <FaYoutube />,
    link: `#`,
  },
  {
    icon: <FaSquareXTwitter />,
    link: `#`,
  },
  {
    icon: <IoGlobeOutline />,
    link: `#`,
  },
];

const Header = () => {
  return (
    <nav className="bg-[#3a7cde] border-b ">
      <div className="w-11/12 xl:w-10/12 mx-auto py-5 flex items-center justify-between">
        <div className="flex items-center gap-20 w-full">
          <img className="h-12 w-12 object-cover" src={Logo} alt="" />
          <div className="hidden !text-white xl:flex items-center gap-5 font-medium">
            <Link className=" hover:text-main duration-200">Home</Link>
            <Link className="hover:text-main duration-200">About</Link>
            <Link className="hover:text-main duration-200">Contact us</Link>
          </div>
        </div>
        <div className="flex items-center gap-4 text-2xl ">
          {socialLinks.map((lnks, i) => (
            <a
              key={i}
              className="text-white hover:text-white duration-200 hover:scale-150"
              href={lnks.link}
              target="_blank"
            >
              {lnks.icon}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Header;
