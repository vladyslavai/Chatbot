'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChatMessage, Answer, ChatState, Language, Analytics, ContactForm as ContactFormType, UserResponse, OpenAIResponse } from '@/types/chatbot';
import { questions, careerProfiles } from '@/data/questions';
import { translations } from '@/data/translations';
import { analyzeCareerProfile } from '@/lib/openai';
import ChatMessageComponent from './ChatMessage';
import QuestionOptions from './QuestionOptions';
import ProgressIndicator from './ProgressIndicator';
import ResultCard from './ResultCard';
import AIResultCard from './AIResultCard';
import AnalyticsCard from './AnalyticsCard';
import LanguageSelector from './LanguageSelector';
import ContactForm from './ContactForm';
import { Brain, Loader2 } from 'lucide-react';

export default function ChatInterface() {
  const [chatState, setChatState] = useState<ChatState>(ChatState.WELCOME);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [userResponses, setUserResponses] = useState<UserResponse[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [language, setLanguage] = useState<Language>('de');
  const [analytics, setAnalytics] = useState<Analytics>({
    questionTimes: [],
    totalTime: 0,
    mostCommonAnswers: {},
    confidence: 0
  });
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [recommendedProfile, setRecommendedProfile] = useState<typeof careerProfiles[0] | null>(null);
  const [aiResponse, setAiResponse] = useState<OpenAIResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(0);

  // Real-time timer for analytics
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const getTranslation = useCallback((key: string): string => {
    return translations[key]?.[language] || translations[key]?.['de'] || key;
  }, [language]);

  // Calculate result
  const calculateResult = useCallback((userAnswers: Answer[]): typeof careerProfiles[0] => {
    const scoreMap = new Map<string, number>();
    let maxScore = 0;
    
    careerProfiles.forEach(profile => {
      let score = 0;
      profile.matchingCriteria.forEach((criteria, index) => {
        if (userAnswers[index] && userAnswers[index].optionIndex === criteria) {
          score += 3;
        } else if (userAnswers[index]) {
          score += 1;
        }
      });
      scoreMap.set(profile.id, score);
      maxScore = Math.max(maxScore, score);
    });
    
    let bestProfile = careerProfiles[0];
    let highestScore = 0;
    
    scoreMap.forEach((score, profileId) => {
      if (score > highestScore) {
        highestScore = score;
        bestProfile = careerProfiles.find(p => p.id === profileId) || careerProfiles[0];
      }
    });
    
    const confidence = Math.round((maxScore / (questions.length * 3)) * 100);
    setAnalytics(prev => ({ ...prev, confidence }));
    
    return bestProfile;
  }, []);

  const addBotMessage = useCallback((text: string, options?: string[]) => {
    setIsTyping(true);
    
    setTimeout(() => {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        text,
        isBot: true,
        timestamp: new Date(),
        options
      };
      
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
      
      if (options) {
        setTimeout(() => setShowOptions(true), 300);
      }
    }, 800);
  }, []);

  const startFirstQuestion = useCallback(() => {
    setChatState(ChatState.QUESTION);
    setQuestionStartTime(Date.now());
    addBotMessage(questions[0].text, questions[0].options);
  }, [addBotMessage]);

  // Initialize with welcome message
  useEffect(() => {
    if (chatState === ChatState.WELCOME && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: '1',
        text: getTranslation('welcome'),
        isBot: true,
        timestamp: new Date()
      };
      
      setTimeout(() => {
        setMessages([welcomeMessage]);
        setTimeout(() => {
          startFirstQuestion();
        }, 1500);
      }, 500);
    }
  }, [chatState, messages.length, getTranslation, startFirstQuestion]);

  // Handle language changes
  useEffect(() => {
    if (messages.length > 0 && chatState === ChatState.WELCOME) {
      setMessages(prev => prev.map(msg => 
        msg.id === '1' && msg.isBot 
          ? { ...msg, text: getTranslation('welcome') }
          : msg
      ));
    }
  }, [language, messages.length, chatState, getTranslation]);

  const restartSurvey = () => {
    setChatState(ChatState.WELCOME);
    setMessages([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setUserResponses([]);
    setIsTyping(false);
    setShowOptions(false);
    setStartTime(Date.now());
    setCurrentTime(0);
    setRecommendedProfile(null);
    setAiResponse(null);
    setAnalytics({
      questionTimes: [],
      totalTime: 0,
      mostCommonAnswers: {},
      confidence: 0
    });
  };

  const handleOptionSelect = async (option: string, optionIndex: number, customAnswer?: string) => {
    setShowOptions(false);
    
    // Track timing
    const questionTime = Date.now() - questionStartTime;
    setAnalytics(prev => ({
      ...prev,
      questionTimes: [...prev.questionTimes, questionTime]
    }));
    
    // Determine the actual answer (custom or selected option)
    const actualAnswer = customAnswer || option;
    const isCustom = !!customAnswer;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: actualAnswer,
      isBot: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Save answer to old format for compatibility
    const newAnswer: Answer = {
      questionId: questions[currentQuestionIndex].id,
      selectedOption: actualAnswer,
      optionIndex: isCustom ? -1 : optionIndex,
      customAnswer: isCustom ? customAnswer : undefined
    };
    
    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);
    
    // Save to new UserResponse format for AI analysis
    const userResponse: UserResponse = {
      question: questions[currentQuestionIndex].text,
      answer: actualAnswer,
      isCustom: isCustom
    };
    
    const updatedResponses = [...userResponses, userResponse];
    setUserResponses(updatedResponses);
    
    // Move to next question or result
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        setQuestionStartTime(Date.now());
        addBotMessage(questions[nextIndex].text, questions[nextIndex].options);
      } else {
        // All questions answered, start AI analysis
        startAIAnalysis(updatedResponses);
      }
    }, 400);
  };

  const startAIAnalysis = async (responses: UserResponse[]) => {
    setChatState(ChatState.PROCESSING);
    setIsAnalyzing(true);
    
    addBotMessage('🧠 Vielen Dank für Ihre Antworten! Ich analysiere nun Ihr Profil mit KI-Unterstützung...');
    
    try {
      // Call OpenAI API
      const aiResult = await analyzeCareerProfile(responses);
      setAiResponse(aiResult);
      
      // Calculate total time
      const totalTime = Math.floor((Date.now() - startTime) / 1000);
      setAnalytics(prev => ({ ...prev, totalTime }));
      
      // Switch to AI result state
      setChatState(ChatState.AI_RESULT);
      
      // Add success message
      setTimeout(() => {
        addBotMessage(`✨ Analyse abgeschlossen! Basierend auf Ihren Antworten empfehle ich Ihnen: **${aiResult.role}**`);
      }, 1000);
      
    } catch (error) {
      console.error('AI Analysis failed:', error);
      
      // Fallback to traditional analysis
      const profile = calculateResult(answers);
      setRecommendedProfile(profile);
      setAnalytics(prev => ({ ...prev, totalTime: Math.floor((Date.now() - startTime) / 1000) }));
      setChatState(ChatState.RESULT);
      
      addBotMessage('Analyse abgeschlossen! Hier ist Ihre Karriereempfehlung basierend auf Ihren Antworten.');
    }
    
    setIsAnalyzing(false);
  };

  const handleContact = () => {
    setChatState(ChatState.CONTACT_FORM);
  };

  const handleContactSubmit = (formData: ContactFormType) => {
    console.log('Contact form submitted:', formData);
    const previousState = aiResponse ? ChatState.AI_RESULT : ChatState.RESULT;
    setChatState(previousState);
    addBotMessage('Vielen Dank für Ihr Interesse! Wir werden uns innerhalb von 24 Stunden bei Ihnen melden.');
  };

  const handleContactCancel = () => {
    const previousState = aiResponse ? ChatState.AI_RESULT : ChatState.RESULT;
    setChatState(previousState);
  };

  return (
    <div>
      {/* Header */}
      <div className="header">
        <div className="container">
          <div className="header-content">
            <div>
              {chatState !== ChatState.WELCOME && (
                <a href="#" onClick={restartSurvey} className="back-button">
                  ← Zurück zum Start
                </a>
              )}
              <h1>🤖 KI-Karriereberater</h1>
            </div>
            <LanguageSelector 
              currentLanguage={language} 
              onLanguageChange={setLanguage} 
            />
          </div>
        </div>
      </div>

      <div className="container">
        {/* Progress Indicator */}
        {chatState === ChatState.QUESTION && (
          <div className="progress-container">
            <ProgressIndicator 
              currentStep={currentQuestionIndex + 1} 
              totalSteps={questions.length} 
            />
          </div>
        )}

        {/* Analytics Section - Show during questions and results */}
        {(chatState === ChatState.QUESTION || chatState === ChatState.PROCESSING || chatState === ChatState.AI_RESULT || chatState === ChatState.RESULT) && (
          <div className="fade-in">
            <AnalyticsCard
              analytics={analytics}
              userResponses={userResponses}
              totalTime={currentTime}
              currentQuestion={currentQuestionIndex + 1}
              totalQuestions={questions.length}
            />
          </div>
        )}

        {/* AI Analysis Loading */}
        {isAnalyzing && (
          <div className="card text-center py-8 mb-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center animate-pulse"
                  style={{ background: 'var(--gradient-primary)' }}
                >
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <Loader2 
                  className="absolute -top-2 -right-2 w-6 h-6 animate-spin"
                  style={{ color: 'var(--kaboom-sunflower)' }}
                />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--kaboom-violet)' }}>
                  KI analysiert Ihr Profil...
                </h3>
                <p className="text-gray-600">
                  Bitte warten Sie einen Moment, während wir Ihre perfekte Karriereempfehlung erstellen.
                </p>
              </div>
              <div className="flex gap-2">
                <div 
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ background: 'var(--kaboom-mint)' }}
                ></div>
                <div 
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ 
                    background: 'var(--kaboom-lavender)',
                    animationDelay: '0.1s' 
                  }}
                ></div>
                <div 
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ 
                    background: 'var(--kaboom-tangerine)',
                    animationDelay: '0.2s' 
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="chat-container">
          {messages.map((message, messageIndex) => (
            <div key={message.id} className="fade-in">
              <ChatMessageComponent message={message} />
              
              {message.isBot && 
               message.options && 
               showOptions && 
               messageIndex === messages.length - 1 && (
                <div className="fade-in">
                  <QuestionOptions
                    options={message.options}
                    onSelect={handleOptionSelect}
                    disabled={isTyping || isAnalyzing}
                  />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="fade-in">
              <ChatMessageComponent 
                message={{
                  id: 'typing',
                  text: 'Ich denke nach...',
                  isBot: true,
                  timestamp: new Date()
                }} 
              />
            </div>
          )}
        </div>

        {/* AI Result Display */}
        {chatState === ChatState.AI_RESULT && aiResponse && (
          <div className="fade-in">
            <AIResultCard
              aiResponse={aiResponse}
              userResponses={userResponses}
              onContact={handleContact}
              onRestart={restartSurvey}
              totalTime={analytics.totalTime}
            />
          </div>
        )}

        {/* Traditional Result Display */}
        {chatState === ChatState.RESULT && recommendedProfile && (
          <div className="fade-in">
            <ResultCard
              profile={recommendedProfile}
              onContact={handleContact}
              onRestart={restartSurvey}
              totalTime={analytics.totalTime}
            />
          </div>
        )}
      </div>

      {/* Contact Form Modal */}
      {chatState === ChatState.CONTACT_FORM && (aiResponse || recommendedProfile) && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
          backdropFilter: 'blur(5px)'
        }}>
          <div 
            className="card animate-fade-in" 
            style={{ 
              maxWidth: '420px', 
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto'
            }}
          >
            <ContactForm
              preferredProfile={aiResponse ? aiResponse.role : recommendedProfile!.title}
              onSubmit={handleContactSubmit}
              onCancel={handleContactCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
}