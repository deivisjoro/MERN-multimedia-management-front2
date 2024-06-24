import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faInfoCircle, faLifeRing } from '@fortawesome/free-solid-svg-icons';

const Help = () => {
  const { t } = useTranslation();

  return (
    <div>
      <main className="p-4">
        <h1 className="text-3xl text-center text-blue-800 font-bold">{t('help.title')}</h1>
        <p className="text-center mt-4 text-gray-700">{t('help.description')}</p>
        <div className="mt-8 space-y-8 flex flex-col items-center">
          <div className="text-center p-4 bg-blue-100 rounded-lg shadow-md w-3/4 md:w-1/2 lg:w-1/3">
            <FontAwesomeIcon icon={faQuestionCircle} size="3x" className="text-blue-500 mb-2" />
            <h2 className="text-xl mt-2 text-blue-700 font-semibold">{t('help.faq')}</h2>
            <p className="text-gray-600">{t('help.faqDescription')}</p>
          </div>
          <div className="text-center p-4 bg-green-100 rounded-lg shadow-md w-3/4 md:w-1/2 lg:w-1/3">
            <FontAwesomeIcon icon={faInfoCircle} size="3x" className="text-green-500 mb-2" />
            <h2 className="text-xl mt-2 text-green-700 font-semibold">{t('help.guides')}</h2>
            <p className="text-gray-600">{t('help.guidesDescription')}</p>
          </div>
          <div className="text-center p-4 bg-yellow-100 rounded-lg shadow-md w-3/4 md:w-1/2 lg:w-1/3">
            <FontAwesomeIcon icon={faLifeRing} size="3x" className="text-yellow-500 mb-2" />
            <h2 className="text-xl mt-2 text-yellow-700 font-semibold">{t('help.support')}</h2>
            <p className="text-gray-600">{t('help.supportDescription')}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Help;
