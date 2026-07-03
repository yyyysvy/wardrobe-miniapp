import React, { useState, useEffect } from 'react';
import { getWeather, weatherToTags } from '../weather';

function getCurrentSeason() {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'Spring';
  if (month >= 6 && month <= 8) return 'Summer';
  if (month >= 9 && month <= 11) return 'Autumn';
  return 'Winter';
}

function Home({ items, outfits, setOutfits, setItems }) {
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [noMatch, setNoMatch] = useState(false);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  useEffect(() => {
    getWeather().then(w => {
      setWeather(w);
      setWeatherLoading(false);
    });
  }, []);

  const weatherEmoji = () => {
    if (!weather) return '';
    if (weather.condition === 'Rain' || weather.condition === 'Drizzle') return '🌧';
    if (weather.condition === 'Snow') return '❄️';
    if (weather.condition === 'Clear') return '☀️';
    if (weather.condition === 'Thunderstorm') return '⛈';
    return '☁️';
  };

  const findOutfit = (excludeId = null) => {
    setLoading(true);
    setNoMatch(false);
    setSuggestion(null);

    setTimeout(() => {
      const season = getCurrentSeason();
      const weatherTags = weatherToTags(weather);

      const candidates = outfits.filter(outfit => {
        if (excludeId && outfit.id === excludeId) return false;
        const seasonOk = outfit.seasons.length === 0 || outfit.seasons.includes(season);
        const outfitItems = items.filter(i => outfit.itemIds.includes(i.id));
        const allClean = outfitItems.every(i => !i.inLaundry);
        const weatherOk = outfit.weather.length === 0 ||
          weatherTags.length === 0 ||
          weatherTags.some(tag => outfit.weather.includes(tag));
        return seasonOk && allClean && weatherOk;
      });

      if (candidates.length === 0) {
        setLoading(false);
        setNoMatch(true);
        return;
      }

      const sorted = [...candidates].sort((a, b) => {
        if (!a.lastWorn) return -1;
        if (!b.lastWorn) return 1;
        return new Date(a.lastWorn) - new Date(b.lastWorn);
      });

      setSuggestion(sorted[0]);
      setLoading(false);
    }, 800);
  };

  const wearOutfit = () => {
    if (!suggestion) return;
    const today = new Date().toISOString();
    setOutfits(outfits.map(o =>
      o.id === suggestion.id
        ? { ...o, wearCount: o.wearCount + 1, lastWorn: today }
        : o
    ));
    if (setItems) {
      setItems(items.map(i =>
        suggestion.itemIds.includes(i.id)
          ? { ...i, wearCount: i.wearCount + 1 }
          : i
      ));
    }
    setSuggestion(null);
  };

  const outfitItems = suggestion
    ? items.filter(i => suggestion.itemIds.includes(i.id))
    : [];

  const season = getCurrentSeason();

  return (
    <div>
      <div className="topbar">
        <p className="topbar-greeting">
          {season} ·{' '}
          {weatherLoading
            ? 'Loading weather...'
            : weather
              ? `${weatherEmoji()} ${weather.temp}° · ${weather.city}`
              : 'Weather unavailable'}
        </p>
        <h1 className="topbar-title">My Wardrobe</h1>
      </div>

      <div className="page-body">

        {!suggestion && !loading && !noMatch && (
          <button className="main-btn" onClick={() => findOutfit()}>
            ✨ What to wear today?
          </button>
        )}

        {loading && (
          <div className="loading-box">
            <p>Finding your outfit...</p>
            {weather && (
              <p style={{ fontSize: 12, marginTop: 6, opacity: 0.7 }}>
                Checking outfits for {weather.temp}° {weather.condition.toLowerCase()}
              </p>
            )}
          </div>
        )}

        {noMatch && (
          <div className="empty-state">
            <p>No matching outfit found</p>
            <p style={{ fontSize: 12, marginTop: 4 }}>
              Try adding weather tags to your outfits, or check your laundry
            </p>
            <button
              className="secondary-btn"
              style={{ marginTop: 12 }}
              onClick={() => setNoMatch(false)}
            >
              Back
            </button>
          </div>
        )}

        {suggestion && (
          <div className="outfit-result">
            <div className="outfit-result-header">
              <p className="form-label" style={{ marginBottom: 0 }}>Today's suggestion</p>
              <h2 style={{ fontSize: 18, color: 'var(--c1)', margin: '4px 0 0' }}>
                {suggestion.name}
              </h2>
              {weather && (
                <p style={{ fontSize: 12, color: 'rgba(10,36,99,0.5)', marginTop: 4 }}>
                  {weatherEmoji()} {weather.temp}° · {weather.city}
                </p>
              )}
            </div>
            <div className="items-grid" style={{ margin: '14px 0' }}>
              {outfitItems.map(item => (
                <div key={item.id} className="item-card">
                  <div className="item-card-img">
                    {item.photo
                      ? <img src={item.photo} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span className="item-emoji">👗</span>
                    }
                  </div>
                  <div className="item-card-info">
                    <p className="item-name">{item.name}</p>
                    <p className="item-sub">{item.category}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="outfit-actions">
              <button
                className="secondary-btn"
                style={{ flex: 1 }}
                onClick={() => findOutfit(suggestion.id)}
              >
                🔄 Another
              </button>
              <button
                className="main-btn"
                style={{ flex: 1, marginBottom: 0 }}
                onClick={wearOutfit}
              >
                ✓ Wear this
              </button>
            </div>
          </div>
        )}

        {!suggestion && !loading && !noMatch && (
          <>
            {weather && weather.rainWarning && (
              <div className="rain-warning">
                <span className="rain-warning-icon">
                  {weather.rainWarning.isSnow ? '❄️'
                    : weather.rainWarning.isStorm ? '⛈'
                    : '🌧'}
                </span>
                <div className="rain-warning-text">
                  <p className="rain-warning-title">
                    {weather.rainWarning.isSnow ? 'Snow expected'
                      : weather.rainWarning.isStorm ? 'Storm expected'
                      : 'Rain expected'} at {weather.rainWarning.time}
                  </p>
                  <p className="rain-warning-sub">
                    {weather.rainWarning.isSnow ? 'Wear warm boots and a coat'
                      : weather.rainWarning.isStorm ? 'Stay safe — heavy storm ahead'
                      : "Don't forget your umbrella ☂️"}
                  </p>
                </div>
              </div>
            )}

            <p className="section-title" style={{ marginTop: 16 }}>Overview</p>
            <div className="stat-row">
              <div className="stat-card">
                <p className="stat-num">{items.length}</p>
                <p className="stat-label">Items</p>
              </div>
              <div className="stat-card">
                <p className="stat-num">{outfits.length}</p>
                <p className="stat-label">Outfits</p>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default Home;