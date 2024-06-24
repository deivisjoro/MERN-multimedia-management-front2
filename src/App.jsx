import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Home from './pages/Home';
import Help from './pages/Help';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import Users from './pages/Admin/Users';
import Topics from './pages/Admin/Topics';
import ReactionTypes from './pages/Admin/ReactionTypes';
import ContentTypes from './pages/Admin/ContentTypes';
import Contents from './pages/Admin/Contents';
import Categories from './pages/Admin/Categories';
import ContentsByCategory from './components/ContentsByCategory';
import ContentDetail from './components/ContentDetail';
import { setAuthToken } from './redux/actions/authActions';

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(setAuthToken(token));
    }
  }, [dispatch]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/help" element={<Help />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/admin/users" element={isAuthenticated ? <Users /> : <Navigate to="/login" />} />
          <Route path="/admin/topics" element={isAuthenticated ? <Topics /> : <Navigate to="/login" />} />
          <Route path="/admin/reactionType" element={isAuthenticated ? <ReactionTypes /> : <Navigate to="/login" />} />
          <Route path="/admin/contentType" element={isAuthenticated ? <ContentTypes /> : <Navigate to="/login" />} />
          <Route path="/admin/content" element={isAuthenticated ? <Contents /> : <Navigate to="/login" />} />
          <Route path="/admin/category" element={isAuthenticated ? <Categories /> : <Navigate to="/login" />} />
          <Route path="/contents-by-category/:categoryId" element={isAuthenticated ? <ContentsByCategory /> : <Navigate to="/login" />} />
          <Route path="/content/:id" element={isAuthenticated ? <ContentDetail /> : <Navigate to="/login" />} />
        </Route> 
      </Routes>
    </div>
  );
};

export default App;
