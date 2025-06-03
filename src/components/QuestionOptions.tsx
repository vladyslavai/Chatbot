'use client';

interface QuestionOptionsProps {
  options: string[];
  onSelect: (option: string, index: number) => void;
  disabled?: boolean;
}

export default function QuestionOptions({ options, onSelect, disabled = false }: QuestionOptionsProps) {
  return (
    <div className="space-y-3 animate-fade-in-up">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => !disabled && onSelect(option, index)}
          disabled={disabled}
          className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${
            disabled 
              ? 'opacity-50 cursor-not-allowed border-gray-200 bg-gray-50' 
              : 'border-gray-200 bg-white hover:border-blue-600 hover:bg-blue-50 hover:shadow-lg active:scale-[0.98] zurich-card'
          }`}
        >
          <span className="text-sm font-medium text-government leading-relaxed">
            {option}
          </span>
        </button>
      ))}
    </div>
  );
} 