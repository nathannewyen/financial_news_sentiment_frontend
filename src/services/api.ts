const API_BASE_URL = 'http://localhost:8000';

export interface StockInfo {
  price: number;
  priceChange: number;
}

export interface NewsArticle {
  headline: string;
  url: string;
  datetime: number;
  sentiment: {
    label: string;
    score: number;
  };
}

export interface SentimentResult {
  label: string;
  score: number;
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
    const response = await fetch(`${API_BASE_URL}/stock-info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ticker }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch stock info');
    }
    
    return response.json();
  },

  async getNews(ticker: string): Promise<NewsArticle[]> {
    const response = await fetch(`${API_BASE_URL}/news`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ticker }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }
    
    return response.json();
  }
};
