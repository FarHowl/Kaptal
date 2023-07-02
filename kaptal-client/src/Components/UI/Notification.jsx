import { useEffect, useState, React } from "react";

export default function Notification({ notification }) {

    return (
        <div
            className={
                "w-[300px] flex px-4 py-2 rounded-md border-2 animated-200 " +
                (notification.type === "success"
                    ? "bg-green-100 border-green-300"
                    : notification.type === "warning"
                    ? "bg-yellow-100 border-yellow-300"
                    : "bg-red-100 border-red-300 ") +
                (notification.isTransparent ? " opacity-50" : " opacity-100")
            }
        >
            {notification.message}
        </div>
    );
}
