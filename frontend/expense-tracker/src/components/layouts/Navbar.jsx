import React, { useState, useEffect } from 'react';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { FiSettings } from 'react-icons/fi';
import { IoNotificationsOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import SideMenu from './SideMenu';
import { getDueReminders } from '../../utils/reminderApi'; // Adjust the import path as necessary

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const [reminderCount, setReminderCount] = useState(0);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const { data } = await getDueReminders();
        setReminderCount(data.length);
      } catch (err) {
        console.error("Failed to load reminders", err);
      }
    };
    fetchReminders();
  }, []);

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

      <div className="flex items-center gap-6">
        {/* Reminder Bell Icon */}
        <Link to="/reminders" className="relative hover:text-primary">
          <IoNotificationsOutline className="text-xl" />
          {reminderCount > 0 && (
            <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white rounded-full px-1">
              {reminderCount}
            </span>
          )}
        </Link>

        {/* Settings Icon */}
        <Link to="/settings" className="hover:text-primary">
          <FiSettings className="text-xl" />
        </Link>
      </div>

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
