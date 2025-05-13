import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StockSearch from './components/StockSearch';
import NewsFeed from './components/NewsFeed';
import SentimentDisplay from './components/SentimentDisplay';
import { api, NewsArticle, StockInfo, SentimentTrends as SentimentTrendsType, WatchlistItem, User } from './services/api';
import './App.css';
import StockAnalysis from './components/StockAnalysis';
import { ThemeProvider } from './contexts/ThemeContext';
import './styles/global.css';
import SentimentTrends from './components/SentimentTrends';
import Sidebar from './components/Sidebar';
import AuthForm from './components/AuthForm';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

function MainApp() {
  const [selectedTicker, setSelectedTicker] = useState<string>('');
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [stockInfo, setStockInfo] = useState<StockInfo | null>(null);
  const [currentSentiment, setCurrentSentiment] = useState<{
    label: string;
    score: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentimentTrends, setSentimentTrends] = useState<SentimentTrendsType | null>(null);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUser(user);
      // Fetch watchlist for the logged-in user
      api.getWatchlist(user.id)
        .then(setWatchlist)
        .catch(() => setWatchlist([]));
    }
  }, []);

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
      
      // Fetch sentiment trends
      const trendsData = await api.getSentimentTrends(ticker);
      setSentimentTrends(trendsData);
      
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

  const handleSidebarSelect = (symbol: string) => {
    setSelectedTicker(symbol);
    handleStockSearch(symbol);
  };

  const handleLogin = () => navigate('/login');
  const handleRegister = () => navigate('/register');

  const handleLoginSubmit = async (data: { email: string; password: string }) => {
    try {
      const user = await api.loginUser(data);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      navigate('/');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Login failed');
    }
  };

  const handleRegisterSubmit = async (data: { email: string; password: string } | { username: string; email: string; password: string }) => {
    if ('username' in data) {
      try {
        const user = await api.registerUser(data);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        navigate('/');
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Registration failed');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const handleAddToWatchlist = async () => {
    if (!user) {
      alert('Please login to add stocks to your watchlist');
      return;
    }
    if (!selectedTicker || !stockInfo) {
      return;
    }

    try {
      const newItem = await api.addToWatchlist(
        selectedTicker,
        selectedTicker, // Using ticker as name for now
        user.id
      );
      setWatchlist([...watchlist, newItem]);
      alert('Added to watchlist successfully!');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to add to watchlist');
    }
  };

  return (
    <div className="App" style={{ display: 'flex' }}>
      <Sidebar
        watchlist={watchlist}
        selectedSymbol={selectedTicker}
        onSelect={handleSidebarSelect}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onLogout={handleLogout}
        user={user}
      />
      <main className="main-content" style={{ flex: 1 }}>
        <Header />
        <Routes>
          <Route
            path="/login"
            element={<AuthForm mode="login" onSubmit={handleLoginSubmit} />}
          />
          <Route
            path="/register"
            element={<AuthForm mode="register" onSubmit={handleRegisterSubmit} />}
          />
          <Route
            path="/"
            element={
              <>
                <StockSearch onSearch={handleStockSearch} />
                {error && <div className="error-message">{error}</div>}
                {loading && <div className="loading">Loading...</div>}
                {selectedTicker && stockInfo && (
                  <div className="stock-info">
                    <div className="stock-header">
                      <h2>{selectedTicker}</h2>
                      <button 
                        className="add-to-watchlist-btn"
                        onClick={handleAddToWatchlist}
                        title={user ? "Add to watchlist" : "Login to add to watchlist"}
                      >
                        {user ? "⭐ Add to Watchlist" : "🔒 Login to Add"}
                      </button>
                    </div>
                    <p className="price">${stockInfo.price.toFixed(2)}</p>
                    <p className={`price-change ${stockInfo.priceChange >= 0 ? 'positive' : 'negative'}`}>
                      {stockInfo.priceChange >= 0 ? '+' : ''}{stockInfo.priceChange.toFixed(2)}%
                    </p>
                  </div>
                )}
                {selectedTicker && <StockAnalysis ticker={selectedTicker} />}
                {selectedTicker && (
                  <>
                    {currentSentiment && <SentimentDisplay sentiment={currentSentiment} />}
                    {selectedTicker && sentimentTrends && (
                      <SentimentTrends trends={sentimentTrends} />
                    )}
                    <NewsFeed news={news} />
                  </>
                )}
              </>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

const App = () => (
  <ThemeProvider>
    <Router>
      <MainApp />
    </Router>
  </ThemeProvider>
);

export default App;
