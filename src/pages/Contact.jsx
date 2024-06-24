import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const Contact = () => {
  const { t } = useTranslation();

  return (
    <div>
      <main className="p-4">
        <h1 className="text-3xl text-center text-blue-800 font-bold">{t('contact.title')}</h1>
        <p className="text-center mt-4 text-gray-700">{t('contact.description')}</p>
        <div className="mt-8 space-y-8 flex flex-col items-center">
          <div className="text-center p-4 bg-blue-100 rounded-lg shadow-md w-3/4 md:w-1/2 lg:w-1/3">
            <FontAwesomeIcon icon={faEnvelope} size="3x" className="text-blue-500 mb-2" />
            <h2 className="text-xl mt-2 text-blue-700 font-semibold">{t('contact.email')}</h2>
            <p className="text-gray-600">support@mymultimedia.com</p>
          </div>
          <div className="text-center p-4 bg-green-100 rounded-lg shadow-md w-3/4 md:w-1/2 lg:w-1/3">
            <FontAwesomeIcon icon={faPhone} size="3x" className="text-green-500 mb-2" />
            <h2 className="text-xl mt-2 text-green-700 font-semibold">{t('contact.phone')}</h2>
            <p className="text-gray-600">+1 234 567 890</p>
          </div>
          <div className="text-center p-4 bg-yellow-100 rounded-lg shadow-md w-3/4 md:w-1/2 lg:w-1/3">
            <FontAwesomeIcon icon={faMapMarkerAlt} size="3x" className="text-yellow-500 mb-2" />
            <h2 className="text-xl mt-2 text-yellow-700 font-semibold">{t('contact.address')}</h2>
            <p className="text-gray-600">1234 Multimedia St, Media City, Country</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
