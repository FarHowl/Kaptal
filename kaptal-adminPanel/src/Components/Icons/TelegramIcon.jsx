import React from "react";

function TelegramIcon({ size, hovered, hoveredColor, color, animation }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 240 240">
            <defs>
                <linearGradient id="a" x1="160.01" x2="100.01" y1="40.008" y2="180" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#37aee2"></stop>
                    <stop offset="1" stopColor="#1e96c8"></stop>
                </linearGradient>
            </defs>
            <circle cx="120" cy="120" r="120" fill="url(#a)"></circle>
            <path
                className={animation}
                fill={hovered ? hoveredColor : color}
                d="M44.691 125.87c14.028-7.727 29.687-14.176 44.318-20.658 25.171-10.617 50.442-21.05 75.968-30.763 4.966-1.655 13.89-3.273 14.765 4.087-.48 10.418-2.45 20.775-3.802 31.132-3.431 22.776-7.398 45.474-11.265 68.175-1.333 7.561-10.805 11.476-16.866 6.637-14.566-9.84-29.244-19.582-43.624-29.65-4.71-4.786-.342-11.66 3.864-15.078 11.997-11.823 24.72-21.868 36.09-34.302 3.067-7.406-5.995-1.164-8.984.749-16.424 11.318-32.446 23.327-49.762 33.274-8.845 4.869-19.154.708-27.995-2.01-7.927-3.281-19.543-6.588-12.708-11.592z"
            ></path>
        </svg>
    );
}

export default TelegramIcon;