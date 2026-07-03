import React, { useState } from 'react';

function Laundry({ items, setItems }) {
  const [tab, setTab] = useState('wash');

  const toWash = items.filter(i => !i.inLaundry && i.wearCount >= i.washAfter && i.washAfter > 0);
  const manualWash = items.filter(i => !i.inLaundry && i.manualWash);
  const needsWashing = [...toWash, ...manualWash.filter(i => !toWash.includes(i))];
  const inLaundry = items.filter(i => i.inLaundry);

  const sendToWash = (id) => {
    setItems(items.map(i =>
      i.id === id ? { ...i, inLaundry: true, manualWash: false } : i
    ));
  };

  const returnToWardrobe = (id) => {
    setItems(items.map(i =>
      i.id === id ? { ...i, inLaundry: false, wearCount: 0 } : i
    ));
  };

  const addManually = (id) => {
    setItems(items.map(i =>
      i.id === id ? { ...i, manualWash: true } : i
    ));
  };

  const wardrobeItems = items.filter(i => !i.inLaundry && !needsWashing.includes(i));

  return (
    <div>
      <div className="topbar">
        <p className="topbar-greeting">Keep it clean</p>
        <h1 className="topbar-title">Laundry</h1>
      </div>
      <div className="page-body">
        <div className="tab-row">
          <button className={`tab ${tab === 'wash' ? 'active' : ''}`} onClick={() => setTab('wash')}>
            To wash {needsWashing.length > 0 && `(${needsWashing.length})`}
          </button>
          <button className={`tab ${tab === 'return' ? 'active' : ''}`} onClick={() => setTab('return')}>
            Back to wardrobe {inLaundry.length > 0 && `(${inLaundry.length})`}
          </button>
        </div>

        {tab === 'wash' ? (
          <>
            {needsWashing.length === 0
              ? <div className="empty-state"><p>Nothing needs washing yet</p></div>
              : <div className="laundry-list">
                  {needsWashing.map(item => (
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
                          {item.manualWash && !(item.wearCount >= item.washAfter)
                            ? 'Added manually'
                            : `Worn ${item.wearCount}× · limit reached`
                          }
                        </p>
                      </div>
                      <button className="laundry-btn wash" onClick={() => sendToWash(item.id)}>Wash</button>
                    </div>
                  ))}
                </div>
            }

            <p className="section-title" style={{ marginTop: 20 }}>Add manually</p>
            {wardrobeItems.length === 0
              ? <div className="empty-state" style={{ padding: '12px 0' }}><p>No other items</p></div>
              : <div className="laundry-list">
                  {wardrobeItems.map(item => (
                    <div key={item.id} className="laundry-item">
                      <div className="laundry-thumb">
                        {item.photo
                          ? <img src={item.photo} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <span style={{ fontSize: 18 }}>👗</span>
                        }
                      </div>
                      <div className="laundry-info">
                        <p className="laundry-name">{item.name}</p>
                        <p className="laundry-sub">Worn {item.wearCount}×</p>
                      </div>
                      <button className="laundry-btn add" onClick={() => addManually(item.id)}>+ Basket</button>
                    </div>
                  ))}
                </div>
            }
          </>
        ) : (
          inLaundry.length === 0
            ? <div className="empty-state"><p>Nothing to return yet</p></div>
            : <div className="laundry-list">
                {inLaundry.map(item => (
                  <div key={item.id} className="laundry-item">
                    <div className="laundry-thumb">
                      {item.photo
                        ? <img src={item.photo} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span style={{ fontSize: 18 }}>👗</span>
                      }
                    </div>
                    <div className="laundry-info">
                      <p className="laundry-name">{item.name}</p>
                      <p className="laundry-sub">Washed · ready to return</p>
                    </div>
                    <button className="laundry-btn return" onClick={() => returnToWardrobe(item.id)}>Return</button>
                  </div>
                ))}
              </div>
        )}
      </div>
    </div>
  );
}

export default Laundry;