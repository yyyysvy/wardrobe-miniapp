import React, { useState } from 'react';

const CATEGORIES = [
  'Ankle boots', 'Backpack', 'Belt', 'Blazer', 'Blouse', 'Boots',
  'Cardigan', 'Clutch', 'Coat', 'Crop top', 'Denim jacket', 'Dress',
  'Flats', 'Gloves', 'Hair accessories', 'Handbag', 'Hat', 'Heels',
  'Hoodie', 'Jacket', 'Jeans', 'Jewellery', 'Jumpsuit', 'Leggings',
  'Loafers', 'Maxi dress', 'Midi dress', 'Midi skirt', 'Mini dress',
  'Mini skirt', 'Puffer jacket', 'Raincoat', 'Sandals', 'Scarf',
  'Shirt', 'Shorts', 'Skirt', 'Slippers', 'Sneakers', 'Sports jacket',
  'Sports leggings', 'Sports shorts', 'Sports top', 'Shopper',
  'Sunglasses', 'Sweater', 'T-shirt', 'Tote bag', 'Trainers',
  'Trench coat', 'Trousers', 'Turtleneck', 'Watch'
];
const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter'];
const WASH_AFTER = [0, 1, 2, 3, 5];

function Wardrobe({ items, setItems }) {
  const [showForm, setShowForm] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const [form, setForm] = useState({
    name: '', category: 'Tops', seasons: ['Summer'], washAfter: 2, photo: null
  });

  const toggleSeason = (s) => {
    setForm(f => ({
      ...f,
      seasons: f.seasons.includes(s)
        ? f.seasons.filter(x => x !== s)
        : [...f.seasons, s]
    }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm(f => ({ ...f, photo: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const addItem = () => {
    if (!form.name.trim()) return;
    const newItem = {
      id: Date.now(),
      ...form,
      wearCount: 0,
      inLaundry: false,
      lastWorn: null
    };
    setItems([newItem, ...items]);
    setForm({ name: '', category: 'Tops', seasons: ['Summer'], washAfter: 2, photo: null });
    setShowForm(false);
  };

  const filtered = activeCategory === 'All'
    ? items
    : items.filter(i => i.category === activeCategory);

  // Detail view
  if (selectedItem) {
    return (
      <div>
        <div className="topbar" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="back-btn" onClick={() => setSelectedItem(null)}>←</button>
          <div>
            <p className="topbar-greeting">{selectedItem.category}</p>
            <h1 className="topbar-title">{selectedItem.name}</h1>
          </div>
        </div>
        <div className="page-body">
          <div className="item-detail-img">
            {selectedItem.photo
              ? <img src={selectedItem.photo} alt={selectedItem.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} />
              : <span style={{ fontSize: 64 }}>👗</span>
            }
          </div>
          <div className="detail-info-row">
            <div className="stat-card">
              <p className="stat-num">{selectedItem.wearCount}</p>
              <p className="stat-label">Times worn</p>
            </div>
            <div className="stat-card">
              <p className="stat-num">{selectedItem.washAfter}</p>
              <p className="stat-label">Wash after</p>
            </div>
          </div>
          <div className="form-group">
            <p className="form-label">Seasons</p>
            <div className="pill-row">
              {selectedItem.seasons.map(s => (
                <span key={s} className="pill sel">{s}</span>
              ))}
            </div>
          </div>
          <p className="form-label" style={{ marginBottom: 8 }}>Status: {selectedItem.inLaundry ? '🔄 In laundry' : '✅ In wardrobe'}</p>
          <button className="secondary-btn" style={{ marginTop: 8 }} onClick={() => {
            setItems(items.filter(i => i.id !== selectedItem.id));
            setSelectedItem(null);
          }}>Delete item</button>
        </div>
      </div>
    );
  }

  // Add form
  if (showForm) {
    return (
      <div>
        <div className="topbar">
          <p className="topbar-greeting">New item</p>
          <h1 className="topbar-title">Add to wardrobe</h1>
        </div>
        <div className="page-body">

          <div className="form-group">
            <label className="form-label">Photo</label>
            <label className="photo-upload">
              {form.photo
                ? <img src={form.photo} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} />
                : <div className="photo-placeholder">
                    <span style={{ fontSize: 32 }}>📷</span>
                    <p>Tap to add photo</p>
                  </div>
              }
              <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{ display: 'none' }} />
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              className="form-input"
              placeholder="e.g. White shirt"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <div className="pill-row">
              {CATEGORIES.map(cat => (
                <button key={cat} className={`pill ${form.category === cat ? 'sel' : ''}`}
                  onClick={() => setForm({ ...form, category: cat })}>{cat}</button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Season (select multiple)</label>
            <div className="pill-row">
              {SEASONS.map(s => (
                <button key={s} className={`pill ${form.seasons.includes(s) ? 'sel' : ''}`}
                  onClick={() => toggleSeason(s)}>{s}</button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Wash after (wears)</label>
            <div className="pill-row">
              {WASH_AFTER.map(n => (
                <button key={n} className={`pill ${form.washAfter === n ? 'sel' : ''}`}
                  onClick={() => setForm({ ...form, washAfter: n })}>{n}</button>
              ))}
              <input
                type="number"
                min="0"
                placeholder="Custom"
                className="pill-input"
                value={!WASH_AFTER.includes(form.washAfter) ? form.washAfter : ''}
                onChange={e => setForm({ ...form, washAfter: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <button className="main-btn" onClick={addItem}>Save item</button>
          <button className="secondary-btn" onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      </div>
    );
  }

  // Main list
  return (
    <div>
      <div className="topbar">
        <p className="topbar-greeting">Your clothes</p>
        <h1 className="topbar-title">Wardrobe · {items.length}</h1>
      </div>
      <div className="page-body">
        <div className="cat-scroll">
          {['All', ...CATEGORIES].map(cat => (
            <button key={cat}
              className={`cat-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}>{cat}</button>
          ))}
        </div>
        {filtered.length === 0
          ? <div className="empty-state"><p>No items here yet</p></div>
          : <div className="items-grid">
              {filtered.map(item => (
                <div key={item.id} className="item-card" onClick={() => setSelectedItem(item)}>
                  <div className="item-card-img">
                    {item.photo
                      ? <img src={item.photo} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span className="item-emoji">👗</span>
                    }
                  </div>
                  <div className="item-card-info">
                    <p className="item-name">{item.name}</p>
                    <p className="item-sub">{item.category} · {item.seasons?.join(', ')}</p>
                  </div>
                </div>
              ))}
            </div>
        }
        <button className="main-btn" onClick={() => setShowForm(true)}>+ Add item</button>
      </div>
    </div>
  );
}

export default Wardrobe;