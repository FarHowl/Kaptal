import React from "react";
import { Suspense } from "react";
import { useState, useLayoutEffect, useRef } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import IconComponent from "./Components/Icons/IconComponent";
import jwt_decode from "jwt-decode";
import { authToken_header, getUserData, logOut } from "./Utils/LocalStorageUtils";
import LogInIcon from "./Components/Icons/LogInIcon";
import SearchIcon from "./Components/Icons/SearchIcon";
import UserProfileIcon from "./Components/Icons/UserProfileIcon";
import LoadingComponent from "./Components/UI/LoadingComponent";
import ProfilePopUp from "./Components/UI/ProfilePopUp";
import { useStoreState } from "pullstate";
import axios from "axios";
import "./index.css";
import { refreshToken_EP } from "./Utils/API";
import SignPopUp from "./Components/UI/SignPopUp";
import TelegramIcon from "./Components/Icons/TelegramIcon";
import { NotificationStore, showErrorNotification } from "./StoreState/NotificationStore";

const AdminPage = React.lazy(() => import("./Pages/AdminPage"));

export default function App() {
    const [isRouteLoaded, setIsRouteLoaded] = useState(false);
    const [isProfileHovered, setIsProfileHovered] = useState(false);
    const [isSignOpened, setIsSignOpened] = useState(false);

    const notifications = useStoreState(NotificationStore).notifications;

    const profilePopUpRef = useRef();

    async function refreshToken() {
        try {
            const res = await axios.get(refreshToken_EP, authToken_header());

            let user = getUserData();
            user.authToken = res.data.authToken;
            user = JSON.stringify(user);
            localStorage.setItem("userData", user);
        } catch (error) {
            showErrorNotification("Ошибка обновления токена");
        }
    }

    function profilePopUpOn() {
        profilePopUpRef.current.classList.remove("opacity-0");
        profilePopUpRef.current.classList.remove("pointer-events-none");
        profilePopUpRef.current.classList.remove("scale-0");
        profilePopUpRef.current.classList.add("opacity-100");
        profilePopUpRef.current.classList.add("scale-100");
    }

    function profilePopUpOff() {
        profilePopUpRef.current.classList.remove("opacity-100");
        profilePopUpRef.current.classList.remove("scale-100");
        profilePopUpRef.current.classList.add("scale-0");
        profilePopUpRef.current.classList.add("pointer-events-none");
        profilePopUpRef.current.classList.add("opacity-0");
    }

    let location = useLocation();

    useLayoutEffect(() => {
        window.scrollTo({
            top: 0,
        });

        setIsRouteLoaded(false);
        setTimeout(() => {
            setIsRouteLoaded(true);
        }, 300);
        if (location.pathname !== sessionStorage.getItem("currentPage")) sessionStorage.clear();
    }, [location]);

    useLayoutEffect(() => {
        if (getUserData()) {
            const decodedAuthToken = jwt_decode(getUserData().authToken);
            const currentTime = Date.now() / 1000;

            const expirationTime = decodedAuthToken.exp - currentTime;

            if (expirationTime <= 12 * 60 * 60 && expirationTime > 0) {
                refreshToken();
            } else if (expirationTime <= 0) {
                logOut();
            }
        }
    }, [location]);

    return (
        <div className="flex flex-col w-full items-center">
            <div className="fixed w-full flex justify-end pr-6 top-[90px] z-50 pointer-events-none">
                <div className="flex flex-col gap-y-2 pointer-events-none">
                    {notifications.slice(0, 3).map((notification) => {
                        return (
                            <div
                                key={notification.id}
                                className={
                                    "w-[300px] flex px-4 py-2 rounded-md border-2 animated-200 pointer-events-none " +
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
                    })}
                </div>
            </div>
            {isSignOpened ? <SignPopUp setIsSignOpened={setIsSignOpened} isSignOpened={isSignOpened} /> : <></>}
            <div className="w-full max-w-[1400px] flex gap-6 justify-between items-center h-[80px] px-6 border-b-2 fixed bg-white z-20">
                <Link to={"/"} className="title-font text-5xl text-center w-[204px] flex flex-shrink-0 justify-center">
                    Каптал
                </Link>
                <button className="px-4 py-3 rounded-xl text-white text-xl font-semibold bg-indigo-600 bg-opacity-90 animated-100 hover:bg-indigo-700 hover:bg-opacity-95">Каталог</button>
                <div className="relative w-full h-full flex items-center gap-4">
                    <input
                        className="max-w-[60%] w-full h-[50%] pl-10 pr-16 border-2 border-indigo-400 border-opacity-80 rounded-full focus:outline-none focus:ring-1 focus:border-indigo-500 focus:border-opacity-90 focus:ring-indigo-300"
                        placeholder="Введите для поиска"
                        type="text"
                    />
                    <div className="absolute left-[13px] flex items-center w-full h-full pointer-events-none">
                        <SearchIcon size={20} color={"#a3a2a2"} />
                    </div>
                    <button className="py-2 px-3 bg-sky-500 rounded-lg animated-100 hover:bg-sky-600">
                        <SearchIcon size={24} color={"#ffffff"} />
                    </button>
                </div>
                <div className="flex gap-4">
                    {getUserData() ? (
                        <div
                            onMouseOver={() => {
                                profilePopUpOn();
                                setIsProfileHovered(true);
                            }}
                            onMouseOut={() => {
                                profilePopUpOff();
                                setIsProfileHovered(false);
                            }}
                            className="relative"
                        >
                            <div className="relative z-20">
                                <IconComponent
                                    hoveredUntil={isProfileHovered}
                                    Icon={UserProfileIcon}
                                    size={28}
                                    color={"#000"}
                                    hoveredColor={"#3BA5ED"}
                                    iconTitle={"Профиль"}
                                    animation={"animated-100"}
                                />
                            </div>
                            <ProfilePopUp profilePopUpRef={profilePopUpRef} />
                        </div>
                    ) : (
                        <IconComponent
                            onClick={() => {
                                setIsSignOpened(true);
                            }}
                            Icon={LogInIcon}
                            size={28}
                            color={"#000"}
                            hoveredColor={"#3BA5ED"}
                            iconTitle={"Войти"}
                            animation={"animated-100"}
                        />
                    )}
                </div>
            </div>
            <div className="w-full h-[80px]"></div>
            <div className="w-full flex flex-col justify-between z-10">
                <Suspense>
                    <Routes>
                        <Route path="/" element={<AdminPage />} />
                    </Routes>
                </Suspense>
                {isRouteLoaded ? <></> : <LoadingComponent customStyle={"absolute inset-0 top-[80px] bg-white z-10 flex justify-center items-center"} />}
            </div>
        </div>
    );
}
