import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/actions/authActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

const Header = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const language = useSelector((state) => state.language.value);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    dispatch(setLanguage(lang));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', closeDropdown);
    return () => {
      document.removeEventListener('click', closeDropdown);
    };
  }, []);

  const linkClasses = "mr-4 hover:text-yellow-400";

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-10">

      <div className="text-2xl">
        <NavLink to="/" className="flex items-center">
          <FontAwesomeIcon icon={faPlayCircle} className="mr-2" /> MyMultimedia
        </NavLink>
      </div>
      <nav>
        {!isAuthenticated && (
          <NavLink to="/" className={({ isActive }) => isActive ? "mr-4 text-yellow-400" : linkClasses}>
          {t('header.home')}
          </NavLink>
        )}

        {!isAuthenticated && (
          <NavLink to="/help" className={({ isActive }) => isActive ? "mr-4 text-yellow-400" : linkClasses}>
          {t('header.help')}
          </NavLink>
        )}

        {!isAuthenticated && (
          <NavLink to="/contact" className={({ isActive }) => isActive ? "mr-4 text-yellow-400" : linkClasses}>
          {t('header.contact')}
          </NavLink>
        )}

        {isAuthenticated && (
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "mr-4 text-yellow-400" : linkClasses}>
          Dashboard
          </NavLink>
        )}
        
        {isAuthenticated && user && user.userType === 'admin' && (
          <div className="relative inline-block text-left" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="inline-flex justify-center w-full px-4 py-2 bg-blue-600 text-white font-medium hover:text-yellow-400 focus:outline-none">
              Admin <FontAwesomeIcon icon={faCaretDown} className="ml-2" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg">
                <div className="py-1 bg-blue-600 text-white">
                  <NavLink to="/admin/users" className="block px-4 py-2 text-sm hover:bg-blue-700">
                    Users
                  </NavLink>
                  <NavLink to="/admin/topics" className="block px-4 py-2 text-sm hover:bg-blue-700">
                    Topics
                  </NavLink>
                  <NavLink to="/admin/reactionType" className="block px-4 py-2 text-sm hover:bg-blue-700">
                    Reaction Types
                  </NavLink>
                  <NavLink to="/admin/contentType" className="block px-4 py-2 text-sm hover:bg-blue-700">
                    Content Types
                  </NavLink>
                  <NavLink to="/admin/content" className="block px-4 py-2 text-sm hover:bg-blue-700">
                    Contents
                  </NavLink>
                  <NavLink to="/admin/category" className="block px-4 py-2 text-sm hover:bg-blue-700">
                    Categories
                  </NavLink>
                </div>
              </div>
            )}
          </div>
        )}
        {!isAuthenticated ? (
          <>
            <NavLink to="/login" className={({ isActive }) => isActive ? "mr-4 text-yellow-400" : linkClasses}>
              {t('header.login')}
            </NavLink>
            <NavLink to="/register" className={({ isActive }) => isActive ? "mr-4 text-yellow-400" : linkClasses}>
              {t('header.register')}
            </NavLink>
          </>
        ) : (
          <button onClick={handleLogout} className="mr-4 hover:text-yellow-400">
            {t('header.logout')}
          </button>
        )}
        <div className="ml-4 inline-block">
          {t('header.language')}:
          <select 
            value={language} 
            onChange={(e) => changeLanguage(e.target.value)} 
            className="ml-2 bg-white text-black"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>
      </nav>
    </header>
  );
};

export default Header;
