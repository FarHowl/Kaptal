import React from "react";

function WishesIcon({ size, hovered, hoveredColor, color, animation }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 172 172">
            <g fill="none" strokeMiterlimit="10" fontFamily="none" fontSize="none" fontWeight="none" textAnchor="none" style={{ mixBlendMode: "normal" }}>
                <path d="M0 172V0h172v172z"></path>
                <path
                    className={animation}
                    fill={hovered ? hoveredColor : color}
                    d="M118.25 21.5C97.503 21.5 86 36.478 86 36.478S74.498 21.5 53.75 21.5c-21.772 0-39.417 17.644-39.417 39.417 0 29.892 35.203 58.86 45.014 68.011C70.65 139.463 86 153.008 86 153.008s15.351-13.545 26.653-24.08c9.811-9.151 45.014-38.12 45.014-68.011 0-21.773-17.645-39.417-39.417-39.417zm-12.105 93.955c-1.268 1.147-2.372 2.143-3.267 2.981C97.495 123.453 91.13 129.208 86 133.81c-5.131-4.601-11.502-10.363-16.878-15.373a338.794 338.794 0 00-3.267-2.981c-10.177-9.195-37.188-33.619-37.188-54.538 0-13.832 11.251-25.084 25.083-25.084 13.094 0 20.683 9.138 20.884 9.374L86 57.333l11.366-12.126c.072-.093 7.79-9.374 20.884-9.374 13.832 0 25.083 11.252 25.083 25.084 0 20.92-27.01 45.343-37.188 54.538z"
                ></path>
            </g>
        </svg>
    );
}

export default WishesIcon;
