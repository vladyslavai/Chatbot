'use client';

import { Language } from '@/types/chatbot';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

const languages = [
  { code: 'de' as Language, name: 'Deutsch', flag: '🇩🇪' },
  { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
  { code: 'fr' as Language, name: 'Français', flag: '🇫🇷' },
  { code: 'it' as Language, name: 'Italiano', flag: '🇮🇹' }
];

export default function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  return (
    <div className="relative group">
      <div 
        className="flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition-all duration-300"
        style={{
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.4)'
        }}
      >
        <Globe 
          className="w-4 h-4"
          style={{ color: 'var(--kaboom-violet)' }}
        />
        <span className="font-semibold text-sm" style={{ color: 'var(--kaboom-violet)' }}>
          {currentLang.flag} {currentLang.name}
        </span>
      </div>

      {/* Dropdown */}
      <div 
        className="absolute top-full right-0 mt-2 py-2 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          minWidth: '140px'
        }}
      >
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onLanguageChange(lang.code)}
            className={`w-full px-4 py-2 text-left transition-all duration-200 font-medium ${
              currentLanguage === lang.code 
                ? 'bg-opacity-10' 
                : 'hover:bg-opacity-5'
            }`}
            style={{
              color: currentLanguage === lang.code ? 'var(--kaboom-violet)' : 'var(--foreground)',
              background: currentLanguage === lang.code ? 'var(--kaboom-mint)' : 'transparent'
            }}
          >
            <span className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span className="text-sm">{lang.name}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
} 