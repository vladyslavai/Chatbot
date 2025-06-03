import OpenAI from 'openai';
import { OpenAIResponse, UserResponse } from '@/types/chatbot';

// Initialize OpenAI client with environment variable
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true,
});

export async function analyzeCareerProfile(userResponses: UserResponse[]): Promise<OpenAIResponse> {
  try {
    // Check if API key is available
    if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
      console.warn('OpenAI API key not found, using fallback analysis');
      return generateFallbackResponse(userResponses);
    }

    // Construct the prompt in German
    const prompt = `Hier sind die Antworten eines Bewerbers für die Stadtpolizei Zürich:

${userResponses.map((response, index) => 
  `${index + 1}. ${response.question}: "${response.answer}"`
).join('\n')}

Als Experte für Karriereberatung bei der Stadtpolizei Zürich, analysiere diese Antworten und empfehle eine spezifische Karriererichtung. Berücksichtige dabei:

- Die Interessensbereiche des Bewerbers
- Seine Persönlichkeitsmerkmale und Arbeitsweise
- Eventuelle spezielle Erfahrungen oder Qualifikationen

Verfügbare Karrierewege bei der Stadtpolizei Zürich:
1. Schutzpolizei (Patrouillendienst, Bürgerkontakt)
2. Verkehrspolizei (Verkehrskontrolle, Unfallaufnahme)
3. Kriminalpolizei (Ermittlungsarbeit, Analyse)
4. Spezialeinheiten (Sicherheit, Schutz von Einrichtungen)
5. Direkter Bürgerkontakt und Beratung
6. Technische Systeme und Verkehrskontrolle

Antworte im folgenden JSON-Format:
{
  "role": "Spezifische Rollenbezeichnung",
  "reasoning": "Detaillierte Begründung in 2-3 Sätzen, warum diese Rolle perfekt passt",
  "confidence": 85
}

Wichtig: Antworte nur mit dem JSON-Objekt, ohne zusätzlichen Text.`;

    console.log('Sending request to OpenAI API...');
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Du bist ein Experte für Karriereberatung bei der Stadtpolizei Zürich. Antworte präzise und hilfreich auf Deutsch.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    console.log('OpenAI API response received');
    
    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    try {
      const cleanedContent = content.trim().replace(/```json\n?|\n?```/g, '');
      const parsedResponse = JSON.parse(cleanedContent);
      
      return {
        role: parsedResponse.role || 'Allgemeine Polizeiarbeit',
        reasoning: parsedResponse.reasoning || 'Basierend auf Ihren Antworten empfehlen wir diese Richtung.',
        confidence: Math.min(Math.max(parsedResponse.confidence || 75, 50), 95) // Ensure confidence is between 50-95
      };
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      
      // Fallback if JSON parsing fails - extract useful info from raw response
      const fallbackRole = content.includes('Verkehrspolizei') ? 'Verkehrspolizei' :
                           content.includes('Kriminalpolizei') ? 'Kriminalpolizei' :
                           content.includes('Schutzpolizei') ? 'Schutzpolizei' :
                           'Allgemeine Polizeiarbeit';
      
      return {
        role: fallbackRole,
        reasoning: content.substring(0, 150) + '...',
        confidence: 70
      };
    }

  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    
    // Intelligent fallback based on user responses
    const fallbackAnalysis = generateFallbackResponse(userResponses);
    return fallbackAnalysis;
  }
}

function generateFallbackResponse(userResponses: UserResponse[]): OpenAIResponse {
  // Simple keyword analysis for fallback
  const allAnswers = userResponses.map(r => r.answer.toLowerCase()).join(' ');
  
  if (allAnswers.includes('technik') || allAnswers.includes('computer') || allAnswers.includes('it')) {
    return {
      role: 'Technische Systeme und Verkehrskontrolle',
      reasoning: 'Ihre Interessensrichtung deutet auf technische Affinität hin. Die Arbeit mit modernen Verkehrssystemen könnte ideal für Sie sein.',
      confidence: 75
    };
  }
  
  if (allAnswers.includes('menschen') || allAnswers.includes('kontakt') || allAnswers.includes('hilfe')) {
    return {
      role: 'Schutzpolizei - Bürgerkontakt',
      reasoning: 'Ihr Interesse am Umgang mit Menschen macht Sie zu einem idealen Kandidaten für die Schutzpolizei mit direktem Bürgerkontakt.',
      confidence: 78
    };
  }
  
  if (allAnswers.includes('ermittlung') || allAnswers.includes('analyse') || allAnswers.includes('detail')) {
    return {
      role: 'Kriminalpolizei',
      reasoning: 'Ihre analytischen Fähigkeiten und Detailorientiertheit passen perfekt zur Ermittlungsarbeit in der Kriminalpolizei.',
      confidence: 72
    };
  }
  
  if (allAnswers.includes('verkehr') || allAnswers.includes('fahrzeug') || allAnswers.includes('sicherheit')) {
    return {
      role: 'Verkehrspolizei',
      reasoning: 'Ihr Interesse an Verkehrssicherheit macht Sie zu einem wertvollen Mitglied der Verkehrspolizei.',
      confidence: 76
    };
  }
  
  // Default fallback
  return {
    role: 'Schutzpolizei',
    reasoning: 'Basierend auf Ihren Antworten empfehlen wir den Einstieg in die Schutzpolizei. Dies bietet vielfältige Aufgaben und ist ein idealer Ausgangspunkt für Ihre Karriere bei der Stadtpolizei Zürich.',
    confidence: 68
  };
}

export default openai; 