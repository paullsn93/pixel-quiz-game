import React, { useEffect, useState } from 'react';
import PixelCard from './PixelCard';
import PixelButton from './PixelButton';
import { audioManager } from '../services/audio';
import { submitResult } from '../services/api';
import confetti from 'canvas-confetti';

const Result = ({ data, onRestart }) => {
    const { score, total, passed, user } = data;
    const [submitting, setSubmitting] = useState(true);
    const [submitError, setSubmitError] = useState(null);

    useEffect(() => {
        if (passed) {
            audioManager.playWin();
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#4ade80', '#f87171', '#fbbf24']
            });
        }

        const logResult = async () => {
            try {
                const result = await submitResult({
                    user,
                    score,
                    total,
                    passed,
                    timestamp: new Date().toISOString()
                });
                if (result && result.error) {
                    throw new Error(result.error);
                }
            } catch (error) {
                console.error("Submission failed", error);
                setSubmitError(error.message || "無法儲存成績，請檢查網路或後台設定");
            } finally {
                setSubmitting(false);
            }
        };
        logResult();
    }, [user, score, total, passed]);

    return (
        <div className="pixel-container">
            <PixelCard className="text-center">
                <h1 style={{
                    color: passed ? 'var(--pixel-primary)' : 'var(--pixel-secondary)',
                    marginBottom: '1rem',
                    textShadow: '4px 4px 0 #000'
                }}>
                    {passed ? 'MISSION COMPLETE' : 'GAME OVER'}
                </h1>

                <div style={{ marginBottom: '2rem' }}>
                    <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>SCORE: {score} / {total}</p>
                    <p style={{ color: passed ? 'var(--pixel-primary)' : 'var(--pixel-secondary)' }}>
                        {passed ? 'YOU PASSED!' : 'TRY AGAIN!'}
                    </p>
                </div>

                {submitting && <p className="animate-pulse" style={{ marginBottom: '1rem' }}>SAVING SCORE...</p>}
                {submitError && <p style={{ color: 'var(--pixel-secondary)', marginBottom: '1rem' }}>ERROR: {submitError}</p>}

                <PixelButton onClick={onRestart}>
                    PLAY AGAIN
                </PixelButton>
            </PixelCard>
        </div>
    );
};

export default Result;
