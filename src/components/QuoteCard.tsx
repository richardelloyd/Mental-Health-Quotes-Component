import React, { useState, useEffect } from 'react';
import { Quote as QuoteIcon, RefreshCw } from 'lucide-react';
import { Quote, Topic } from '../types/quote';
import { fetchQuote, getRandomLocalQuote } from '../services/quoteService';

function QuoteCard() {
  const [quote, setQuote] = useState<Quote>(getRandomLocalQuote());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const topicColors = {
    adhd: 'bg-purple-100 text-purple-800',
    anxiety: 'bg-blue-100 text-blue-800',
    depression: 'bg-teal-100 text-teal-800'
  };

  const getNewQuote = async (topic?: Topic) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (topic) {
        const newQuote = await fetchQuote(topic);
        setQuote(newQuote);
      } else {
        const randomTopic = ['adhd', 'anxiety', 'depression'][Math.floor(Math.random() * 3)] as Topic;
        const newQuote = await fetchQuote(randomTopic);
        setQuote(newQuote);
      }
    } catch (err) {
      setError('Failed to fetch quote. Using local quotes instead.');
      setQuote(getRandomLocalQuote(topic));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getNewQuote();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <QuoteIcon className="w-10 h-10 text-gray-400" />
          <div className="flex gap-2">
            {error && (
              <span className="text-sm text-red-600 animate-fade-in">
                {error}
              </span>
            )}
            <span className={`px-4 py-1 rounded-full text-sm font-medium ${topicColors[quote.topic]}`}>
              {quote.topic}
            </span>
          </div>
        </div>
        
        <div className="space-y-4">
          <p className="text-2xl font-serif text-gray-800 leading-relaxed">
            "{quote.text}"
          </p>
          <p className="text-gray-600 font-medium">
            — {quote.author}
          </p>
        </div>
        
        <div className="mt-8 flex flex-wrap gap-2">
          <button
            onClick={() => getNewQuote()}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Random Quote
          </button>
          
          {(['adhd', 'anxiety', 'depression'] as Topic[]).map((topic) => (
            <button
              key={topic}
              onClick={() => getNewQuote(topic)}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                topicColors[topic]} bg-opacity-50 hover:bg-opacity-75 disabled:opacity-50`}
            >
              {topic.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuoteCard;