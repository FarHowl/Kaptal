import React from "react";

function SearchIcon({ size, color }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 172 172">
            <g fill="none" strokeMiterlimit="10" fontFamily="none" fontSize="none" fontWeight="none" textAnchor="none" style={{ mixBlendMode: "normal" }}>
                <path d="M0 172V0h172v172z"></path>
                <path
                    fill={color}
                    d="M71.667 14.333c-31.58 0-57.334 25.754-57.334 57.334 0 31.58 25.754 57.333 57.334 57.333 14.504 0 27.747-5.468 37.863-14.403l5.137 5.137V129l28.666 28.667 14.334-14.334L129 114.667h-9.266l-5.137-5.137C123.532 99.414 129 86.17 129 71.667c0-31.58-25.754-57.334-57.333-57.334zm0 14.334c23.833 0 43 19.167 43 43s-19.167 43-43 43-43-19.167-43-43 19.167-43 43-43zM50.167 64.5a7.167 7.167 0 100 14.333 7.167 7.167 0 000-14.333zm21.5 0a7.167 7.167 0 100 14.333 7.167 7.167 0 000-14.333zm21.5 0a7.167 7.167 0 100 14.333 7.167 7.167 0 000-14.333z"
                ></path>
            </g>
        </svg>
    );
}

export default SearchIcon;
