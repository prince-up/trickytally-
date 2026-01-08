import { useState, useEffect } from 'react';
// Force rebuild - all 4 columns should be visible
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config';
import Navbar from '../components/Navbar';
import WinnerModal from '../components/WinnerModal';

interface PlayerScore {
  playerName: string;
  call: number;
  tricksWon: number;
}

interface Round {
  roundNumber: number;
  trump: string;
  playerScores: PlayerScore[];
}

const CreateSession = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Load saved data from localStorage
  const loadSavedData = () => {
    try {
      const saved = localStorage.getItem('callbreak_draft_session');
      if (saved) {
        const data = JSON.parse(saved);
        return data;
      }
    } catch (error) {
      console.error('Error loading saved session:', error);
    }
    return null;
  };

  const savedData = loadSavedData();

  const [formData, setFormData] = useState(savedData?.formData || {
    sessionDate: new Date().toISOString().split('T')[0],
    location: '',
    notes: '',
  });

  const [playerNames, setPlayerNames] = useState<string[]>(savedData?.playerNames || ['', '', '', '']);
  const [rounds, setRounds] = useState<Round[]>(savedData?.rounds || []);
  const [showPreview, setShowPreview] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [isBiddingMode, setIsBiddingMode] = useState(savedData?.isBiddingMode || false);
  const [isBiddingPaid, setIsBiddingPaid] = useState(savedData?.isBiddingPaid || false);
  const [bidTier, setBidTier] = useState(savedData?.bidTier || null);



  // Auto-save to localStorage whenever data changes
  useEffect(() => {
    const dataToSave = {
      formData,
      playerNames,
      rounds,
      isBiddingMode,
      isBiddingPaid,
      bidTier,
      lastSaved: new Date().toISOString(),
    };
    localStorage.setItem('callbreak_draft_session', JSON.stringify(dataToSave));
  }, [formData, playerNames, rounds, isBiddingMode, isBiddingPaid, bidTier]);


  const calculatePoints = (call: number, tricksWon: number): number => {
    if (tricksWon >= call) {
      // Met or exceeded call: base points + 0.1 per extra trick
      const extraTricks = tricksWon - call;
      return call + (extraTricks * 0.1);
    } else {
      // Failed call: negative points
      return -call;
    }
  };

  const calculateTotalPoints = () => {
    const validPlayers = playerNames.filter(n => n.trim() !== '');
    const totals: { [key: string]: number } = {};

    validPlayers.forEach(name => {
      totals[name] = 0;
    });

    rounds.forEach(round => {
      round.playerScores.forEach(ps => {
        const points = calculatePoints(ps.call, ps.tricksWon);
        totals[ps.playerName] = (totals[ps.playerName] || 0) + points;
      });
    });

    return totals;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlayerNameChange = (index: number, value: string) => {
    const newNames = [...playerNames];
    newNames[index] = value;
    setPlayerNames(newNames);
  };

  const addRound = () => {
    const newRound: Round = {
      roundNumber: rounds.length + 1,
      trump: 'Spades',
      playerScores: playerNames.filter(n => n.trim()).map(name => ({
        playerName: name,
        call: 0,
        tricksWon: 0,
      })),
    };
    setRounds([...rounds, newRound]);
  };

  const updateRound = (roundIndex: number, field: string, value: any) => {
    const newRounds = [...rounds];
    if (field === 'trump') {
      newRounds[roundIndex].trump = value;
    }
    setRounds(newRounds);
  };

  const updatePlayerScore = (
    roundIndex: number,
    playerIndex: number,
    field: 'call' | 'tricksWon',
    value: number
  ) => {
    const newRounds = [...rounds];
    newRounds[roundIndex].playerScores[playerIndex][field] = value;
    setRounds(newRounds);
  };

  const removeRound = (index: number) => {
    setRounds(rounds.filter((_, i) => i !== index));
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This will erase all players, rounds, and notes.')) {
      setFormData({
        sessionDate: new Date().toISOString().split('T')[0],
        location: '',
        notes: '',
      });
      setPlayerNames(['', '', '', '']);
      setRounds([]);
      setShowPreview(false);
      setIsBiddingMode(false);
      setIsBiddingPaid(false);
      setBidTier(null);
      localStorage.removeItem('callbreak_draft_session');

      alert('All data cleared! You can start fresh.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validPlayers = playerNames.filter(n => n.trim() !== '');
    if (validPlayers.length < 2) {
      alert('Please add at least 2 players');
      return;
    }

    if (!isBiddingMode && rounds.length === 0) {
      alert('Please add at least one round');
      return;
    }

    if (isBiddingMode && !isBiddingPaid) {
      if (validPlayers.length !== 4) {
        alert('Bidding mode requires exactly 4 players.');
        return;
      }
      navigate('/payment');
      return;
    }

    setLoading(true);
    try {
      const sessionData = {
        ...formData,
        players: validPlayers.map(name => ({ name, totalPoints: 0 })),
        rounds: rounds,
        isBiddingGame: isBiddingMode,
        bidTier: bidTier?.id,
        bidAmount: bidTier?.amount,
        totalPool: isBiddingMode ? (bidTier?.amount * 4) : 0,
        paymentStatus: isBiddingPaid ? 'Paid' : 'Unpaid'
      };

      const response = await fetch(`${API_URL}/api/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sessionData),
      });

      const data = await response.json();
      if (data.success) {
        localStorage.removeItem('callbreak_draft_session');
        alert('Session created successfully!');
        navigate('/dashboard');
      } else {
        alert(data.message || 'Error creating session');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.headerSection}>
          <h1 style={styles.title}>
            <span style={{ color: '#dc143c' }}>♥️</span> Create New Call Break Session <span style={{ color: '#dc143c' }}>♦️</span>
          </h1>
          <button
            type="button"
            onClick={clearAllData}
            style={styles.clearBtn}
            title="Clear all data and start fresh"
          >
            🔄 Clear All
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Session Date</label>
              <input
                type="date"
                name="sessionDate"
                value={formData.sessionDate}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="e.g., Home, Club"
              />
            </div>
          </div>

          <div style={styles.biddingSection}>
            <div style={styles.biddingHeader}>
              <h2 style={styles.subtitle}>Bidding System</h2>
              <div
                style={{
                  ...styles.switch,
                  opacity: isBiddingPaid ? 0.6 : 1,
                  cursor: isBiddingPaid ? 'not-allowed' : 'pointer'
                }}
                onClick={() => !isBiddingPaid && setIsBiddingMode(!isBiddingMode)}
              >

                <div style={{
                  ...styles.slider,
                  ...(isBiddingMode ? styles.sliderActive : {})
                }}>
                  <div style={{
                    ...styles.sliderCircle,
                    ...(isBiddingMode ? styles.sliderCircleActive : {})
                  }}></div>
                </div>
              </div>
            </div>

            {isBiddingMode && (
              <p style={styles.biddingInfo}>
                {playerNames.filter(n => n.trim()).length !== 4
                  ? "⚠ Bidding is only available for 4 players."
                  : "✓ 4 players detected. You can place bids in the next step."}
              </p>
            )}

            {isBiddingMode && isBiddingPaid && (
              <div style={styles.paymentBadge}>
                💰 Payment Confirmed: {bidTier?.name} (₹{bidTier?.amount})
              </div>
            )}
          </div>


          <div style={styles.section}>
            <h2 style={styles.subtitle}>Players (4 players recommended)</h2>
            <div style={{
              ...styles.playersGrid,
              opacity: isBiddingPaid ? 0.7 : 1,
              pointerEvents: isBiddingPaid ? 'none' : 'auto'
            }}>
              {playerNames.map((name, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#dc143c', // Red icon
                    fontSize: '1.2rem',
                    pointerEvents: 'none',
                    zIndex: 2,
                    opacity: 0.9
                  }}>👤</span>

                  <input
                    style={{
                      ...styles.playerInput,
                      ...(name ? { border: '2px solid #ffd700', backgroundColor: 'rgba(255, 215, 0, 0.05)' } : {})
                    }}
                    value={name}
                    onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                    placeholder={`Enter Player ${index + 1}`}
                    disabled={isBiddingPaid}
                  />
                </div>
              ))}

            </div>
          </div>

          {(!isBiddingMode || isBiddingPaid) && (
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.subtitle}>Rounds</h2>
                <button type="button" onClick={addRound} style={styles.addRoundBtn}>
                  + Add Round
                </button>
              </div>

              {rounds.map((round, rIndex) => (
                <div key={rIndex} style={styles.roundCard}>
                  <div style={styles.roundHeader}>
                    <h3 style={styles.roundTitle}>Round {round.roundNumber}</h3>
                    <div style={styles.roundControls}>
                      <select
                        value={round.trump}
                        onChange={(e) => updateRound(rIndex, 'trump', e.target.value)}
                        style={styles.trumpSelect}
                      >
                        <option value="Spades">♠️ Spades</option>
                        <option value="Hearts">♥️ Hearts</option>
                        <option value="Diamonds">♦️ Diamonds</option>
                        <option value="Clubs">♣️ Clubs</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => removeRound(rIndex)}
                        style={styles.removeBtn}
                      >
                        ✕
                      </button>
                    </div>
                  </div>


                  <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    <table style={styles.scoreTable}>
                      <thead>
                        <tr>
                          <th style={styles.tableTh}>Player</th>
                          <th style={styles.tableTh}>
                            <div style={styles.headerWithIcon}>
                              🎯 Call
                            </div>
                          </th>
                          <th style={styles.tableTh}>
                            <div style={styles.headerWithIcon}>
                              ✓ Won
                            </div>
                          </th>
                          <th style={styles.tableTh}>
                            <div style={styles.headerWithIcon}>
                              💰 Pts
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {round.playerScores.map((ps, pIndex) => {
                          const points = calculatePoints(ps.call, ps.tricksWon);
                          return (
                            <tr key={pIndex} style={styles.tableRow}>
                              <td style={styles.tableTdPlayer}>
                                <input
                                  type="text"
                                  value={ps.playerName}
                                  onChange={(e) => {
                                    const newRounds = [...rounds];
                                    newRounds[rIndex].playerScores[pIndex].playerName = e.target.value;
                                    setRounds(newRounds);
                                  }}
                                  style={styles.playerNameInput}
                                  placeholder={`Player ${pIndex + 1}`}
                                />
                              </td>
                              <td style={styles.tableTd}>
                                <input
                                  type="number"
                                  value={ps.call === 0 ? '' : ps.call}
                                  onChange={(e) =>
                                    updatePlayerScore(rIndex, pIndex, 'call', parseInt(e.target.value) || 0)
                                  }
                                  style={styles.scoreInputModern}
                                  min="0"
                                  max="13"
                                />
                              </td>
                              <td style={styles.tableTd}>
                                <input
                                  type="number"
                                  value={ps.tricksWon === 0 ? '' : ps.tricksWon}
                                  onChange={(e) =>
                                    updatePlayerScore(rIndex, pIndex, 'tricksWon', parseInt(e.target.value) || 0)
                                  }
                                  style={styles.scoreInputModern}
                                  min="0"
                                  max="13"
                                />
                              </td>
                              <td style={styles.tableTd}>
                                <div style={{
                                  ...styles.pointsBadge,
                                  backgroundColor: points >= 0 ? 'rgba(0,255,0,0.15)' : 'rgba(255,0,0,0.15)',
                                  color: points >= 0 ? '#00ff00' : '#ff4444',
                                  border: points >= 0 ? '2px solid #00ff00' : '2px solid #ff4444',
                                  fontWeight: 'bold',
                                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                                }}>
                                  {points >= 0 ? '+' : ''}{points.toFixed(1)}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}


          <div style={styles.formGroup}>
            <label style={styles.label}>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              style={styles.textarea}
              placeholder="Any additional notes..."
              rows={3}
            />
          </div>

          {!isBiddingMode && rounds.length > 0 && (
            <div style={styles.previewSection}>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                style={styles.previewBtn}
              >
                {showPreview ? '▼ Hide Preview' : '▶ Show Results Preview'}
              </button>

              {showPreview && (
                <div style={styles.previewCard}>
                  <h3 style={styles.previewTitle}>Current Standings</h3>
                  <table style={styles.previewTable}>
                    <thead>
                      <tr>
                        <th style={styles.tableTh}>Player</th>
                        <th style={styles.tableTh}>Total Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(calculateTotalPoints())
                        .sort((a, b) => b[1] - a[1])
                        .map(([name, points]) => (
                          <tr key={name}>
                            <td style={styles.tableTd}>{name}</td>
                            <td style={{
                              ...styles.tableTd,
                              fontWeight: 'bold',
                              fontSize: '1.1rem',
                              color: points >= 0 ? '#00ff00' : '#ff4444',
                              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                            }}>
                              {points >= 0 ? '+' : ''}{points.toFixed(1)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {!isBiddingMode && rounds.length >= 4 && (
            <button
              type="button"
              onClick={() => setShowWinnerModal(true)}
              style={styles.declareWinnerBtn}
            >
              🏆 Declare Winner 🏆
            </button>
          )}

          {isBiddingMode && isBiddingPaid && rounds.length > 0 && (
            <button
              type="button"
              onClick={() => setShowWinnerModal(true)}
              style={styles.declareWinnerBtn}
            >
              🏆 Declare Winner 🏆
            </button>
          )}



          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? 'Processing...' : (
              (isBiddingMode && !isBiddingPaid)
                ? 'Proceed to Payment →'
                : '✓ Save Session & Finish'
            )}
          </button>


        </form>

        {showWinnerModal && (() => {
          const totals = calculateTotalPoints();
          const playersArray = playerNames.filter(n => n.trim()).map(name => ({
            name,
            totalPoints: totals[name] || 0
          }));
          const winner = playersArray.reduce((max, p) =>
            p.totalPoints > max.totalPoints ? p : max, playersArray[0]
          );

          return (
            <WinnerModal
              winnerName={winner.name}
              winnerScore={winner.totalPoints}
              allPlayers={playersArray}
              onClose={() => setShowWinnerModal(false)}
              isBiddingGame={isBiddingMode}
              totalPool={isBiddingMode ? (bidTier?.amount * 4) : 0}
              sessionId="New"
            />
          );
        })()}
      </div>
    </>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '1rem',
    background: 'linear-gradient(135deg, #0f5132 0%, #1a4d2e 40%, #451010 100%)',
    minHeight: '100vh',
    backgroundImage: `
      radial-gradient(circle at 20% 30%, rgba(255,255,255,0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(220,20,60,0.05) 0%, transparent 50%),
      repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px)
    `,

  },
  headerSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 'clamp(1.5rem, 5vw, 2.8rem)',
    fontWeight: 'bold',
    margin: 0,
    color: '#ffd700',
    textShadow: '3px 3px 6px rgba(0,0,0,0.5), 0 0 20px rgba(255,215,0,0.3)',
    letterSpacing: '1px',
  },
  form: {
    backgroundColor: 'rgba(30, 81, 40, 0.95)',
    padding: '2rem',
    borderRadius: '24px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 3px rgba(255,255,255,0.1)',
    border: '3px solid #ffd700',
    borderRight: '5px solid #dc143c', // Red accent border
    borderBottom: '5px solid #dc143c',
  },

  formGroup: {
    marginBottom: '1.5rem',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#ffd700',
    fontWeight: '700',
    fontSize: '1rem',
    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
  },
  input: {
    width: '100%',
    padding: '0.875rem',
    border: '2px solid #ffd700',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    outline: 'none',
    backgroundColor: '#ffffff',
    color: '#000000',
    fontWeight: '500',
  },
  textarea: {
    width: '100%',
    padding: '0.875rem',
    border: '2px solid #ffd700',
    borderRadius: '8px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical',
    transition: 'all 0.3s ease',
    outline: 'none',
    backgroundColor: '#ffffff',
    color: '#000000',
    fontWeight: '500',
  },
  playersSection: {
    marginTop: '1.5rem',
    marginBottom: '1.5rem',
    padding: '1.5rem',
    background: 'linear-gradient(135deg, #8b0000 0%, #dc143c 100%)',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    border: '2px solid #ffd700',
  },
  playerNamesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.25rem',
    marginBottom: '1.5rem',
  },
  playersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.25rem',
    marginBottom: '1.5rem',
  },

  roundsSection: {
    marginTop: '2rem',
    marginBottom: '2rem',
  },
  roundCard: {
    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    padding: '1.5rem',
    borderRadius: '16px',
    marginBottom: '1.5rem',
    border: '3px solid #ffffff',
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
    transition: 'transform 0.3s ease',
  },
  roundHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid rgba(255,255,255,0.5)',
  },
  roundTitle: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    color: '#1f2937',
    textShadow: '1px 1px 2px rgba(255,255,255,0.8)',
  },
  roundControls: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
  },
  trumpSelect: {
    padding: '0.75rem 1rem',
    border: '2px solid #6366f1',
    borderRadius: '8px',
    fontSize: '1rem',
    backgroundColor: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  scoreTable: {
    width: '100%',
    minWidth: '450px',
    borderCollapse: 'separate',
    borderSpacing: 0,
    backgroundColor: '#2d6a4f',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
    border: '3px solid #ffd700',
  },
  tableTh: {
    padding: 'clamp(0.5rem, 1.5vw, 0.6rem) clamp(0.2rem, 0.5vw, 0.25rem)',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #8b0000 0%, #dc143c 100%)',
    fontWeight: '700',
    color: '#ffd700',
    fontSize: 'clamp(0.7rem, 2vw, 0.9rem)',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
    borderBottom: '3px solid #ffd700',
    whiteSpace: 'nowrap',
  },
  headerWithIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.2rem',
    fontSize: 'clamp(0.65rem, 1.8vw, 0.85rem)',
  },
  tableRow: {
    transition: 'background-color 0.2s ease',
  },
  tableTdPlayer: {
    padding: 'clamp(0.5rem, 2vw, 1rem)',
    borderBottom: '2px solid rgba(255,215,0,0.2)',
    backgroundColor: '#40916c',
    verticalAlign: 'middle',
  },
  tableTd: {
    padding: 'clamp(0.25rem, 1vw, 0.5rem) clamp(0.15rem, 0.5vw, 0.25rem)',
    textAlign: 'center',
    borderBottom: '2px solid rgba(255,215,0,0.2)',
    backgroundColor: '#52b788',
    verticalAlign: 'middle',
  },
  playerBadge: {
    backgroundColor: '#6366f1',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontWeight: '600',
    display: 'inline-block',
    boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
  },
  playerNameInput: {
    width: 'clamp(90px, 20vw, 120px)',
    minWidth: '90px',
    padding: '0.5rem',
    border: '3px solid #ffd700',
    borderRadius: '10px',
    fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
    fontWeight: '700',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    color: '#000000 !important',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    outline: 'none',
    transition: 'all 0.3s ease',
    WebkitTextFillColor: '#000000',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  scoreInputModern: {
    width: 'clamp(50px, 15vw, 70px)',
    minWidth: '50px',
    padding: '0.5rem',
    border: '3px solid #ffd700',
    borderRadius: '10px',
    fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
    fontWeight: '700',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    outline: 'none',
    backgroundColor: '#ffffff',
    color: '#000000 !important',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    WebkitTextFillColor: '#000000',
    MozAppearance: 'textfield',
  } as React.CSSProperties & { MozAppearance?: string },
  inputLabel: {
    fontSize: '0.85rem',
    color: '#6b7280',
    fontWeight: '500',
  },
  pointsBadge: {
    padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1.25rem)',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: 'clamp(1rem, 3vw, 1.3rem)',
    display: 'inline-block',
    minWidth: '50px',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  scoreInput: {
    width: '80px',
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '0.95rem',
  },
  playerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  subtitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#ffffff',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  },
  addBtn: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
    transition: 'all 0.3s ease',
  },
  playerInput: {
    width: '100%',
    padding: '1.1rem 1.25rem 1.1rem 3rem', // More left padding for icon
    border: '2px solid rgba(255, 215, 0, 0.4)',
    borderLeft: '6px solid #dc143c', // Bold red accent on the left
    borderRadius: '14px',
    fontSize: '1.1rem',
    fontWeight: '700',
    backgroundColor: 'rgba(30, 41, 59, 0.7)', // Slate/Dark background to break green
    color: '#ffffff !important',
    transition: 'all 0.3s ease',
    outline: 'none',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    WebkitTextFillColor: '#ffffff',
    boxSizing: 'border-box',
    textAlign: 'left',
    letterSpacing: '0.5px',
  },

  playerInputFocus: {
    border: '2px solid #ffd700',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)',
    transform: 'translateY(-2px)',
  },

  removeBtn: {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    fontSize: '1.3rem',
    fontWeight: 'bold',
    boxShadow: '0 4px 12px rgba(239,68,68,0.3)',
    transition: 'all 0.3s ease',
  },
  previewSection: {
    marginTop: '2rem',
    marginBottom: '1rem',
  },
  previewBtn: {
    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    color: 'white',
    padding: '1rem 2rem',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: '700',
    width: '100%',
    marginBottom: '1rem',
    boxShadow: '0 6px 20px rgba(99,102,241,0.4)',
    transition: 'all 0.3s ease',
  },
  previewCard: {
    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    padding: '2rem',
    borderRadius: '16px',
    border: '3px solid #fbbf24',
    boxShadow: '0 8px 25px rgba(251,191,36,0.3)',
  },
  previewTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  previewTable: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '1rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  helperText: {
    fontSize: '0.95rem',
    color: '#78350f',
    margin: 0,
    padding: '1rem',
    backgroundColor: 'rgba(254,243,199,0.5)',
    borderRadius: '8px',
    borderLeft: '4px solid #f59e0b',
    fontWeight: '500',
  },
  submitBtn: {
    width: '100%',
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: 'white',
    padding: '1.25rem',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.2rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 8px 25px rgba(59,130,246,0.4)',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  clearBtn: {
    padding: '0.875rem 1.75rem',
    background: 'linear-gradient(135deg, #dc143c 0%, #8b0000 100%)',
    color: '#ffffff',
    border: '2px solid #ffd700',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(220,20,60,0.4)',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
  },

  declareWinnerBtn: {
    width: '100%',
    background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
    color: '#000000',
    padding: '1.25rem',
    border: '3px solid #ff8c00',
    borderRadius: '12px',
    fontSize: '1.3rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 8px 25px rgba(255,215,0,0.5)',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '1rem',
  },
  biddingSection: {
    margin: '2rem 0',
    padding: '1.5rem',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: '12px',
    border: '2px dashed #ffd700',
  },
  biddingHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
  },
  biddingInfo: {
    marginTop: '1rem',
    color: '#ffd700',
    fontWeight: '600',
    fontSize: '0.95rem',
    textAlign: 'left',
  },
  switch: {
    position: 'relative',
    display: 'inline-block',
    width: '60px',
    height: '34px',
    cursor: 'pointer',
  },
  slider: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ccc',
    transition: '0.4s',
    borderRadius: '34px',
  },
  sliderActive: {
    backgroundColor: '#ffd700',
  },
  sliderCircle: {
    position: 'absolute',
    height: '26px',
    width: '26px',
    left: '4px',
    bottom: '4px',
    backgroundColor: 'white',
    transition: '0.4s',
    borderRadius: '50%',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  sliderCircleActive: {
    transform: 'translateX(26px)',
  },
};


export default CreateSession;
