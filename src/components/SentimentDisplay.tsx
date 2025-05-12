import React from 'react';

interface SentimentDisplayProps {
  sentiment: {
    label: string;
    score: number;
  };
}

const SentimentDisplay: React.FC<SentimentDisplayProps> = ({ sentiment }) => {
  const getSentimentColor = (label: string) => {
    switch (label.toLowerCase()) {
      case 'positive':
        return '#4caf50';
      case 'negative':
        return '#f44336';
      default:
        return '#9e9e9e';
    }
  };

  return (
    <div className="sentiment-display">
      <h3>Sentiment Analysis</h3>
      <div 
        className="sentiment-indicator"
        style={{ backgroundColor: getSentimentColor(sentiment.label) }}
      >
        <span className="sentiment-label">{sentiment.label}</span>
        <span className="sentiment-score">
          Confidence: {(sentiment.score * 100).toFixed(1)}%
        </span>
      </div>
    </div>
  );
};

export default SentimentDisplay; 