const responses = {
  greetings: ["Hello! How can I assist you today?", "Hi there! What would you like to know about education or careers?", "Greetings! How may I help you with your educational or career queries?"],
  career: ["What career field are you interested in?", "Have you considered internships to gain practical experience?", "Networking is crucial for career growth. Have you joined any professional associations?"],
  education: ["What's your current education level?", "Are you interested in pursuing further studies?", "There are many online learning platforms available. Have you explored any?"],
  skills: ["What skills are you looking to develop?", "Continuous learning is important in any career. What's the last skill you learned?", "Have you considered any certification courses to enhance your skills?"],
  resume: ["Make sure your resume is concise and highlights your key achievements.", "Tailor your resume for each job application to stand out.", "Don't forget to include relevant skills and experiences in your resume."],
  interview: ["Prepare for common interview questions and practice your responses.", "Research the company thoroughly before your interview.", "During the interview, don't forget to ask thoughtful questions about the role and company."],
  default: ["I'm not sure I understand. Could you please rephrase that?", "Can you provide more context about what you're asking?", "I'm still learning. Could you try asking about careers, education, or skills specifically?"]
};

const categories = {
  greetings: ['hello', 'hi', 'hey', 'greet', 'welcome'],
  career: ['career', 'job', 'work', 'profession', 'occupation'],
  education: ['education', 'study', 'learn', 'degree', 'course', 'university', 'college'],
  skills: ['skill', 'ability', 'competence', 'expertise', 'proficiency'],
  resume: ['resume', 'cv', 'curriculum', 'vitae', 'application'],
  interview: ['interview', 'hiring', 'recruit', 'selection']
};

function classifyInput(input) {
  const lowercaseInput = input.toLowerCase();
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowercaseInput.includes(keyword))) {
      return category;
    }
  }
  return 'default';
}

export function getChatbotResponse(input) {
  const category = classifyInput(input);
  const possibleResponses = responses[category];
  return possibleResponses[Math.floor(Math.random() * possibleResponses.length)];
}