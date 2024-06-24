import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../redux/actions/authActions';
import Header from '../components/Header';

const Login = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(3);

  const { email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await dispatch(login(email, password));
      if (res.type === 'AUTH_SUCCESS') {
        i18n.changeLanguage(res.payload.user.language);
        setMessage(t(`login.messages.${res.payload.message}`));
        setError(null);
        const interval = setInterval(() => setCountdown(prev => prev - 1), 1000);
        setTimeout(() => {
          clearInterval(interval);
          navigate('/dashboard');
        }, 3000);
      } else {
        setError(t(`login.messages.${res.payload.message}`));
        setMessage(null);
      }
    } catch (err) {
      setError(t(`login.messages.${err.message}`));
      setMessage(null);
    }
  };

  return (
    <div>
      <main className="p-4 flex flex-col items-center">
        <h1 className="text-3xl text-center text-blue-800 font-bold">{t('login.title')}</h1>
        {message && (
          <div className="text-green-500">
            {message} {t('login.redirectIn')} {countdown} {t('login.seconds')}
          </div>
        )}
        {error && <div className="text-red-500">{error}</div>}
        <form className="w-full max-w-md mt-8" onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">{t('login.email')}</label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" name="email" type="email" value={email} onChange={onChange} required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">{t('login.password')}</label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" name="password" type="password" value={password} onChange={onChange} required />
          </div>
          <div className="mb-4">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">{t('login.submit')}</button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Login;
