import React from "react";

function ApproveIcon({ size, hovered, hoveredColor, color, animation }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256">
            <path
                className={animation}
                fill={hovered ? hoveredColor : color}
                strokeMiterlimit="10"
                d="M41.938 8.625a2 2 0 00-1.626.938L21.5 38.343 9.312 27.814a1.992 1.992 0 00-2.03-.52 1.998 1.998 0 00-.595 3.52l13.938 12.062a2.005 2.005 0 001.582.453 2.01 2.01 0 001.387-.89L43.687 11.75a1.997 1.997 0 00-1.75-3.125z"
                fontFamily="none"
                fontSize="none"
                fontWeight="none"
                textAnchor="none"
                transform="scale(5.12)"
            ></path>
        </svg>
    );
}

export default ApproveIcon;
