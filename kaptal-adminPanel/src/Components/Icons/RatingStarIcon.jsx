import React from "react";

function RatingStarIcon({ size, hovered, hoveredColor, color, animation }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256">
            <path
                className={animation}
                fill={hovered ? hoveredColor : color}
                strokeMiterlimit="10"
                d="M12 18.091l4.969 2.999c.784.473 1.751-.23 1.543-1.121l-1.319-5.653 4.391-3.804c.692-.599.322-1.736-.59-1.813l-5.78-.49-2.261-5.335c-.357-.841-1.549-.841-1.906 0L8.786 8.209l-5.78.49c-.912.077-1.282 1.214-.59 1.813l4.391 3.804-1.319 5.653c-.208.891.759 1.594 1.543 1.121z"
                fontFamily="none"
                fontSize="none"
                fontWeight="none"
                textAnchor="none"
                transform="scale(10.66667)"
            ></path>
        </svg>
    );
}

export default RatingStarIcon;
