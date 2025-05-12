import React, { useState, useEffect, useRef } from 'react';
import '../styles/StockAnalyst.css';
import { useTheme } from '../contexts/ThemeContext';

declare global {
  interface Window {
    TradingView: {
      widget: new (config: any) => any;
    };
  }
}

interface StockAnalysisProps {
  ticker: string;
}

const StockAnalysis: React.FC<StockAnalysisProps> = ({ ticker }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'1d' | '1w' | '1m' | '3m' | '1y'>('1m');
  const { isDarkMode } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load TradingView widget script
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (containerRef.current && ticker) {
        new window.TradingView.widget({
          container_id: containerRef.current.id,
          symbol: ticker,
          interval: timeframe === '1d' ? 'D' : 
                   timeframe === '1w' ? 'W' :
                   timeframe === '1m' ? 'M' :
                   timeframe === '3m' ? '3M' : '12M',
          theme: isDarkMode ? 'dark' : 'light',
          style: '1',
          locale: 'en',
          toolbar_bg: isDarkMode ? '#1e222d' : '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: false,
          save_image: false,
          height: 500,
          width: '100%',
          studies: [
            'MASimple@tv-basicstudies',
            'RSI@tv-basicstudies',
            'MACD@tv-basicstudies'
          ],
          show_popup_button: true,
          popup_width: '1000',
          popup_height: '650',
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [ticker, timeframe, isDarkMode]);

  if (loading) return <div className="loading">Loading stock data...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className={`stock-analysis ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="timeframe-selector">
        <button 
          className={timeframe === '1d' ? 'active' : ''} 
          onClick={() => setTimeframe('1d')}
        >
          1D
        </button>
        <button 
          className={timeframe === '1w' ? 'active' : ''} 
          onClick={() => setTimeframe('1w')}
        >
          1W
        </button>
        <button 
          className={timeframe === '1m' ? 'active' : ''} 
          onClick={() => setTimeframe('1m')}
        >
          1M
        </button>
        <button 
          className={timeframe === '3m' ? 'active' : ''} 
          onClick={() => setTimeframe('3m')}
        >
          3M
        </button>
        <button 
          className={timeframe === '1y' ? 'active' : ''} 
          onClick={() => setTimeframe('1y')}
        >
          1Y
        </button>
      </div>

      <div 
        ref={containerRef}
        id={`tradingview_${ticker}`}
        className="tradingview-widget-container"
      />
    </div>
  );
};

export default StockAnalysis;