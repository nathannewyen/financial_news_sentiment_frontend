import React from 'react';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-title">
          <h1>📈 Financial News Sentiment</h1>
          <p>Real-time sentiment analysis for financial news</p>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header; 