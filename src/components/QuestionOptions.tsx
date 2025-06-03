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

  const handleOptionClick = (option: string, index: number) => {
    if (disabled) return;
    
    setSelectedOption(index);
    setCustomAnswer('');
    onSelect(option, index);
  };

  const handleCustomSubmit = () => {
    if (customAnswer.trim() && !disabled) {
      onSelect(customAnswer, -1, customAnswer);
      setSelectedOption(-1);
    }
  };

  const handleCustomInputChange = (value: string) => {
    setCustomAnswer(value);
    if (value.trim()) {
      setSelectedOption(null); // Clear option selection when typing
    }
  };

  return (
    <div className="options-container">
      {/* Multiple Choice Options */}
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => handleOptionClick(option, index)}
          disabled={disabled}
          className={`option-button ${selectedOption === index ? 'selected' : ''}`}
        >
          <div className="flex items-center gap-3">
            <div 
              className={`w-5 h-5 rounded-full border-2 transition-all ${
                selectedOption === index 
                  ? 'border-transparent' 
                  : 'border-gray-300'
              }`}
              style={{
                background: selectedOption === index ? 'var(--kaboom-violet)' : 'transparent'
              }}
            >
              {selectedOption === index && (
                <div className="w-3 h-3 bg-white rounded-full mx-auto mt-0.5"></div>
              )}
            </div>
            <span className="font-medium">{option}</span>
          </div>
        </button>
      ))}

      {/* Custom Input Section */}
      <div 
        className="mt-8 p-6 rounded-2xl border-2 transition-all duration-300"
        style={{
          background: 'linear-gradient(135deg, var(--kaboom-mint-light) 0%, rgba(153, 229, 209, 0.1) 100%)',
          border: selectedOption === -1 ? '2px solid var(--kaboom-violet)' : '2px solid var(--kaboom-mint)'
        }}
      >
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'var(--kaboom-dragonfruit)' }}
            >
              <span className="text-white text-lg">💭</span>
            </div>
            <h4 className="text-lg font-bold" style={{ color: 'var(--kaboom-violet)' }}>
              Oder möchten Sie Ihre eigene Antwort eingeben?
            </h4>
          </div>
          <p className="text-sm text-gray-600 font-medium">
            Ihre individuelle Antwort wird die Auswahl oben überschreiben
          </p>
        </div>

        <div className="space-y-4">
          <textarea
            value={customAnswer}
            onChange={(e) => handleCustomInputChange(e.target.value)}
            disabled={disabled}
            className={`form-input min-h-[90px] ${
              selectedOption === -1 
                ? 'border-2' 
                : ''
            }`}
            style={{
              borderColor: selectedOption === -1 ? 'var(--kaboom-violet)' : undefined,
              background: selectedOption === -1 ? 'rgba(62, 28, 102, 0.05)' : undefined
            }}
            placeholder="Beschreiben Sie hier Ihre Gedanken, Erfahrungen oder spezifischen Interessen..."
          />
          
          {customAnswer.trim() && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ background: 'var(--kaboom-sunflower)' }}
                ></div>
                <span className="text-sm font-semibold" style={{ color: 'var(--kaboom-violet)' }}>
                  Individuelle Antwort wird verwendet
                </span>
              </div>
              <button
                onClick={handleCustomSubmit}
                disabled={disabled || !customAnswer.trim()}
                className="btn-primary text-sm py-2 px-4"
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