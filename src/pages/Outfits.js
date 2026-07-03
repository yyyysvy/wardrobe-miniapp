import React, { useState } from 'react';

const OCCASION_TAGS = [
  'Beach', 'Casual', 'City break', 'Cycling', 'Dinner',
'Evening out', 'Flight', 'Formal', 'Friends', 'Gym',
'Hiking', 'Loungewear', 'Party', 'Smart casual', 'Sport',
'Travel', 'Walk', 'Weekend', 'Work', 'Work from home',
'Yoga'
];

const WEATHER_TAGS = ['Sunny', 'Cloudy', 'Hot', 'Warm', 'Cool', 'Cold', 'Rain', 'Snow'];
const SEASON_TAGS = ['Spring', 'Summer', 'Autumn', 'Winter'];

function Outfits({ outfits, setOutfits, items }) {
  const [showBuilder, setShowBuilder] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const [form, setForm] = useState({
    name: '',
    itemIds: [],
    seasons: [],
    weather: [],
    occasions: []
  });

  const toggleTag = (field, tag) => {
    setForm(f => ({
      ...f,
      [field]: f[field].includes(tag)
        ? f[field].filter(x => x !== tag)
        : [...f[field], tag]
    }));
  };

  const toggleItem = (id) => {
    setForm(f => ({
      ...f,
      itemIds: f.itemIds.includes(id)
        ? f.itemIds.filter(x => x !== id)
        : [...f.itemIds, id]
    }));
  };

  const saveOutfit = () => {
    if (!form.name.trim() || form.itemIds.length < 2) return;
    const newOutfit = {
      id: Date.now(),
      ...form,
      wearCount: 0,
      lastWorn: null
    };
    setOutfits([newOutfit, ...outfits]);
    setForm({ name: '', itemIds: [], seasons: [], weather: [], occasions: [] });
    setShowBuilder(false);
  };

  const deleteOutfit = (id) => {
    setOutfits(outfits.filter(o => o.id !== id));
    setSelectedOutfit(null);
  };

  // Detail view
  if (selectedOutfit) {
    const outfitItems = items.filter(i => selectedOutfit.itemIds.includes(i.id));
    return (
      <div>
        <div className="topbar" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="back-btn" onClick={() => setSelectedOutfit(null)}>←</button>
          <div>
            <p className="topbar-greeting">Outfit</p>
            <h1 className="topbar-title">{selectedOutfit.name}</h1>
          </div>
        </div>
        <div className="page-body">
          <div className="items-grid" style={{ marginBottom: 16 }}>
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

          {selectedOutfit.seasons.length > 0 && (
            <div className="form-group">
              <p className="form-label">Season</p>
              <div className="pill-row">
                {selectedOutfit.seasons.map(t => <span key={t} className="pill sel">{t}</span>)}
              </div>
            </div>
          )}
          {selectedOutfit.weather.length > 0 && (
            <div className="form-group">
              <p className="form-label">Weather</p>
              <div className="pill-row">
                {selectedOutfit.weather.map(t => <span key={t} className="pill sel">{t}</span>)}
              </div>
            </div>
          )}
          {selectedOutfit.occasions.length > 0 && (
            <div className="form-group">
              <p className="form-label">Occasion</p>
              <div className="pill-row">
                {selectedOutfit.occasions.map(t => <span key={t} className="pill sel">{t}</span>)}
              </div>
            </div>
          )}

          <div className="detail-info-row" style={{ marginTop: 8 }}>
            <div className="stat-card">
              <p className="stat-num">{selectedOutfit.wearCount}</p>
              <p className="stat-label">Times worn</p>
            </div>
            <div className="stat-card">
              <p className="stat-num">{outfitItems.length}</p>
              <p className="stat-label">Items</p>
            </div>
          </div>

          <button className="secondary-btn" style={{ marginTop: 12 }} onClick={() => deleteOutfit(selectedOutfit.id)}>
            Delete outfit
          </button>
        </div>
      </div>
    );
  }

  // Builder
  if (showBuilder) {
    return (
      <div>
        <div className="topbar" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="back-btn" onClick={() => setShowBuilder(false)}>←</button>
          <div>
            <p className="topbar-greeting">New outfit</p>
            <h1 className="topbar-title">Builder</h1>
          </div>
        </div>
        <div className="page-body">

          <div className="form-group">
            <label className="form-label">Outfit name</label>
            <input
              className="form-input"
              placeholder="e.g. Office classic"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Select items from wardrobe
              {form.itemIds.length > 0 && <span style={{ color: 'var(--c4)', marginLeft: 6 }}>· {form.itemIds.length} selected</span>}
            </label>
            {items.length === 0
              ? <div className="empty-state" style={{ padding: '20px 0' }}>
                  <p>Add items to your wardrobe first</p>
                </div>
              : <>
                  <div className="pill-row" style={{ marginBottom: 10 }}>
                    {[...new Set(items.map(i => i.category))].sort().map(cat => {
                      const countSelected = items.filter(i => i.category === cat && form.itemIds.includes(i.id)).length;
                      return (
                        <button
                          key={cat}
                          className={`pill ${openCategory === cat ? 'sel' : ''}`}
                          onClick={() => setOpenCategory(openCategory === cat ? null : cat)}
                        >
                          {cat} {countSelected > 0 && `(${countSelected})`}
                        </button>
                      );
                    })}
                  </div>

                  {openCategory &&
                    <div className="items-grid" style={{ marginBottom: 10 }}>
                      {items.filter(i => i.category === openCategory).map(item => (
                        <div
                          key={item.id}
                          className="item-card"
                          style={{ border: form.itemIds.includes(item.id) ? '2px solid var(--c4)' : '' }}
                          onClick={() => toggleItem(item.id)}
                        >
                          <div className="item-card-img">
                            {item.photo
                              ? <img src={item.photo} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              : <span className="item-emoji">👗</span>
                            }
                            {form.itemIds.includes(item.id) &&
                              <div style={{ position: 'absolute', top: 6, right: 6, background: 'var(--c4)', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12 }}>✓</div>
                            }
                          </div>
                          <div className="item-card-info">
                            <p className="item-name">{item.name}</p>
                            <p className="item-sub">{item.category}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  }
                </>
            }
          </div>

          <div className="form-group">
            <label className="form-label">Season</label>
            <div className="pill-row">
              {SEASON_TAGS.map(t => (
                <button key={t} className={`pill ${form.seasons.includes(t) ? 'sel' : ''}`}
                  onClick={() => toggleTag('seasons', t)}>{t}</button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Weather</label>
            <div className="pill-row">
              {WEATHER_TAGS.map(t => (
                <button key={t} className={`pill ${form.weather.includes(t) ? 'sel' : ''}`}
                  onClick={() => toggleTag('weather', t)}>{t}</button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Occasion</label>
            <div className="pill-row">
              {OCCASION_TAGS.map(t => (
                <button key={t} className={`pill ${form.occasions.includes(t) ? 'sel' : ''}`}
                  onClick={() => toggleTag('occasions', t)}>{t}</button>
              ))}
            </div>
          </div>

          <button className="main-btn" onClick={saveOutfit}
            style={{ opacity: form.name && form.itemIds.length >= 2 ? 1 : 0.5 }}>
            Save outfit
          </button>
          <button className="secondary-btn" onClick={() => setShowBuilder(false)}>Cancel</button>
        </div>
      </div>
    );
  }

  // Main list
  return (
    <div>
      <div className="topbar">
        <p className="topbar-greeting">Your combinations</p>
        <h1 className="topbar-title">Outfits · {outfits.length}</h1>
      </div>
      <div className="page-body">
        <button className="main-btn" onClick={() => setShowBuilder(true)}>+ Create outfit</button>

        {outfits.length === 0
          ? <div className="empty-state">
              <p>No outfits yet</p>
              <p>Create your first combination above</p>
            </div>
          : <div className="outfits-grid">
              {outfits.map(outfit => {
                const outfitItems = items.filter(i => outfit.itemIds.includes(i.id));
                return (
                  <div key={outfit.id} className="outfit-card" onClick={() => setSelectedOutfit(outfit)}>
                    <div className="outfit-card-img">
                      {outfitItems.slice(0, 4).map((item, idx) => (
                        <div key={idx} className="outfit-thumb">
                          {item.photo
                            ? <img src={item.photo} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <span style={{ fontSize: 20 }}>👗</span>
                          }
                        </div>
                      ))}
                    </div>
                    <div className="outfit-card-info">
                      <p className="outfit-name">{outfit.name}</p>
                      <p className="outfit-sub">{outfit.itemIds.length} items · worn {outfit.wearCount}×</p>
                      {outfit.occasions.length > 0 &&
                        <div className="pill-row" style={{ marginTop: 4 }}>
                          {outfit.occasions.slice(0, 2).map(t => (
                            <span key={t} className="outfit-tag">{t}</span>
                          ))}
                        </div>
                      }
                    </div>
                  </div>
                );
              })}
            </div>
        }
      </div>
    </div>
  );
}

export default Outfits;