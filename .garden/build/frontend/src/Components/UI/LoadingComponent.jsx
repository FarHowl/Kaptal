import React from "react";

export default function LoadingComponent({ customStyle }) {
    return (
        <div className={customStyle ?? "absolute inset-0 top-[60px] bg-white z-50 flex justify-center items-center"}>
            <i className="loader --1"></i>
        </div>
    );
}
