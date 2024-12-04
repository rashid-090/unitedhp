import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../../../../public/hp_logo.png';
import { FaHome, FaChartLine, FaCog, FaChevronDown, FaChevronRight } from 'react-icons/fa';

const Sidebar = ({ onSidebarOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHomeSubmenuOpen, setIsHomeSubmenuOpen] = useState(false);

  const location = useLocation(); // Use the location hook to get the current path
  const menuItems = [
    {
      icon: <FaHome />,
      title: 'Delers',
      link:`#`,
      hasSubmenu: true,
      submenu: [
        { title: 'view delers', link: '/all-delers' },
        { title: 'add delers', link: '/add-delers' },
      ],
    },
    // { icon: <FaChartLine />, title: 'Analytics', link: '/analytics' },
    // { icon: <FaCog />, title: 'Settings', link: '/settings' },
    // { icon: <FaHome />, title: 'Delers', link: '/delers' },
  ];



  const handleMouseEnter = () => {
    setIsOpen(true);
    onSidebarOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
    onSidebarOpen(false);
  };

  const toggleHomeSubmenu = () => {
    setIsHomeSubmenuOpen((prev) => !prev);
  };

  const isActive = (path) => location.pathname === path; // Check if the current path matches the link

  const handleMenuItemClick = () => {
    setIsOpen(false); // Close the sidebar when a menu item is clicked
    onSidebarOpen(false); // Optional: Notify parent component if needed
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`fixed left-0 bottom-0 top-0 h-screen bg-gray-800 text-white z-50 transition-all duration-300 ease-in-out ${
        isOpen ? 'w-40 md:w-64' : 'w-14'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <Link to={'/dashboard'}
        onClick={handleMenuItemClick}
          className={`p-4 font-medium text-lg flex items-center whitespace-nowrap transition-all duration-100 ${
            isOpen ? 'justify-start' : 'justify-center'
          }`}
        >
          {isOpen ? 'United HP' : <img className="h-7 w-7 object-contain" src={Logo} alt="Logo" />}
        </Link>

        {/* Menu Items */}
        <nav className="flex-1 mt-1">
          <ul>
            {menuItems.map((item, index) => (
              <Link to={item.link} key={index}>
                <div
                  className={`flex items-center gap-4 p-3 md:p-4 hover:bg-gray-700 transition-all duration-300 ease-in-out cursor-pointer ${
                    isActive(item.link) ? 'bg-gray-600' : ''
                  }`}
                  onClick={item.hasSubmenu ? toggleHomeSubmenu : undefined}
                >
                  <span className="flex-shrink-0 text-xl">{item.icon}</span>
                  <span
                    className={`text-sm whitespace-nowrap capitalize flex-1 transition-opacity duration-300 ${
                      isOpen ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    {item.title}
                  </span>
                  {item.hasSubmenu && isOpen && (
                    <span>{isHomeSubmenuOpen ? <FaChevronDown /> : <FaChevronRight />}</span>
                  )}
                </div>

                {/* Submenu */}
                {item.hasSubmenu && isOpen && (
                  <ul
                    className={`overflow-hidden flex flex-col pl-5 transition-max-height duration-300 ease-in-out ${
                      isHomeSubmenuOpen ? 'max-h-48' : 'max-h-0'
                    }`}
                  >
                    {item.submenu.map((submenuItem, subIndex) => (
                      <Link to={submenuItem.link}
                        key={subIndex}
                        className={`p-2 text-sm capitalize hover:bg-gray-700 transition-all duration-300 ease-in-out ${
                          isActive(submenuItem.link) ? 'bg-gray-600' : ''
                        }`}
                      >
                        {submenuItem.title}
                      </Link>
                    ))}
                  </ul>
                )}
              </Link>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div
          className={`p-4 text-center text-xs transition-opacity text-nowrap duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
        >
          © 2024 All Rights Reserved
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
