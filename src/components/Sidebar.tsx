import React from 'react';
import '../styles/Sidebar.css';
import { User } from '../services/api';

export interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
}

interface SidebarProps {
  watchlist: WatchlistItem[];
  selectedSymbol?: string;
  onSelect?: (symbol: string) => void;
  onLogin?: () => void;
  onRegister?: () => void;
  onLogout?: () => void;
  user: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({ watchlist, selectedSymbol, onSelect, onLogin, onRegister, onLogout, user }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-title">Watchlist 1 <span className="sidebar-count">{watchlist.length}/50</span></div>
      <ul className="watchlist">
        {watchlist.map((item) => (
          <li
            key={item.symbol}
            className={`watchlist-item${selectedSymbol === item.symbol ? ' active' : ''}`}
            onClick={() => onSelect && onSelect(item.symbol)}
          >
            <span className="icon">{item.symbol[0]}</span> {item.symbol}
            <span className={`price ${item.change >= 0 ? 'up' : 'down'}`}>{item.price.toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <nav className="sidebar-nav">
        <ul>
          <li>🏠 Dashboard</li>
          <li>⭐ Watchlist</li>
          <li>💼 Portfolio</li>
          <li>🔍 Discover</li>
          <li>⚙️ Settings</li>
        </ul>
      </nav>
      <div className="sidebar-auth-divider" />
      <div className="sidebar-auth-links">
        {user ? (
          <button className="sidebar-auth-btn" onClick={onLogout}>Logout</button>
        ) : (
          <>
            <button className="sidebar-auth-btn" onClick={onLogin}>Login</button>
            <button className="sidebar-auth-btn" onClick={onRegister}>Register</button>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar; 