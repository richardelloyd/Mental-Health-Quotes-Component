import { Quote, QuotableResponse, Topic } from '../types/quote';
import { localQuotes } from '../data/quotes';

const QUOTABLE_API = 'https://api.quotable.io/random';

const topicTags = {
  anxiety: ['anxiety', 'fear', 'courage'],
  depression: ['hope', 'inspirational', 'perseverance'],
  adhd: ['wisdom', 'focus', 'success']
};

export async function fetchQuote(topic: Topic): Promise<Quote> {
  try {
    const tags = topicTags[topic].join('|');
    const response = await fetch(`${QUOTABLE_API}?tags=${tags}`);
    
    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data: QuotableResponse = await response.json();
    
    return {
      text: data.content,
      author: data.author,
      topic
    };
  } catch (error) {
    // Fallback to local quotes if API fails
    const topicQuotes = localQuotes.filter(q => q.topic === topic);
    const randomIndex = Math.floor(Math.random() * topicQuotes.length);
    return topicQuotes[randomIndex];
  }
}

export function getRandomLocalQuote(topic?: Topic): Quote {
  const availableQuotes = topic 
    ? localQuotes.filter(q => q.topic === topic)
    : localQuotes;
  const randomIndex = Math.floor(Math.random() * availableQuotes.length);
  return availableQuotes[randomIndex];
}