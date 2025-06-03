import { Question, CareerProfile } from '@/types/chatbot';

export const questions: Question[] = [
  {
    id: 1,
    text: "Welcher Arbeitsbereich interessiert Sie am meisten?",
    options: [
      "Direkter Bürgerkontakt und Beratung",
      "Ermittlungsarbeit und Analyse",
      "Technische Systeme und Verkehrskontrolle",
      "Sicherheit und Schutz von Einrichtungen"
    ]
  },
  {
    id: 2,
    text: "Wie gehen Sie am liebsten mit herausfordernden Situationen um?",
    options: [
      "Durch ruhige Kommunikation und Deeskalation",
      "Mit systematischer Analyse und Recherche",
      "Durch präzise Kontrolle und Überwachung",
      "Mit proaktiver Sicherheitsplanung"
    ]
  },
  {
    id: 3,
    text: "Was motiviert Sie bei der Arbeit am meisten?",
    options: [
      "Menschen zu helfen und zu unterstützen",
      "Komplexe Fälle zu lösen",
      "Ordnung und Sicherheit zu gewährleisten",
      "Wichtige Einrichtungen zu schützen"
    ]
  }
];

export const careerProfiles: CareerProfile[] = [
  {
    id: "polizist",
    title: "Polizist*in",
    description: "Der wohl abwechslungsreichste Job der Schweiz. Als Polizist*in sind Sie täglich für den Schutz der Bevölkerung in der grössten Stadt der Schweiz im Einsatz.",
    explanation: "Ihre Antworten zeigen, dass Sie gerne direkten Kontakt zu Menschen haben und durch ruhige Kommunikation schwierige Situationen meistern möchten - perfekt für den Polizeiberuf.",
    matchingCriteria: [0, 0, 0],
    icon: "👮‍♂️",
    nextSteps: [
      "Besuchen Sie einen unserer Infoabende",
      "Informieren Sie sich über die Ausbildungsvoraussetzungen",
      "Absolvieren Sie den Sporttest",
      "Reichen Sie Ihre Bewerbungsunterlagen ein"
    ]
  },
  {
    id: "assistenzdienst",
    title: "Polizeilicher Assistenzdienst",
    description: "Ein Job mit einem umfassenden Aufgabengebiet. Sie unterstützen die Polizeiarbeit in verschiedenen administrativen und technischen Bereichen.",
    explanation: "Sie bevorzugen systematische Analysen und komplexe Aufgaben - ideal für den vielseitigen Assistenzdienst.",
    matchingCriteria: [1, 1, 1],
    icon: "🖥️",
    nextSteps: [
      "Informieren Sie sich über die verschiedenen Assistenzbereiche",
      "Prüfen Sie die Anforderungen für Ihren Fachbereich",
      "Nehmen Sie Kontakt mit der Personalabteilung auf",
      "Bereiten Sie sich auf das Auswahlverfahren vor"
    ]
  },
  {
    id: "verkehrskontrolle",
    title: "Kontrolle Ruhender Verkehr",
    description: "Sie sorgen für Recht und Ordnung im ruhenden Verkehr in der Stadt Zürich und gewährleisten einen geordneten Verkehrsfluss.",
    explanation: "Ihre Affinität zu präziser Kontrolle und Ordnung macht Sie zu einem idealen Kandidaten für die Verkehrskontrolle.",
    matchingCriteria: [2, 2, 2],
    icon: "🚗",
    nextSteps: [
      "Lernen Sie die Verkehrsbestimmungen der Stadt Zürich kennen",
      "Informieren Sie sich über die Arbeitszeiten und Einsatzgebiete",
      "Absolvieren Sie die erforderliche Ausbildung",
      "Starten Sie Ihre Bewerbung online"
    ]
  },
  {
    id: "konsulatsschutz",
    title: "Assistenzdienst Konsulatsschutz",
    description: "Sie sind verantwortlich für die Sicherheit der konsularischen Einrichtungen und gewährleisten den Schutz wichtiger diplomatischer Standorte.",
    explanation: "Ihre Präferenz für Sicherheitsplanung und den Schutz wichtiger Einrichtungen zeigt Ihr Potenzial für den Konsulatsschutz.",
    matchingCriteria: [3, 3, 3],
    icon: "🛡️",
    nextSteps: [
      "Informieren Sie sich über Sicherheitsbestimmungen",
      "Absolvieren Sie die Sicherheitsüberprüfung",
      "Nehmen Sie an speziellen Schulungen teil",
      "Bewerben Sie sich für diese verantwortungsvolle Position"
    ]
  },
  {
    id: "quereinstieg",
    title: "Quer- und Wiedereinstieg",
    description: "Eine neue Herausforderung in der grössten Stadt der Schweiz. Nutzen Sie Ihre bisherige Berufserfahrung für eine Laufbahn bei der Stadtpolizei.",
    explanation: "Ihre vielseitigen Interessen zeigen, dass Sie sich für einen Quereinstieg eignen und neue Perspektiven mitbringen.",
    matchingCriteria: [0, 1, 2],
    icon: "🔄",
    nextSteps: [
      "Lassen Sie Ihre Vorerfahrung bewerten",
      "Informieren Sie sich über Anerkennungsverfahren",
      "Besuchen Sie eine persönliche Beratung",
      "Planen Sie Ihren individuellen Einstiegsweg"
    ]
  }
]; 