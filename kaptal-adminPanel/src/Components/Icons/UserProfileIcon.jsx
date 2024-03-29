import React from "react";

function UserProfileIcon({ size, hovered, hoveredColor, color, animation }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 172 172">
            <g fill="none" strokeMiterlimit="10" fontFamily="none" fontSize="none" fontWeight="none" textAnchor="none" style={{ mixBlendMode: "normal" }}>
                <path d="M0 172V0h172v172z"></path>
                <path className={animation}
                    fill = {hovered ? hoveredColor : color}
                    d="M86 14.333c-39.581 0-71.667 32.085-71.667 71.667 0 39.581 32.086 71.667 71.667 71.667S157.667 125.582 157.667 86c0-39.581-32.085-71.667-71.667-71.667zm0 14.334c31.662 0 57.333 25.67 57.333 57.333 0 11.447-3.4 22.081-9.182 31.032l-5.515-4.269c-11.123-8.578-31.62-12.43-42.636-12.43-11.015 0-31.52 3.852-42.636 12.43l-5.515 4.283c-5.785-8.953-9.182-19.594-9.182-31.046 0-31.662 25.67-57.333 57.333-57.333zm0 12.541c-12.843 0-23.292 10.45-23.292 23.292 0 12.843 10.45 23.292 23.292 23.292 12.843 0 23.292-10.45 23.292-23.292 0-12.843-10.45-23.292-23.292-23.292zm0 14.334c4.938 0 8.958 4.02 8.958 8.958 0 4.938-4.02 8.958-8.958 8.958-4.938 0-8.958-4.02-8.958-8.958 0-4.938 4.02-8.958 8.958-8.958zm0 59.125c22.222 0 34.171 8.374 39.767 12.57-10.312 9.946-24.31 16.096-39.767 16.096-15.457 0-29.455-6.15-39.767-16.097 5.596-4.195 17.545-12.57 39.767-12.57zm-42.608 9.602c.867.955 1.738 1.906 2.66 2.8a57.76 57.76 0 01-2.66-2.8zm84.978.252c-.786.864-1.57 1.733-2.407 2.547.834-.81 1.614-1.687 2.407-2.547z"
                ></path>
            </g>
        </svg>
    );
}

export default UserProfileIcon;
