import React, { useState } from 'react';
import Header from './components/Header';
import StockSearch from './components/StockSearch';
import NewsFeed from './components/NewsFeed';
import SentimentDisplay from './components/SentimentDisplay';
import { api, NewsArticle, StockInfo } from './services/api';
import './App.css';
import StockAnalysis from './components/StockAnalysis';
import { ThemeProvider } from './contexts/ThemeContext';
import './styles/global.css';

function App() {
  const [selectedTicker, setSelectedTicker] = useState<string>('');
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [stockInfo, setStockInfo] = useState<StockInfo | null>(null);
  const [currentSentiment, setCurrentSentiment] = useState<{
    label: string;
    score: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStockSearch = async (ticker: string) => {
    setSelectedTicker(ticker);
    setLoading(true);
    setError(null);
    
    try {
      // Fetch stock info
      const stockData = await api.getStockInfo(ticker);
      setStockInfo(stockData);
      
      // Fetch news
      const newsData = await api.getNews(ticker);
      setNews(newsData);
      
      // If we have news, use the first article's sentiment as current sentiment
      if (newsData.length > 0) {
        setCurrentSentiment(newsData[0].sentiment);
      }
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider>
      <div className="App">
        <Header />
        <main className="main-content">
          <StockSearch onSearch={handleStockSearch} />
          
          {error && <div className="error-message">{error}</div>}
          
          {loading && <div className="loading">Loading...</div>}
          
          {selectedTicker && stockInfo && (
            <div className="stock-info">
              <h2>{selectedTicker}</h2>
              <p className="price">${stockInfo.price.toFixed(2)}</p>
              <p className={`price-change ${stockInfo.priceChange >= 0 ? 'positive' : 'negative'}`}>
                {stockInfo.priceChange >= 0 ? '+' : ''}{stockInfo.priceChange.toFixed(2)}%
              </p>
            </div>
          )}

          {selectedTicker && (
            <StockAnalysis ticker={selectedTicker} />
          )}
          
          {selectedTicker && (
            <>
              {currentSentiment && <SentimentDisplay sentiment={currentSentiment} />}
              <NewsFeed news={news} />
            </>
          )}
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
