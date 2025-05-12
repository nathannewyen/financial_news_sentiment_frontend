import React from 'react';

interface NewsItem {
  headline: string;
  datetime: number;
  url: string;
  sentiment: {
    label: string;
    score: number;
  };
}

interface NewsFeedProps {
  news: NewsItem[];
}

const NewsFeed: React.FC<NewsFeedProps> = ({ news }) => {
  return (
    <div className="news-feed">
      <h2>Latest News</h2>
      {news.map((item, index) => (
        <div key={index} className="news-card">
          <h3>{item.headline}</h3>
          <p className="news-date">
            {new Date(item.datetime * 1000).toLocaleDateString()}
          </p>
          <div className="sentiment-badge">
            {item.sentiment.label} ({item.sentiment.score.toFixed(2)})
          </div>
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            Read more
          </a>
        </div>
      ))}
    </div>
  );
};

export default NewsFeed; 