import { useEffect } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";

export function useSessionState(value) {
    const [sessionState, setSessionState] = useState(JSON.parse(sessionStorage.getItem("sessionState")) ?? value ?? null);
    let location = useLocation();

    useEffect(() => {
        sessionStorage.setItem("sessionState", JSON.stringify(sessionState));
        sessionStorage.setItem("currentPage", location.pathname);
    }, [sessionState]);

    return [sessionState, setSessionState];
}
