import React from "react";

function NavigationButton({ size, hovered, hoveredColor, color, animation }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 172 172">
            <g fill="none" strokeMiterlimit="10" fontFamily="none" fontSize="none" fontWeight="none" textAnchor="none" style={{ mixBlendMode: "normal" }}>
                <path d="M0 172V0h172v172z"></path>
                <path className={animation}
                    fill = {hovered ? hoveredColor : color}
                    d="M59.433 105.4a7.138 7.138 0 005.067 2.1 7.138 7.138 0 005.067-2.1 7.165 7.165 0 000-10.134l-23.6-23.6h57.95c17.784 0 32.25 14.467 32.25 32.25 0 17.785-14.466 32.25-32.25 32.25H75.25a7.17 7.17 0 00-7.167 7.167 7.17 7.17 0 007.167 7.167h28.667c25.685 0 46.583-20.898 46.583-46.583 0-25.686-20.898-46.584-46.583-46.584h-57.95l23.6-23.6a7.165 7.165 0 000-10.133 7.165 7.165 0 00-10.134 0L23.6 59.433a7.165 7.165 0 000 10.134z"
                ></path>
            </g>
        </svg>
    );
}

export default NavigationButton;
