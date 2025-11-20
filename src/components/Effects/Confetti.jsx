import React from 'react';

const Confetti = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
        {Array(50).fill(0).map((_, i) => (
            <div key={i} className="absolute w-2 h-2 rounded-full animate-confetti"
                style={{ left: `${Math.random() * 100}%`, top: `-10px`, backgroundColor: ['#FF5252', '#FFEB3B', '#448AFF', '#69F0AE'][Math.floor(Math.random() * 4)], animationDelay: `${Math.random() * 0.5}s`, animationDuration: `${1.5 + Math.random()}s` }} />
        ))}
    </div>
);

export default Confetti;
