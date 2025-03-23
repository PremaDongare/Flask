import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaGlobe } from 'react-icons/fa';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'gu', name: 'ગુજરાતી' }
  ];
  
  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
    // Save the language preference to localStorage
    localStorage.setItem('preferredLanguage', languageCode);
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-gray-700 px-2 py-1 rounded-md cursor-pointer hover:bg-gray-100"
      >
        <FaGlobe className="mr-2" />
        <span>{languages.find(lang => lang.code === i18n.language)?.name || 'English'}</span>
      </button>
      
      {isOpen && (
        <div className="absolute left-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
          {languages.map((language) => (
            <button
              key={language.code}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                i18n.language === language.code ? 'bg-green-50 text-green-700' : 'text-gray-700'
              }`}
              onClick={() => changeLanguage(language.code)}
            >
              {language.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher; 