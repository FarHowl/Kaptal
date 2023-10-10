import React from "react";

function WishesFilledIcon({ size, hovered, hoveredColor, color, animation }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256">
            <path
                className={animation}
                fill={hovered ? hoveredColor : color}
                strokeMiterlimit="10"
                d="M16.5 3C13.605 3 12 5.09 12 5.09S10.395 3 7.5 3A5.5 5.5 0 002 8.5c0 4.171 4.912 8.213 6.281 9.49C9.858 19.46 12 21.35 12 21.35s2.142-1.89 3.719-3.36C17.088 16.713 22 12.671 22 8.5A5.5 5.5 0 0016.5 3z"
                fontFamily="none"
                fontSize="none"
                fontWeight="none"
                textAnchor="none"
                transform="scale(10.66667)"
            ></path>
        </svg>
    );
}

export default WishesFilledIcon;
