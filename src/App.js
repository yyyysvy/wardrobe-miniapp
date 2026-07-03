import React, { useState, useEffect } from 'react';
import './App.css';
import Home from './pages/Home';
import Wardrobe from './pages/Wardrobe';
import Outfits from './pages/Outfits';
import Laundry from './pages/Laundry';
import Stats from './pages/Stats';

function App() {
  const [activePage, setActivePage] = useState('home');

  const [items, setItemsRaw] = useState(() => {
    try {
      const saved = localStorage.getItem('wardrobe_items');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [outfits, setOutfitsRaw] = useState(() => {
    try {
      const saved = localStorage.getItem('wardrobe_outfits');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const setItems = (newItems) => {
    const updated = typeof newItems === 'function' ? newItems(items) : newItems;
    setItemsRaw(updated);
    localStorage.setItem('wardrobe_items', JSON.stringify(updated));
  };

  const setOutfits = (newOutfits) => {
    const updated = typeof newOutfits === 'function' ? newOutfits(outfits) : newOutfits;
    setOutfitsRaw(updated);
    localStorage.setItem('wardrobe_outfits', JSON.stringify(updated));
  };

  const renderPage = () => {
    switch(activePage) {
      case 'home': return <Home items={items} outfits={outfits} setOutfits={setOutfits} setItems={setItems} />;
      case 'wardrobe': return <Wardrobe items={items} setItems={setItems} />;
      case 'outfits': return <Outfits outfits={outfits} setOutfits={setOutfits} items={items} />;
      case 'laundry': return <Laundry items={items} setItems={setItems} />;
      case 'stats': return <Stats items={items} outfits={outfits} />;
      default: return <Home items={items} outfits={outfits} setOutfits={setOutfits} setItems={setItems} />;
    }
  };

  return (
    <div className="app">
      <div className="page-content">{renderPage()}</div>
      <nav className="nav-bar">
        <button className={`nav-item ${activePage === 'home' ? 'active' : ''}`} onClick={() => setActivePage('home')}>
          <span className="nav-icon">🏠</span><span>Home</span>
        </button>
        <button className={`nav-item ${activePage === 'wardrobe' ? 'active' : ''}`} onClick={() => setActivePage('wardrobe')}>
          <span className="nav-icon">👗</span><span>Wardrobe</span>
        </button>
        <button className={`nav-item ${activePage === 'outfits' ? 'active' : ''}`} onClick={() => setActivePage('outfits')}>
          <span className="nav-icon">✨</span><span>Outfits</span>
        </button>
        <button className={`nav-item ${activePage === 'laundry' ? 'active' : ''}`} onClick={() => setActivePage('laundry')}>
          <span className="nav-icon">🔄</span><span>Laundry</span>
        </button>
        <button className={`nav-item ${activePage === 'stats' ? 'active' : ''}`} onClick={() => setActivePage('stats')}>
          <span className="nav-icon">📊</span><span>Stats</span>
        </button>
      </nav>
    </div>
  );
}

export default App;