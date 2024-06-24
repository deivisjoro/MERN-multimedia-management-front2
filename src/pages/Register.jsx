import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import axios from '../axiosConfig';
import Header from '../components/Header';

const Register = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    userType: 'lector',
    language: 'en',
    profileImage: null,
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const { username, email, password, userType, language, profileImage } = formData;

  const onChange = e => {
    if (e.target.name === 'profileImage') {
      setFormData({ ...formData, profileImage: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const onSubmit = async e => {
    e.preventDefault();
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
    const formDataObj = new FormData();
    formDataObj.append('username', username);
    formDataObj.append('email', email);
    formDataObj.append('password', password);
    formDataObj.append('userType', userType);
    formDataObj.append('language', language);
    if (profileImage) formDataObj.append('profileImage', profileImage);

    try {
      const res = await axios.post('/auth/register', formDataObj, config);
      setMessage(t(`register.messages.${res.data.message}`) + ' ' + t('register.loginPrompt'));
      setError(null);
    } catch (err) {
      setError(t(`register.messages.${err.response.data.message}`));
      setMessage(null);
    }
  };

  return (
    <div>
      <main className="p-4 flex flex-col items-center">
        <h1 className="text-3xl text-center text-blue-800 font-bold">{t('register.title')}</h1>
        {message && (
          <div className="text-green-500">
            {message} <Link to="/login" className="text-blue-500 underline">{t('register.loginLink')}</Link>
          </div>
        )}
        {error && <div className="text-red-500">{error}</div>}
        <form className="w-full max-w-md mt-8" onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">{t('register.username')}</label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" name="username" type="text" value={username} onChange={onChange} required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">{t('register.email')}</label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" name="email" type="email" value={email} onChange={onChange} required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">{t('register.password')}</label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" name="password" type="password" value={password} onChange={onChange} required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userType">{t('register.userType')}</label>
            <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="userType" name="userType" value={userType} onChange={onChange} required>
              <option value="lector">{t('register.lector')}</option>
              <option value="creador">{t('register.creador')}</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="language">{t('register.language')}</label>
            <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="language" name="language" value={language} onChange={onChange}>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="profileImage">{t('register.profileImage')}</label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="profileImage" name="profileImage" type="file" onChange={onChange} />
          </div>
          <div className="mb-4">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">{t('register.submit')}</button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Register;
