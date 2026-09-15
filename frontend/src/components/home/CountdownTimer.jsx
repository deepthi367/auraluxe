import { useEffect, useState } from 'react';

export default function CountdownTimer({ hours = 5 }) {
    const [timeLeft, setTimeLeft] = useState(() => hours * 3600);

    useEffect(() => {
        const target = Date.now() + timeLeft * 1000;
        const id = setInterval(() => {
            const diff = Math.max(0, Math.round((target - Date.now()) / 1000));
            setTimeLeft(diff);
        }, 1000);
        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const hh = String(Math.floor(timeLeft / 3600)).padStart(2, '0');
    const mm = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0');
    const ss = String(timeLeft % 60).padStart(2, '0');

    return (
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
            <div className="rounded-lg p-4 flex items-center justify-between" style={{ background: 'linear-gradient(90deg, rgba(224,168,153,0.06), rgba(26,80,89,0.02))' }}>
                <div>
                    <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--rose)' }}>Limited Time Offer</p>
                    <h4 className="text-lg font-semibold" style={{ color: 'var(--deep)' }}>Sale Ends In:</h4>
                </div>
                <div className="font-mono text-xl" style={{ color: 'var(--deep)' }}>
                    {hh}h : {mm}m : {ss}s
                </div>
            </div>
        </div>
    );
}
