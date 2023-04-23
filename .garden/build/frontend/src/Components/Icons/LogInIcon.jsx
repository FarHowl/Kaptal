import React from "react";

function LogInIcon({ size, hovered, hoveredColor, color, animation }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 172 172">
            <g fill="none" strokeMiterlimit="10" fontFamily="none" fontSize="none" fontWeight="none" textAnchor="none" style={{ mixBlendMode: "normal" }}>
                <path d="M0 172V0h172v172z"></path>
                <path className={animation}
                    fill = {hovered ? hoveredColor : color}
                    d="M86.06 6.82c-32.957 0-61.25 20.24-73.113 48.98a6.88 6.88 0 1012.719 5.247C35.46 37.319 58.729 20.58 86.06 20.58c36.18 0 65.36 29.18 65.36 65.36 0 36.178-29.18 65.36-65.36 65.36-27.328 0-50.6-16.733-60.394-40.46a6.88 6.88 0 10-12.719 5.247c11.864 28.739 40.159 48.973 73.113 48.973 43.616 0 79.12-35.505 79.12-79.12 0-43.616-35.504-79.12-79.12-79.12zm6.692 48.092a6.88 6.88 0 00-4.797 11.812l12.336 12.336H13.7a6.88 6.88 0 100 13.76h86.59l-12.335 12.335a6.88 6.88 0 109.729 9.729l24.08-24.08a6.88 6.88 0 000-9.729l-24.08-24.08a6.88 6.88 0 00-4.932-2.083z"
                ></path>
            </g>
        </svg>
    );
}

export default LogInIcon;
