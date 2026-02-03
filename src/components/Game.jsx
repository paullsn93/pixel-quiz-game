import React, { useState, useEffect } from 'react';
import PixelCard from './PixelCard';
import PixelButton from './PixelButton';
import { getQuestions } from '../services/api';
import { audioManager } from '../services/audio';

const Game = ({ user, onEnd }) => {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [inputDisabled, setInputDisabled] = useState(true); // Prevent accidental clicks on start

    // Interaction state
    const [selectedOption, setSelectedOption] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false); // Validating answer

    const [isShaking, setIsShaking] = useState(false);
    const [muted, setMuted] = useState(false);

    useEffect(() => {
        let ignore = false;

        const fetchGameData = async () => {
            try {
                if (!ignore) setLoading(true);
                const data = await getQuestions(import.meta.env.VITE_QUESTION_COUNT || 5);

                if (!ignore) {
                    setQuestions(data);
                    console.log("Questions loaded:", data);
                    // Enable inputs after a short delay to prevent ghost clicks from previous screen
                    setTimeout(() => {
                        if (!ignore) {
                            console.log("Enabling inputs now");
                            setInputDisabled(false);
                        }
                    }, 2000);
                }
            } catch (err) {
                if (!ignore) {
                    console.error("Fetch error:", err);
                    setError('無法載入題目，請稍後再試。');
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        console.log("Game component mounted");
        fetchGameData();

        return () => {
            ignore = true;
        };
    }, []);

    const toggleMute = () => {
        const newMuted = !muted;
        setMuted(newMuted);
        audioManager.setMuted(newMuted);
    };

    const handleAnswer = (option) => {
        console.log("handleAnswer triggered with:", option, "Disabled:", inputDisabled, "ShowFeedback:", showFeedback);
        if (showFeedback || inputDisabled) {
            console.log("Ignored answer due to locked state");
            return;
        }

        setSelectedOption(option);
        setShowFeedback(true);
        audioManager.playClick();

        const currentQuestion = questions[currentIndex];
        const isCorrect = option === currentQuestion.answer;

        if (isCorrect) {
            setScore(prev => prev + 1);
            audioManager.playCorrect();
        } else {
            audioManager.playWrong();
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500);
        }

        // Delay to show feedback then move next
        setTimeout(() => {
            if (currentIndex + 1 < questions.length) {
                setCurrentIndex(prev => prev + 1);
                setSelectedOption(null);
                setShowFeedback(false);
            } else {
                // Game Over
                onEnd({
                    score: score + (isCorrect ? 1 : 0), // Add if last one correct
                    total: questions.length,
                    passed: (score + (isCorrect ? 1 : 0)) >= (import.meta.env.VITE_PASS_THRESHOLD || 3),
                    user
                });
            }
        }, 1500);
    };

    if (loading) {
        return (
            <div className="pixel-container">
                <h2 className="animate-pulse">LOADING...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="pixel-container">
                <PixelCard>
                    <p style={{ color: 'var(--pixel-secondary)', marginBottom: '1rem' }}>{error}</p>
                    <PixelButton onClick={() => window.location.reload()}>RETRY</PixelButton>
                </PixelCard>
            </div>
        );
    }

    if (questions.length === 0) {
        return <div className="pixel-container">NO QUESTIONS FOUND</div>;
    }

    const currentQuestion = questions[currentIndex];
    const avatarSeed = `boss-${currentIndex}`; // Unique boss per level

    return (
        <div className={`pixel-container ${isShaking ? 'shake' : ''}`}>
            {/* Audio Control */}
            <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                <PixelButton onClick={toggleMute} style={{ padding: '0.5rem', fontSize: '0.8rem' }}>
                    {muted ? '🔇' : '🔊'}
                </PixelButton>
            </div>

            {/* HUD */}
            <div style={{
                width: '100%',
                maxWidth: '800px',
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '1rem',
                borderBottom: '4px solid #fff',
                paddingBottom: '0.5rem'
            }}>
                <span>PLAYER: {user}</span>
                <span>SCORE: {score}</span>
            </div>

            <div style={{ width: '100%', maxWidth: '800px', marginBottom: '1rem' }}>
                <span>STAGE {currentIndex + 1} / {questions.length}</span>
            </div>

            {/* Main Content Area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%', maxWidth: '800px' }}>

                {/* Boss & Question Area */}
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {/* Avatar */}
                    <PixelCard style={{ width: '200px', flexShrink: 0, padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <img
                            src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${avatarSeed}&backgroundColor=b6e3f4`}
                            alt="Boss"
                            style={{ width: '100%', height: 'auto', imageRendering: 'pixelated', border: '4px solid #000' }}
                        />
                        <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', textAlign: 'center' }}>BOSS #{currentIndex + 1}</div>
                    </PixelCard>

                    {/* Question Text */}
                    <PixelCard style={{ flex: 1, minWidth: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <p style={{ lineHeight: '1.8', fontSize: '1.2rem' }}>{currentQuestion.question}</p>
                    </PixelCard>
                </div>

                {/* Options */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {currentQuestion.options.map((opt, idx) => {
                        let btnStyle = {};
                        // Feedback Logic
                        if (showFeedback) {
                            if (opt === currentQuestion.answer) {
                                btnStyle = { backgroundColor: 'var(--pixel-primary)', color: '#000' }; // Correct Answer Green
                            } else if (opt === selectedOption) {
                                btnStyle = { backgroundColor: 'var(--pixel-secondary)', color: '#000' }; // Wrong Selection Red
                            } else {
                                btnStyle = { opacity: 0.5 }; // Dim others
                            }
                        }

                        return (
                            <PixelButton
                                key={idx}
                                onClick={() => handleAnswer(opt)}
                                disabled={showFeedback || inputDisabled}
                                style={btnStyle}
                                className="option-btn"
                            >
                                {opt}
                            </PixelButton>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};

export default Game;
