import { React, useState, useEffect, useLayoutEffect } from "react";

export default function InputTile({ title, onChange, type, defaultValue, effectProp }) {
    const [isFocused, setIsFocused] = useState(false);
    const [value, setValue] = useState(defaultValue ?? "");

    useLayoutEffect(() => {
        if (effectProp) {
            effectProp(value, setValue);
        }
    }, [value]);

    useEffect(() => {
        if (defaultValue !== undefined) {
            setValue(defaultValue);
        }
    }, [defaultValue]);

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
                    setValue(e.target.value);
                }}
                className="w-full text-left pt-6 pb-1 font-medium text-medium px-3 border-[1px] border-gray-100 bg-gray-100 border-opacity-80 rounded-lg focus:outline-none focus:ring-1 focus:border-sky-500 focus:border-opacity-90 focus:border-[1px] focus:bg-white focus:ring-sky-300"
                type={type ?? "text"}
                value={value}
            />
            <div className={"absolute left-3 h-full pointer-events-none animated-100 " + (isFocused || value ? "top-[1px]" : "top-[25%]")}>
                <span className={"text-gray-500 animated-100 origin-top-left " + (isFocused || value ? "text-sm" : "text-lg")}>{title}</span>
            </div>
        </div>
    );
}
