import React, { useState } from 'react';
import PixelCard from './PixelCard';
import PixelButton from './PixelButton';

const Login = ({ onLogin }) => {
    const [id, setId] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (id.trim()) {
            onLogin(id.trim());
        }
    };

    return (
        <div className="pixel-container">
            <PixelCard className="text-center">
                <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--pixel-primary)', textShadow: '4px 4px 0 #000' }}>
                    PIXEL QUIZ
                </h1>

                <div style={{ marginBottom: '2rem' }}>
                    <p style={{ marginBottom: '1rem', imageRendering: 'pixelated' }}>
                        <img
                            src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=welcome`}
                            alt="avatar"
                            style={{ width: '100px', height: '100px', border: '4px solid #000' }}
                        />
                    </p>
                    <p>輸入你的 ID 開始挑戰</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="pixel-input"
                        placeholder="ENTER ID..."
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        autoFocus
                    />
                    <PixelButton type="submit" disabled={!id.trim()}>
                        START GAME
                    </PixelButton>
                </form>
            </PixelCard>
        </div>
    );
};

export default Login;
