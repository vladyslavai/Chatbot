'use client';

import { useState } from 'react';

interface QuestionOptionsProps {
  options: string[];
  onSelect: (option: string, index: number, customAnswer?: string) => void;
  disabled?: boolean;
}

export default function QuestionOptions({ options, onSelect, disabled = false }: QuestionOptionsProps) {
  const [customAnswer, setCustomAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleOptionClick = async (option: string, index: number) => {
    if (disabled || isProcessing) return;
    
    setSelectedOption(index);
    setCustomAnswer('');
    setIsProcessing(true);
    
    // Показываем лоадер
    await new Promise(resolve => setTimeout(resolve, 400));
    
    onSelect(option, index);
    setIsProcessing(false);
  };

  const handleCustomSubmit = async () => {
    if (customAnswer.trim() && !disabled && !isProcessing) {
      setIsProcessing(true);
      setSelectedOption(-1);
      
      // Показываем лоадер
      await new Promise(resolve => setTimeout(resolve, 400));
      
      onSelect(customAnswer, -1, customAnswer);
      setIsProcessing(false);
    }
  };

  const handleCustomInputChange = (value: string) => {
    setCustomAnswer(value);
    if (value.trim()) {
      setSelectedOption(null); // Clear option selection when typing
    }
  };

  return (
    <div className="space-y-4">
      {/* Processing Loader */}
      {isProcessing && (
        <div className="flex items-center gap-2 py-2 px-4 bg-blue-50 rounded-lg border border-blue-200 animate-fade-in">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-sm font-medium text-blue-700">Antwort gespeichert...</span>
        </div>
      )}

      {/* Multiple Choice Options */}
      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option, index)}
            disabled={disabled || isProcessing}
            className={`
              w-full p-3 rounded-lg border-2 transition-all duration-200 text-left
              hover:shadow-md hover:border-blue-400 hover:bg-blue-50
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
              disabled:opacity-50 disabled:cursor-not-allowed
              group relative
              ${selectedOption === index 
                ? 'border-blue-500 bg-blue-50 shadow-md transform scale-[1.02]' 
                : 'border-gray-200 bg-white hover:border-blue-400'
              }
            `}
          >
            <div className="flex items-center gap-3">
              {/* Radio Button */}
              <div className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                ${selectedOption === index 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-gray-300 group-hover:border-blue-400'
                }
              `}>
                {selectedOption === index && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              
              {/* Option Text */}
              <span className="font-medium text-gray-800 flex-1">{option}</span>
              
              {/* Check Icon on Hover */}
              <div className={`
                transition-all duration-200 opacity-0 group-hover:opacity-100
                ${selectedOption === index ? 'opacity-100' : ''}
              `}>
                <span className="text-green-500">✔️</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Custom Input Section */}
      <div 
        className={`
          p-6 rounded-xl border-2 transition-all duration-300
          ${selectedOption === -1 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-200 bg-gray-50'
          }
        `}
        style={{ backgroundColor: selectedOption === -1 ? '#e6f3fa' : '#f6f9fb' }}
      >
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#0076a8' }}
            >
              <span className="text-white text-lg">💡</span>
            </div>
            <h4 className="text-lg font-bold text-gray-900">
              Eigene Antwort eingeben
            </h4>
          </div>
          <p className="text-sm text-gray-500">
            Ihre individuelle Antwort wird die Auswahl oben überschreiben
          </p>
        </div>

        <div className="space-y-4">
          <textarea
            value={customAnswer}
            onChange={(e) => handleCustomInputChange(e.target.value)}
            disabled={disabled || isProcessing}
            className={`
              w-full min-h-[90px] px-4 py-3 rounded-lg border-2 transition-all
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
              disabled:opacity-50 disabled:cursor-not-allowed
              ${selectedOption === -1 
                ? 'border-blue-400 bg-white shadow-sm' 
                : 'border-gray-300 bg-white'
              }
            `}
            placeholder="z.B. Ich habe Erfahrung mit Technik und interessiere mich für Einsätze im öffentlichen Raum."
          />
          
          {customAnswer.trim() && (
            <div className="flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  Individuelle Antwort wird verwendet
                </span>
              </div>
              <button
                onClick={handleCustomSubmit}
                disabled={disabled || !customAnswer.trim() || isProcessing}
                className={`
                  px-4 py-2 rounded-lg font-semibold text-sm transition-all
                  bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
                  disabled:opacity-50 disabled:cursor-not-allowed
                  hover:shadow-md transform hover:scale-105
                `}
              >
                Antwort bestätigen
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 