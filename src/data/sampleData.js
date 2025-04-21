// Sample Q&A data for the chatbot

/**
 * @typedef {Object} QnA
 * @property {number} id - Unique identifier
 * @property {string} question - User question
 * @property {string} response - AI response
 */

/**
 * @typedef {Object} Suggestion
 * @property {string} title - Suggestion title
 * @property {string} description - Suggestion description
 */

/**
 * @type {QnA[]}
 */
export const sampleData = [
  {
    id: 1,
    question: "What's the difference between GET and POST requests?",
    response: "GET requests are used to retrieve data from the server, and are visible in the URL. POST requests are used to send data to the server to create/update resources, and the data is included in the body of the request, not visible in the URL."
  },
  {
    id: 2,
    question: "Can you explain RESTful APIs?",
    response: "RESTful APIs are designed around the REST (Representational State Transfer) architecture, which uses HTTP requests to access and manipulate data. They follow a stateless, client-server, cacheable communications protocol."
  },
  {
    id: 3,
    question: "What is a Promise in JavaScript?",
    response: "A Promise in JavaScript is an object representing the eventual completion or failure of an asynchronous operation. It allows you to write asynchronous code that is more readable and efficient."
  },
  {
    id: 4,
    question: "How do you handle errors in async/await?",
    response: "Errors in async/await can be handled using try/catch blocks. You wrap your await call inside a try block, and catch any errors that occur in the catch block."
  },
  {
    id: 5,
    question: "What is the virtual DOM?",
    response: "The virtual DOM is a concept used in web development, primarily with libraries like React. It's a lightweight copy of the real DOM, allowing for efficient updates and rendering of the UI by minimizing direct manipulations of the DOM."
  },
  {
    id: 6,
    question: "Can you describe how CORS works?",
    response: "CORS, or Cross-Origin Resource Sharing, is a mechanism that allows restricted resources on a web page to be requested from another domain outside the domain from which the first resource was served. It involves the server setting specific headers that allow for these cross-origin requests."
  },
  {
    id: 7,
    question: "What are microservices?",
    response: "Microservices are a architectural style that structures an application as a collection of small, autonomous services modeled around a business domain. They allow for scalable, flexible, and independent development and deployment of application components."
  },
  {
    id: 8,
    question: "Explain the concept of state management in React.",
    response: "State management in React involves tracking changes to the state (data) of components. This can be done using React's own state management capabilities or through external libraries like Redux, to manage state across multiple components."
  },
  {
    id: 9,
    question: "What is a JWT and how is it used?",
    response: "JWT, or JSON Web Token, is a compact, URL-safe means of representing claims to be transferred between two parties. It's used in authentication and information exchange, allowing servers to verify and trust the data in the token."
  },
  {
    id: 10,
    question: "How do you optimize website performance?",
    response: "Website performance can be optimized through various methods, including minimizing HTTP requests, optimizing file sizes and formats, using content delivery networks, caching, and streamlining code (HTML, CSS, JavaScript)."
  }
];

/**
 * Gets random suggestions from sample data
 * @returns {Suggestion[]} Array of suggestions
 */
export const getSuggestions = () => {
  // Return a random selection of 4 questions to use as suggestions
  const shuffled = [...sampleData].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 4).map(item => ({
    title: item.question,
    description: "Get immediate AI generated response"
  }));
};

/**
 * Find a response for a given user question
 * @param {string} question - User's question
 * @returns {string} AI response
 */
export const findResponseForQuestion = (question) => {
  // Simple fuzzy search - check if the question contains keywords from our sample questions
  const lowerQuestion = question.toLowerCase();
  
  // First, try exact matches or close matches
  for (const item of sampleData) {
    if (item.question.toLowerCase() === lowerQuestion) {
      return item.response;
    }
    
    // Check if the user question contains most of the keywords from a sample question
    const sampleKeywords = item.question.toLowerCase().split(' ')
      .filter(word => word.length > 3); // Only consider significant words
    
    const matchCount = sampleKeywords.filter(word => lowerQuestion.includes(word)).length;
    const matchPercentage = matchCount / sampleKeywords.length;
    
    if (matchPercentage > 0.7) { // If 70% of keywords match
      return item.response;
    }
  }
  
  // If no good match is found, check for topic-based keywords
  if (lowerQuestion.includes('api') || lowerQuestion.includes('rest')) {
    return sampleData[1].response; // RESTful APIs
  } else if (lowerQuestion.includes('promise') || lowerQuestion.includes('async')) {
    return sampleData[2].response; // Promise
  } else if (lowerQuestion.includes('dom') || lowerQuestion.includes('react')) {
    return sampleData[4].response; // Virtual DOM
  } else if (lowerQuestion.includes('jwt') || lowerQuestion.includes('token')) {
    return sampleData[8].response; // JWT
  } else if (lowerQuestion.includes('performance') || lowerQuestion.includes('optimize')) {
    return sampleData[9].response; // Website performance
  }
  
  // Default response if no match is found
  return "Sorry, Did not understand your query!";
};