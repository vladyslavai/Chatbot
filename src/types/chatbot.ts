export interface Question {
  id: number;
  text: string;
  options: string[];
}

export interface Answer {
  questionId: number;
  selectedOption: string;
  optionIndex: number;
}

export interface CareerProfile {
  id: string;
  title: string;
  description: string;
  explanation: string;
  matchingCriteria: number[];
  icon: string;
  nextSteps: string[];
}

export interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  options?: string[];
}

export enum ChatState {
  WELCOME = 'welcome',
  QUESTION = 'question',
  PROCESSING = 'processing',
  RESULT = 'result',
  CONTACT_FORM = 'contact_form'
}

export interface Analytics {
  questionTimes: number[];
  totalTime: number;
  mostCommonAnswers: { [key: number]: number };
  confidence: number;
}

export interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredProfile: string;
  additionalInfo: string;
}

export type Language = 'de' | 'en' | 'fr' | 'it';

export interface Translation {
  [key: string]: {
    [key in Language]: string;
  };
} 