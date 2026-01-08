import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import Navbar from '../components/Navbar';

const Tiers = [
    { id: 1, name: 'Layer 1', amount: 10, color: '#4d908e' },
    { id: 2, name: 'Layer 2', amount: 50, color: '#f9c74f' },
    { id: 3, name: 'Layer 3', amount: 100, color: '#f9844a' },
    { id: 4, name: 'Layer 4', amount: 500, color: '#f94144' },
];

const PaymentPage = () => {
    const { } = useAuth();
    const navigate = useNavigate();
    const [selectedTier, setSelectedTier] = useState(Tiers[0]);
    const [loading, setLoading] = useState(false);
    const [paymentConfirmed, setPaymentConfirmed] = useState(false);

    // Load player names for display
    const savedData = localStorage.getItem('callbreak_draft_session');
    const draftData = savedData ? JSON.parse(savedData) : null;
    const playerNames = draftData?.playerNames?.filter((n: string) => n.trim() !== '') || [];


    const handleConfirmPayment = async () => {
        const savedData = localStorage.getItem('callbreak_draft_session');
        if (!savedData) {
            alert('Session data not found. Please go back to Create Session.');
            return;
        }

        setLoading(true);
        // Simulate a small delay for "confirming"
        setTimeout(() => {
            const data = JSON.parse(savedData);
            const updatedData = {
                ...data,
                isBiddingPaid: true,
                bidTier: selectedTier
            };
            localStorage.setItem('callbreak_draft_session', JSON.stringify(updatedData));
            setLoading(false);
            alert(`Payment Confirmed for ${selectedTier.name}! Return to Create Session to play.`);
            navigate('/create-session');
        }, 1000);
    };


    return (
        <>
            <Navbar />
            <div style={styles.container}>
                <h1 style={styles.title}>Place Your Bid</h1>
                <p style={styles.subtitle}>Select a tier and make payment to start the match.</p>

                {playerNames.length > 0 && (
                    <div style={styles.playerListBanner}>
                        <p style={styles.playerListTitle}>Bidding for Match Participants:</p>
                        <div style={styles.playerNameGrid}>
                            {playerNames.map((name: string, i: number) => (
                                <span key={i} style={styles.playerNameTag}>{name}</span>
                            ))}
                        </div>
                    </div>
                )}


                <div style={styles.tierGrid}>
                    {Tiers.map((tier) => (
                        <div
                            key={tier.id}
                            onClick={() => setSelectedTier(tier)}
                            style={{
                                ...styles.tierCard,
                                borderColor: selectedTier.id === tier.id ? '#ffd700' : 'transparent',
                                backgroundColor: tier.color,
                                transform: selectedTier.id === tier.id ? 'scale(1.05)' : 'scale(1)',
                            }}
                        >
                            <h3 style={styles.tierName}>{tier.name}</h3>
                            <p style={styles.tierAmount}>₹{tier.amount}</p>
                            {selectedTier.id === tier.id && <div style={styles.selectedBadge}>SELECTED</div>}
                        </div>
                    ))}
                </div>

                <div style={styles.paymentSection}>
                    <h2 style={styles.sectionTitle}>Payment Details</h2>
                    <div style={styles.qrCard}>
                        <img
                            src="/payment_qr.jpg"
                            alt="Scan QR to Pay"
                            style={styles.qrImage}
                        />

                        <div style={styles.upiInfo}>
                            <p style={styles.upiLabel}>UPI ID:</p>
                            <p style={styles.upiValue}>py562535-1@oksbi</p>
                        </div>
                    </div>


                    <div style={styles.instructionCard}>
                        <p style={styles.instructionText}>
                            1. Scan the QR code or use the UPI ID above.<br />
                            2. Pay <strong>₹{selectedTier.amount}</strong> to join the match.<br />
                            3. Click "I Have Paid" once the transaction is complete.
                        </p>
                    </div>

                    <div style={styles.breakdownCard}>
                        <h3 style={styles.breakdownTitle}>Bid Breakdown ({selectedTier.name})</h3>
                        {playerNames.map((name: string, i: number) => (
                            <div key={i} style={styles.breakdownRow}>
                                <span>{name}</span>
                                <span>₹{selectedTier.amount}</span>
                            </div>
                        ))}
                        <div style={styles.breakdownTotal}>
                            <span>Total Pool</span>
                            <span>₹{selectedTier.amount * playerNames.length}</span>
                        </div>
                    </div>


                    {!paymentConfirmed ? (
                        <button
                            onClick={() => setPaymentConfirmed(true)}
                            style={styles.confirmBtn}
                        >
                            I Have Paid
                        </button>
                    ) : (
                        <div style={styles.finalFlow}>
                            <p style={styles.successMsg}>✓ Payment recorded. Ready to start?</p>
                            <button
                                onClick={handleConfirmPayment}
                                style={styles.startBtn}
                                disabled={loading}
                            >
                                {loading ? 'Starting...' : 'Start Bidding Match'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem 1rem',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f5132 0%, #1a4d2e 50%, #0f5132 100%)',
        color: '#ffffff',
        textAlign: 'center',
    },
    title: {
        fontSize: '2.5rem',
        color: '#ffd700',
        marginBottom: '0.5rem',
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
    },
    subtitle: {
        fontSize: '1.1rem',
        color: '#b8e6d5',
        marginBottom: '2.5rem',
    },
    playerListBanner: {
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        padding: '1rem',
        borderRadius: '12px',
        border: '1px solid #ffd700',
        marginBottom: '2rem',
        maxWidth: '600px',
        margin: '0 auto 2.5rem auto',
    },
    playerListTitle: {
        fontSize: '0.9rem',
        color: '#ffd700',
        marginBottom: '0.5rem',
        fontWeight: '600',
    },
    playerNameGrid: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem',
    },
    playerNameTag: {
        backgroundColor: '#ffd700',
        color: '#000',
        padding: '3px 12px',
        borderRadius: '15px',
        fontSize: '0.9rem',
        fontWeight: 'bold',
    },
    tierGrid: {

        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem',
    },
    tierCard: {
        padding: '1.5rem',
        borderRadius: '15px',
        cursor: 'pointer',
        position: 'relative',
        border: '4px solid transparent',
        boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tierName: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        margin: '0 0 0.5rem 0',
        color: '#ffffff',
    },
    tierAmount: {
        fontSize: '2rem',
        fontWeight: '800',
        margin: 0,
        color: '#ffffff',
    },
    selectedBadge: {
        position: 'absolute',
        top: '-10px',
        backgroundColor: '#ffd700',
        color: '#000000',
        padding: '2px 10px',
        borderRadius: '10px',
        fontSize: '0.7rem',
        fontWeight: 'bold',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    },
    paymentSection: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: '2rem',
        borderRadius: '20px',
        border: '2px solid rgba(255,215,0,0.3)',
        maxWidth: '500px',
        margin: '0 auto',
    },
    sectionTitle: {
        fontSize: '1.5rem',
        color: '#ffd700',
        marginBottom: '1.5rem',
    },
    qrCard: {
        backgroundColor: '#ffffff',
        padding: '1.5rem',
        borderRadius: '15px',
        display: 'inline-block',
        marginBottom: '1.5rem',
    },
    qrImage: {
        width: '200px',
        height: '200px',
        marginBottom: '1rem',
    },
    upiInfo: {
        color: '#333333',
        borderTop: '1px solid #eee',
        paddingTop: '0.5rem',
    },
    upiLabel: {
        fontSize: '0.8rem',
        margin: 0,
        color: '#666',
    },
    upiValue: {
        fontSize: '1.1rem',
        fontWeight: 'bold',
        margin: 0,
        color: '#000',
    },
    instructionCard: {
        textAlign: 'left',
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: '1rem',
        borderRadius: '10px',
        marginBottom: '1.5rem',
    },
    instructionText: {
        fontSize: '0.95rem',
        lineHeight: '1.6',
        margin: 0,
        color: '#e0f2f1',
    },
    breakdownCard: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        padding: '1rem',
        borderRadius: '10px',
        marginBottom: '1.5rem',
        textAlign: 'left',
    },
    breakdownTitle: {
        fontSize: '1rem',
        color: '#ffd700',
        marginBottom: '0.8rem',
        borderBottom: '1px solid rgba(255,215,0,0.3)',
        paddingBottom: '0.5rem',
    },
    breakdownRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '0.4rem',
        fontSize: '0.9rem',
        color: '#ffffff',
    },
    breakdownTotal: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '0.8rem',
        paddingTop: '0.5rem',
        borderTop: '2px solid #ffd700',
        fontWeight: 'bold',
        fontSize: '1rem',
        color: '#ffd700',
    },
    confirmBtn: {

        width: '100%',
        padding: '1rem',
        backgroundColor: '#ffd700',
        color: '#000',
        border: 'none',
        borderRadius: '10px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(255,215,0,0.3)',
        transition: 'all 0.3s ease',
    },
    finalFlow: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    successMsg: {
        color: '#ffd700',
        fontWeight: 'bold',
        fontSize: '1rem',
    },
    startBtn: {
        width: '100%',
        padding: '1rem',
        backgroundColor: '#10b981',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(16,185,129,0.3)',
        transition: 'all 0.3s ease',
    }
};

export default PaymentPage;
