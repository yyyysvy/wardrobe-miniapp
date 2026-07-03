import React from 'react';

function daysSince(dateStr) {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function Stats({ items, outfits }) {
  const totalWashes = items.filter(i => i.inLaundry).length +
    outfits.reduce((sum) => sum, 0); // placeholder, real wash count tracked separately
  const totalWorn = outfits.reduce((sum, o) => sum + o.wearCount, 0);

  // Category breakdown
  const categoryCounts = {};
  items.forEach(i => {
    categoryCounts[i.category] = (categoryCounts[i.category] || 0) + i.wearCount;
  });
  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxCount = topCategories.length > 0 ? topCategories[0][1] : 1;

  // Unused items (never worn or worn 30+ days ago, only if has history)
  const unused = items
    .map(i => {
      const outfitWithItem = outfits.find(o => o.itemIds.includes(i.id) && o.lastWorn);
      const days = outfitWithItem ? daysSince(outfitWithItem.lastWorn) : null;
      return { ...i, daysSinceWorn: days };
    })
    .filter(i => i.daysSinceWorn === null || i.daysSinceWorn >= 14)
    .sort((a, b) => (b.daysSinceWorn ?? 9999) - (a.daysSinceWorn ?? 9999))
    .slice(0, 5);

  return (
    <div>
      <div className="topbar">
        <p className="topbar-greeting">Overview</p>
        <h1 className="topbar-title">Statistics</h1>
      </div>
      <div className="page-body">

        <div className="stat-row">
          <div className="stat-card">
            <p className="stat-num">{items.length}</p>
            <p className="stat-label">Items in wardrobe</p>
          </div>
          <div className="stat-card">
            <p className="stat-num">{outfits.length}</p>
            <p className="stat-label">Saved outfits</p>
          </div>
          <div className="stat-card">
            <p className="stat-num" style={{ color: 'var(--c4)' }}>{unused.length}</p>
            <p className="stat-label">Rarely worn</p>
          </div>
          <div className="stat-card">
            <p className="stat-num">{totalWorn}</p>
            <p className="stat-label">Outfits worn</p>
          </div>
        </div>

        {topCategories.length > 0 && (
          <>
            <p className="section-title" style={{ marginTop: 20 }}>Most worn categories</p>
            <div className="bar-list">
              {topCategories.map(([cat, count]) => (
                <div key={cat} className="bar-row">
                  <span className="bar-label">{cat}</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${(count / maxCount) * 100}%` }}></div>
                  </div>
                  <span className="bar-count">{count}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {unused.length > 0 && (
          <>
            <p className="section-title" style={{ marginTop: 20 }}>Rarely worn — consider donating</p>
            <div className="laundry-list">
              {unused.map(item => (
                <div key={item.id} className="laundry-item">
                  <div className="laundry-thumb">
                    {item.photo
                      ? <img src={item.photo} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: 18 }}>👗</span>
                    }
                  </div>
                  <div className="laundry-info">
                    <p className="laundry-name">{item.name}</p>
                    <p className="laundry-sub">
                      {item.daysSinceWorn === null ? 'Never worn in an outfit' : `Last worn ${item.daysSinceWorn} days ago`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {items.length === 0 && (
          <div className="empty-state"><p>Add items and wear outfits to see statistics</p></div>
        )}

      </div>
    </div>
  );
}

export default Stats;