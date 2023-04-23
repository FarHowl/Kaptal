import React from "react";

function CrossIcon({ size, hovered, hoveredColor, color, animation }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 172 172">
            <g fill="none" strokeMiterlimit="10" fontFamily="none" fontSize="none" fontWeight="none" textAnchor="none" style={{ mixBlendMode: "normal" }}>
                <path d="M0 172V0h172v172z"></path>
                <path
                    className={animation}
                    fill={hovered ? hoveredColor : color}
                    d="M45.743 34.288a11.468 11.468 0 00-7.984 19.686L69.785 86 37.76 118.026a11.468 11.468 0 1016.215 16.215L86 102.215l32.026 32.026a11.468 11.468 0 1016.215-16.215L102.215 86l32.026-32.026a11.468 11.468 0 10-16.215-16.215L86 69.785 53.974 37.76a11.468 11.468 0 00-8.23-3.471z"
                ></path>
            </g>
        </svg>
    );
}

export default CrossIcon;
