import { React, useState } from "react";

export default function InputTile({ title, onChange, defaultValue }) {
    const [isFocused, setIsFocused] = useState(false);
    const [isEmpty, setIsEmpty] = useState(defaultValue ? false : true);

    return (
        <div className="relative flex flex-col w-full items-center">
            <input
                onFocus={() => {
                    setIsFocused(true);
                }}
                onBlur={() => {
                    setIsFocused(false);
                }}
                onChange={(e) => {
                    onChange(e);
                    if (e.target.value.length === 0) setIsEmpty(true);
                    else setIsEmpty(false);
                }}
                className="w-full text-left pt-6 pb-1 font-medium text-medium px-3 border-[1px] border-gray-100 bg-gray-100 border-opacity-80 rounded-lg focus:outline-none focus:ring-1 focus:border-indigo-500 focus:border-opacity-90 focus:border-[1px] focus:bg-white focus:ring-indigo-300"
                type="text"
                defaultValue={defaultValue ?? ""}
            />
            <div className={"absolute left-3 h-full pointer-events-none animated-100 " + (isFocused || !isEmpty ? "top-[1px]" : "top-[25%]")}>
                <span className={"text-gray-500 animated-100 origin-top-left " + (isFocused || !isEmpty ? "text-sm" : "text-lg")}>{title}</span>
            </div>
        </div>
    );
}
