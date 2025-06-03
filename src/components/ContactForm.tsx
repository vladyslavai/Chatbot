'use client';

import { useState } from 'react';
import { ContactForm as ContactFormType } from '@/types/chatbot';
import { Send, X, Mail, Phone, User } from 'lucide-react';

interface ContactFormProps {
  preferredProfile: string;
  onSubmit: (formData: ContactFormType) => void;
  onCancel: () => void;
}

export default function ContactForm({ preferredProfile, onSubmit, onCancel }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormType>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    preferredProfile,
    additionalInfo: ''
  });

  const [errors, setErrors] = useState<Partial<ContactFormType>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<ContactFormType> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'Erforderlich';
    if (!formData.lastName.trim()) newErrors.lastName = 'Erforderlich';
    if (!formData.email.trim()) newErrors.email = 'E-Mail erforderlich';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Ungültiges Format';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onSubmit(formData);
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof ContactFormType, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="text-center mb-6">
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: 'var(--gradient-primary)' }}
        >
          <Mail className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-black mb-2" style={{ color: 'var(--kaboom-violet)' }}>
          Interessiert an Schutzpolizei?
        </h2>
        <p className="text-gray-600">
          Wir melden uns gerne bei Ihnen für weitere Informationen.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                className={`form-input pl-10 ${errors.firstName ? 'error' : ''}`}
                placeholder="Vorname *"
                disabled={isSubmitting}
              />
            </div>
            {errors.firstName && (
              <p className="text-xs mt-1" style={{ color: 'var(--kaboom-dragonfruit)' }}>
                {errors.firstName}
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                className={`form-input pl-10 ${errors.lastName ? 'error' : ''}`}
                placeholder="Nachname *"
                disabled={isSubmitting}
              />
            </div>
            {errors.lastName && (
              <p className="text-xs mt-1" style={{ color: 'var(--kaboom-dragonfruit)' }}>
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`form-input pl-10 ${errors.email ? 'error' : ''}`}
              placeholder="ihre.email@example.com *"
              disabled={isSubmitting}
            />
          </div>
          {errors.email && (
            <p className="text-xs mt-1" style={{ color: 'var(--kaboom-dragonfruit)' }}>
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="form-input pl-10"
              placeholder="+41 44 xxx xx xx (optional)"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Additional Info */}
        <div>
          <textarea
            value={formData.additionalInfo}
            onChange={(e) => handleChange('additionalInfo', e.target.value)}
            rows={3}
            className="form-input"
            placeholder="Haben Sie Fragen oder möchten Sie uns etwas mitteilen?"
            disabled={isSubmitting}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`btn-primary flex-1 ${isSubmitting ? 'opacity-75' : ''}`}
          >
            {isSubmitting ? (
              <>
                <div className="flex gap-1">
                  <div 
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ background: 'white' }}
                  ></div>
                  <div 
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ background: 'white', animationDelay: '0.1s' }}
                  ></div>
                  <div 
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ background: 'white', animationDelay: '0.2s' }}
                  ></div>
                </div>
                Wird gesendet...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Anfrage senden
              </>
            )}
          </button>
          
          <button 
            type="button" 
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-3 rounded-xl border-2 font-semibold transition-all duration-300 hover:bg-gray-50"
            style={{ 
              borderColor: 'var(--kaboom-violet)',
              color: 'var(--kaboom-violet)' 
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
} 