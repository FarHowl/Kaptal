import React from "react";
import { useState } from "react";

export default function IconComponent({ Icon, iconTitle, size, color, hoveredColor, buttonStyle, animation, onClick, hoveredUntil }) {
    const [hovered, setHovered] = useState(false);

    return (
        <button
            onClick={onClick}
            onMouseOut={() => {
                setHovered(false);
            }}
            onMouseOver={() => {
                setHovered(true);
            }}
            className={buttonStyle ?? "w-[100px] flex justify-center items-center flex-col p-2 rounded-sm"}
        >
            <Icon size={size} hovered={hoveredUntil ?? hovered} hoveredColor={hoveredColor} color={color} animation={animation} />
            {iconTitle ? (
                <span className={animation} style={{ color: hoveredUntil ? hoveredColor : hovered ? hoveredColor : hovered }}>
                    {iconTitle}
                </span>
            ) : (
                <></>
            )}
        </button>
    );
}
