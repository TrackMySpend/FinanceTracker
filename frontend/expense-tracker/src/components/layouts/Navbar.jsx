import React, { useState } from 'react';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { FiSettings } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import SideMenu from './SideMenu';

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <div className="flex justify-between items-center bg-base-100 text-base-content border border-base-300 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30">
      <div className="flex items-center gap-5">
        <button
          className="block lg:hidden"
          onClick={() => setOpenSideMenu(!openSideMenu)}
        >
          {openSideMenu ? (
            <HiOutlineX className="text-2xl" />
          ) : (
            <HiOutlineMenu className="text-2xl" />
          )}
        </button>

        <h2 className="text-lg font-medium">Expense Tracker</h2>
      </div>

      {/* Settings Icon */}
      <Link to="/settings" className="hover:text-primary">
        <FiSettings className="text-xl" />
      </Link>

      {/* Mobile Side Menu */}
      {openSideMenu && (
        <div className="fixed top-[61px] -ml-4 bg-base-100 border-r border-base-300">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
