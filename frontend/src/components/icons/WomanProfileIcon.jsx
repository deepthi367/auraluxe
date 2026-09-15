import React from 'react';

export default function WomanProfileIcon({ className = 'h-6 w-6', filled = false, title = 'Aura Profile', ...props }) {
    const base = `woman-icon ${className} transition-transform duration-300 ease-in-out ${filled ? 'profile-pop' : 'hover:scale-105'}`;
    const fillColor = filled ? 'currentColor' : 'none';
    const strokeColor = 'currentColor';

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            className={base}
            aria-hidden
            role="img"
            {...props}
        >
            <title>{title}</title>
            {/* Minimalist female profile line-art */}
            <g fill={fillColor} stroke={strokeColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M42 14c-3 0-6 2-8 5-2 3-4 9-2 14 3 7 8 10 10 12 2 1 5 2 8 2 3 0 6-2 6-5 0-6-6-10-10-14-3-3-6-11-4-14z" />
                <circle cx="24" cy="26" r="1.6" fill={fillColor} />
                <path d="M22 30c-2 3-3 6-3 9 0 7 6 12 13 12" fill="none" />
            </g>
        </svg>
    );
}
