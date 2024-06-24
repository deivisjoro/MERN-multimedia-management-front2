import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import axios from '../axiosConfig';
import Header from './Header';
import Sidebar from './Sidebar';
import { useSelector } from 'react-redux';

const Layout = () => {
  const [categories, setCategories] = useState([]);
  const { isAuthenticated, token } = useSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      
      if (token) {
        axios.defaults.headers.common['Authorization'] = token;
      }

      const fetchCategories = async () => {
        try {
          const response = await axios.get('/categories', {
            headers: {
              Authorization: token
            }
          });
          setCategories(response.data.data);
        } catch (error) {
          console.error('Error fetching categories', error);
        }
      };

      fetchCategories();
    }
  }, [isAuthenticated, token]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-grow">
        {isAuthenticated && <Sidebar categories={categories} />}
        <main className={isAuthenticated ? "ml-64 p-4 flex-grow" : "w-full p-4"}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
