'use client';

import { useState, useEffect, useMemo } from 'react';
import { ChatMessage, Answer, ChatState, Language, Analytics, ContactForm as ContactFormType } from '@/types/chatbot';
import { questions, careerProfiles } from '@/data/questions';
import { translations } from '@/data/translations';
import ChatMessageComponent from './ChatMessage';
import QuestionOptions from './QuestionOptions';
import ProgressIndicator from './ProgressIndicator';
import ResultCard from './ResultCard';
import LanguageSelector from './LanguageSelector';
import ContactForm from './ContactForm';
import ParticleEffect from './ParticleEffect';
import TypewriterText from './TypewriterText';
import CareerFlipCard from './CareerFlipCard';

export default function ChatInterface() {
  const [chatState, setChatState] = useState<ChatState>(ChatState.WELCOME);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
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
  const [showCareerCards, setShowCareerCards] = useState(false);
  const [typewriterComplete, setTypewriterComplete] = useState(false);

  const getTranslation = (key: string): string => {
    return translations[key]?.[language] || translations[key]?.['de'] || key;
  };

  // Calculate result without side effects
  const calculateResult = (userAnswers: Answer[]): typeof careerProfiles[0] => {
    const scoreMap = new Map<string, number>();
    let maxScore = 0;
    
    careerProfiles.forEach(profile => {
      let score = 0;
      profile.matchingCriteria.forEach((criteria, index) => {
        if (userAnswers[index] && userAnswers[index].optionIndex === criteria) {
          score += 3; // Perfect match
        } else if (userAnswers[index]) {
          score += 1; // Partial match for any answer
        }
      });
      scoreMap.set(profile.id, score);
      maxScore = Math.max(maxScore, score);
    });
    
    // Find profile with highest score
    let bestProfile = careerProfiles[0];
    let highestScore = 0;
    
    scoreMap.forEach((score, profileId) => {
      if (score > highestScore) {
        highestScore = score;
        bestProfile = careerProfiles.find(p => p.id === profileId) || careerProfiles[0];
      }
    });
    
    // Calculate confidence and update analytics
    const confidence = Math.round((maxScore / (questions.length * 3)) * 100);
    setAnalytics(prev => ({ ...prev, confidence }));
    
    return bestProfile;
  };

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
          setShowCareerCards(true);
          setTimeout(() => {
            startFirstQuestion();
          }, 2000);
        }, 1500);
      }, 500);
    }
  }, [chatState]);

  // Handle language changes for existing messages
  useEffect(() => {
    if (messages.length > 0 && chatState === ChatState.WELCOME) {
      setMessages(prev => prev.map(msg => 
        msg.id === '1' && msg.isBot 
          ? { ...msg, text: getTranslation('welcome') }
          : msg
      ));
    }
  }, [language]);

  const startFirstQuestion = () => {
    setChatState(ChatState.QUESTION);
    setQuestionStartTime(Date.now());
    setShowCareerCards(false);
    addBotMessage(questions[0].text, questions[0].options);
  };

  const restartSurvey = () => {
    setChatState(ChatState.WELCOME);
    setMessages([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setIsTyping(false);
    setShowOptions(false);
    setStartTime(Date.now());
    setRecommendedProfile(null);
    setShowCareerCards(false);
    setTypewriterComplete(false);
    setAnalytics({
      questionTimes: [],
      totalTime: 0,
      mostCommonAnswers: {},
      confidence: 0
    });
  };

  const addBotMessage = (text: string, options?: string[]) => {
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
    }, 1000);
  };

  const handleOptionSelect = (option: string, optionIndex: number) => {
    setShowOptions(false);
    
    // Track timing
    const questionTime = Date.now() - questionStartTime;
    setAnalytics(prev => ({
      ...prev,
      questionTimes: [...prev.questionTimes, questionTime]
    }));
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: option,
      isBot: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Save answer
    const newAnswer: Answer = {
      questionId: questions[currentQuestionIndex].id,
      selectedOption: option,
      optionIndex
    };
    
    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);
    
    // Move to next question or result
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        setQuestionStartTime(Date.now());
        addBotMessage(questions[nextIndex].text, questions[nextIndex].options);
      } else {
        // All questions answered, show result
        setChatState(ChatState.PROCESSING);
        addBotMessage('Vielen Dank für Ihre Antworten! Ich analysiere nun Ihr Profil und finde die beste Karriereoption für Sie...');
        
        setTimeout(() => {
          const profile = calculateResult(updatedAnswers);
          const totalTime = Math.floor((Date.now() - startTime) / 1000);
          setAnalytics(prev => ({ ...prev, totalTime }));
          setRecommendedProfile(profile);
          setChatState(ChatState.RESULT);
          showResult(profile);
        }, 3000);
      }
    }, 800);
  };

  const showResult = (profile: typeof careerProfiles[0]) => {
    const resultMessage: ChatMessage = {
      id: Date.now().toString(),
      text: `Basierend auf Ihren Antworten haben wir die perfekte Laufbahn für Sie gefunden: ${profile.title}!`,
      isBot: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, resultMessage]);
  };

  const handleLearnMore = () => {
    addBotMessage('Vielen Dank für Ihr Interesse! Besuchen Sie unsere Infoabende oder kontaktieren Sie uns direkt für weitere Details.');
  };

  const handleContact = () => {
    setChatState(ChatState.CONTACT_FORM);
  };

  const handleContactSubmit = (formData: ContactFormType) => {
    console.log('Contact form submitted:', formData);
    addBotMessage(`Vielen Dank ${formData.firstName}! Wir haben Ihre Anfrage erhalten und werden uns innerhalb der nächsten 2 Werktage bei Ihnen melden.`);
    setChatState(ChatState.RESULT);
  };

  const handleContactCancel = () => {
    setChatState(ChatState.RESULT);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const estimatedTimeRemaining = Math.max(0, 120 - Math.floor((Date.now() - startTime) / 1000));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white py-8 px-4 relative overflow-hidden">
      {/* Particle Effects */}
      <ParticleEffect count={15} />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header with Swiss precision */}
        <div className="text-center mb-8">
          <div className="zurich-gradient text-white py-8 px-8 rounded-2xl mb-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <LanguageSelector 
                currentLanguage={language} 
                onLanguageChange={setLanguage} 
              />
            </div>
            
            <div className="relative z-10">
              <h1 className="text-5xl font-bold mb-3">
                <TypewriterText 
                  text={getTranslation('title')}
                  speed={100}
                  onComplete={() => setTypewriterComplete(true)}
                />
              </h1>
              
              {typewriterComplete && (
                <div className="animate-fade-in-up">
                  <p className="text-blue-100 text-xl mb-2">
                    {getTranslation('subtitle')}
                  </p>
                  <p className="text-blue-200 text-sm max-w-3xl mx-auto leading-relaxed">
                    {getTranslation('motto')}
                  </p>
                  
                  {chatState === ChatState.QUESTION && (
                    <div className="text-blue-200 text-sm mt-4 animate-pulse-glow">
                      ⏱️ Geschätzte Zeit: ~{Math.floor(estimatedTimeRemaining / 60)}:{(estimatedTimeRemaining % 60).toString().padStart(2, '0')} Min.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Career Cards Preview */}
        {showCareerCards && chatState === ChatState.WELCOME && (
          <div className="mb-8 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Entdecken Sie Ihre Karrieremöglichkeiten
            </h2>
            <div className="swiss-grid">
              {careerProfiles.map((profile, index) => (
                <div
                  key={profile.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <CareerFlipCard profile={profile} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress Indicator with Swiss styling */}
        {chatState === ChatState.QUESTION && (
          <div className="animate-slide-in-left">
            <ProgressIndicator 
              currentStep={currentQuestionIndex + 1} 
              totalSteps={questions.length} 
            />
          </div>
        )}

        {/* Contact Form */}
        {chatState === ChatState.CONTACT_FORM && recommendedProfile && (
          <ContactForm
            preferredProfile={recommendedProfile.title}
            onSubmit={handleContactSubmit}
            onCancel={handleContactCancel}
          />
        )}

        {/* Chat Messages with enhanced styling */}
        {chatState !== ChatState.CONTACT_FORM && (
          <div className="zurich-card rounded-2xl mb-8 overflow-hidden dynamic-shadow">
            <div className="h-96 overflow-y-auto p-6 space-y-4 chat-scroll">
              {messages.map((message) => (
                <ChatMessageComponent key={message.id} message={message} />
              ))}
              
              {isTyping && (
                <ChatMessageComponent 
                  message={{
                    id: 'typing',
                    text: '',
                    isBot: true,
                    timestamp: new Date()
                  }}
                  isTyping={true}
                />
              )}
            </div>

            {/* Question Options with micro-interactions */}
            {chatState === ChatState.QUESTION && showOptions && currentQuestion && (
              <div className="p-6 pt-0">
                <QuestionOptions
                  options={currentQuestion.options}
                  onSelect={handleOptionSelect}
                  disabled={isTyping}
                />
              </div>
            )}
          </div>
        )}

        {/* Result Card with Swiss precision */}
        {chatState === ChatState.RESULT && recommendedProfile && (
          <ResultCard 
            profile={recommendedProfile}
            onLearnMore={handleLearnMore}
            onRestart={restartSurvey}
            onContact={handleContact}
            totalTime={analytics.totalTime}
          />
        )}

        {/* Analytics Summary with premium styling */}
        {chatState === ChatState.RESULT && analytics.confidence > 0 && (
          <div className="mt-8 text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-8 bg-white rounded-xl px-8 py-4 shadow-lg border border-gray-200 glass">
              <div className="text-sm text-gray-600">
                <div className="text-2xl font-bold text-blue-600 mb-1">{analytics.confidence}%</div>
                <div>Übereinstimmung</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-sm text-gray-600">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {analytics.questionTimes.length > 0 
                    ? Math.round(analytics.questionTimes.reduce((a, b) => a + b, 0) / analytics.questionTimes.length / 1000)
                    : 0}s
                </div>
                <div>⌀ Antwortzeit</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-sm text-gray-600">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {Math.floor(analytics.totalTime / 60)}:{(analytics.totalTime % 60).toString().padStart(2, '0')}
                </div>
                <div>Gesamtzeit</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 