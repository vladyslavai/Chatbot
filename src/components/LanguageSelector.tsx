'use client';

import { Language } from '@/types/chatbot';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

const languages = [
  { code: 'de' as Language, name: 'Deutsch', flag: '🇩🇪' },
  { code: 'en' as Language, name: 'English', flag: '🇬🇧' },
  { code: 'fr' as Language, name: 'Français', flag: '🇫🇷' },
  { code: 'it' as Language, name: 'Italiano', flag: '🇮🇹' }
];

export default function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  return (
    <div className="relative inline-block text-left">
      <div className="group">
        <button className="inline-flex items-center justify-center w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200">
          <Globe className="w-4 h-4 mr-2 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            {languages.find(lang => lang.code === currentLanguage)?.flag}
          </span>
        </button>
        
        <div className="absolute right-0 z-10 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => onLanguageChange(language.code)}
                className={`w-full flex items-center px-4 py-2 text-sm hover:bg-blue-50 transition-colors duration-150 ${
                  currentLanguage === language.code 
                    ? 'bg-blue-100 text-blue-900 font-medium' 
                    : 'text-gray-700'
                }`}
              >
                <span className="mr-3">{language.flag}</span>
                <span>{language.name}</span>
                {currentLanguage === language.code && (
                  <span className="ml-auto text-blue-600">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 