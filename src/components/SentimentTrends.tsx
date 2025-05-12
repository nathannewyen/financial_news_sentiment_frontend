import React from 'react';
import { SentimentTrends as SentimentTrendsType } from '../services/api';

interface SentimentTrendsProps {
  trends: SentimentTrendsType;
}

const SentimentTrends: React.FC<SentimentTrendsProps> = ({ trends }) => {
  // Add safety checks for undefined values
  const meanSentiment = trends?.mean_sentiment ?? 0;
  const volatility = trends?.sentiment_volatility ?? 0;
  const trendDirection = trends?.trend_direction ?? 'neutral';
  const distribution = trends?.sentiment_distribution ?? { positive: 0, negative: 0, neutral: 0 };
  const dailyPattern = trends?.time_analysis?.daily_pattern ?? {};
  const weeklyPattern = trends?.time_analysis?.weekly_pattern ?? {};

  return (
    <div className="sentiment-trends">
      <h2>Sentiment Analysis Trends</h2>
      
      <div className="trends-grid">
        <div className="trend-card">
          <h3>Overall Sentiment</h3>
          <p>Mean Sentiment: {meanSentiment.toFixed(2)}</p>
          <p>Volatility: {volatility.toFixed(2)}</p>
          <p>Trend: {trendDirection}</p>
        </div>

        <div className="trend-card">
          <h3>Sentiment Distribution</h3>
          <div className="distribution">
            {Object.entries(distribution).map(([label, value]) => (
              <div key={label} className="distribution-item">
                <span className="label">{label}:</span>
                <span className="value">{(value * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="trend-card">
          <h3>Daily Pattern</h3>
          <div className="pattern-chart">
            {Object.entries(dailyPattern).map(([hour, score]) => (
              <div key={hour} className="pattern-bar" style={{
                height: `${Math.abs(score * 100)}%`,
                backgroundColor: score >= 0 ? '#4caf50' : '#f44336'
              }}>
                <span className="hour">{hour}:00</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentTrends; 