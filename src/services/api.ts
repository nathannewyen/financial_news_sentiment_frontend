const API_BASE_URL = 'http://localhost:8000/api';

export interface StockInfo {
  price: number;
  priceChange: number;
}

export interface NewsArticle {
  headline: string;
  url: string;
  datetime: number;
  source: string;
  content?: string;
  sentiment: {
    label: string;
    score: number;
  };
}

export interface SentimentResult {
  label: string;
  score: number;
}

export interface SentimentTrends {
  mean_sentiment: number;
  sentiment_volatility: number;
  trend_direction: string;
  sentiment_distribution: {
    positive: number;
    negative: number;
    neutral: number;
  };
  time_analysis: {
    daily_pattern: { [key: string]: number };
    weekly_pattern: { [key: string]: number };
  };
}

export interface ApiResponse<T> {
  status: string;
  data: T;
}

export const api = {
  async analyzeHeadline(headline: string): Promise<SentimentResult> {
    const response = await fetch(`${API_BASE_URL}/analyze-headline`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ headline }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to analyze headline');
    }
    
    return response.json();
  },

  async getStockInfo(ticker: string): Promise<StockInfo> {
    const response = await fetch(`${API_BASE_URL}/stock-info/${ticker}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch stock info');
    }
    
    const result: ApiResponse<StockInfo> = await response.json();
    return result.data;
  },

  async getNews(ticker: string): Promise<NewsArticle[]> {
    const response = await fetch(`${API_BASE_URL}/news/${ticker}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }
    
    const result: ApiResponse<NewsArticle[]> = await response.json();
    return result.data;
  },

  async getSentimentTrends(ticker: string): Promise<SentimentTrends> {
    const response = await fetch(`${API_BASE_URL}/analysis/trends/${ticker}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch sentiment trends');
    }
    
    const result: ApiResponse<SentimentTrends> = await response.json();
    return result.data;
  }
};
