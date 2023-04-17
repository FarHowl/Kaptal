import React from "react";

function ShoppingCart({ size, hovered, hoveredColor, color, animation }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 172 172">
            <g fill="none" strokeMiterlimit="10" fontFamily="none" fontSize="none" fontWeight="none" textAnchor="none" style={{ mixBlendMode: "normal" }}>
                <path d="M0 172V0h172v172z"></path>
                <path className={animation}
                    fill = {hovered ? hoveredColor : color}
                    d="M31.634 14.305l-24.44.126.07 14.334 14.838-.07 23.613 56.647-8.58 13.732a14.877 14.877 0 0012.612 22.76h86.42V107.5h-86.42l-.462-.84 8.426-13.493h53.526c5.21 0 10.005-2.833 12.528-7.377l25.825-46.471a7.163 7.163 0 00-.084-7.125 7.19 7.19 0 00-6.187-3.527H37.625zM43.588 43h87.554l-19.905 35.833H58.523zm6.579 86c-7.916 0-14.334 6.417-14.334 14.333s6.418 14.334 14.334 14.334c7.916 0 14.333-6.418 14.333-14.334 0-7.916-6.417-14.333-14.333-14.333zm71.666 0c-7.916 0-14.333 6.417-14.333 14.333s6.417 14.334 14.333 14.334 14.334-6.418 14.334-14.334c0-7.916-6.418-14.333-14.334-14.333z"
                ></path>
            </g>
        </svg>
    );
}

export default ShoppingCart;
