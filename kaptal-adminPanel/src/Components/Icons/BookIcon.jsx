import React from "react";

function BookIcon({ size, hovered, hoveredColor, color }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 172 172">
            <defs>
                <linearGradient id="color-1" x1="125.316" x2="136.575" y1="86.004" y2="86.004" gradientUnits="userSpaceOnUse">
                    <stop offset="0.441" stopColor="#999998"></stop>
                    <stop offset="0.653" stopColor="#c1c1c0"></stop>
                    <stop offset="0.88" stopColor="#e5e5e5"></stop>
                    <stop offset="1" stopColor="#f3f3f3"></stop>
                </linearGradient>
                <linearGradient id="color-2" x1="13.036" x2="56.226" y1="30.716" y2="148.368" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#0176d0"></stop>
                    <stop offset="1" stopColor="#16538c"></stop>
                </linearGradient>
                <linearGradient id="color-3" x1="60.128" x2="111.854" y1="18.468" y2="159.369" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#33bef0"></stop>
                    <stop offset="1" stopColor="#22a5e2"></stop>
                </linearGradient>
            </defs>
            <g fill="none" strokeMiterlimit="10" fontFamily="none" fontSize="none" fontWeight="none" textAnchor="none" style={{ mixBlendMode: "normal" }}>
                <path d="M0 172V0h172v172z"></path>
                <path fill={hovered ? hoveredColor : color} d="M146.917 21.5v129a7.165 7.165 0 01-7.167 7.167h-17.917V14.333h17.917a7.165 7.165 0 017.167 7.167z"></path>
                <path fill="url(#color-1)" d="M139.75 21.5v129a7.165 7.165 0 01-7.167 7.167h-21.5V14.333h21.5a7.165 7.165 0 017.167 7.167z"></path>
                <path fill="url(#color-2)" d="M25.083 21.5v129a7.165 7.165 0 007.167 7.167h7.167V14.333H32.25a7.165 7.165 0 00-7.167 7.167z"></path>
                <path fill="url(#color-3)" d="M125.417 14.333h-86v143.334h86a7.165 7.165 0 007.166-7.167v-129a7.165 7.165 0 00-7.166-7.167z"></path>
                <path fill="#1b9de2" d="M16 14H32V16H16z" transform="scale(3.58333)"></path>
            </g>
        </svg>
    );
}

export default BookIcon;
