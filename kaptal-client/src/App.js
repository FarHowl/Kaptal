import React from "react";
import { Suspense } from "react";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import IconComponent from "./Components/Icons/IconComponent";
import jwt_decode from "jwt-decode";
import { getUserData, logOut } from "./Utils/LocalStorageUtils";
import LogInIcon from "./Components/Icons/LogInIcon";
import SearchIcon from "./Components/Icons/SearchIcon";
import ShoppingCart from "./Components/Icons/ShoppingCart";
import UserProfileIcon from "./Components/Icons/UserProfileIcon";
import WishesIcon from "./Components/Icons/WishesIcon";
import LoadingComponent from "./Components/UI/LoadingComponent";
import ProfilePopUp from "./Components/UI/ProfilePopUp";
import { Store } from "pullstate";
import "./index.css";

const MainPage = React.lazy(() => import("./Pages/MainPage"));
const SignUpPage = React.lazy(() => import("./Pages/SignUpPage"));
const AdminPage = React.lazy(() => import("./Pages/AdminPage"));
const BookPage = React.lazy(() => import("./Pages/BookPage"));

export default function App() {
    const [isRouteLoaded, setIsRouteLoaded] = useState(false);
    const [isProfileHovered, setIsProfileHovered] = useState(false);

    const profilePopUpRef = useRef();

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
        setIsRouteLoaded(false);
        setTimeout(() => {
            setIsRouteLoaded(true);
        }, 300);
        if (location.pathname !== sessionStorage.getItem("currentPage")) sessionStorage.clear();
    }, [location]);

    useLayoutEffect(() => {
        if (getUserData()?.authToken) {
            const decodedToken = jwt_decode(getUserData()?.authToken);
            const currentTime = Date.now() / 1000;

            if (decodedToken.exp < currentTime) {
                logOut();
            }
        }
    }, []);

    return (
        <div className="flex flex-col w-full items-center">
            <div className="w-full flex gap-6 justify-between items-center h-[80px] rounded-md px-6 border-b-2 fixed bg-white z-20">
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
                    <IconComponent Icon={WishesIcon} size={28} color={"#000"} hoveredColor={"#3BA5ED"} iconTitle={"Желаемое"} animation={"animated-100"} />
                    <IconComponent Icon={ShoppingCart} size={28} color={"#000"} hoveredColor={"#3BA5ED"} iconTitle={"Корзина"} animation={"animated-100"} />
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
                        <Link to={"/signin"}>
                            <IconComponent Icon={LogInIcon} size={28} color={"#000"} hoveredColor={"#3BA5ED"} iconTitle={"Войти"} animation={"animated-100"} />
                        </Link>
                    )}
                </div>
            </div>
            <div className="w-full h-[80px]"></div>
            {isRouteLoaded ? <></> : <LoadingComponent customStyle={"absolute inset-0 top-[90px] bg-white z-10 flex justify-center items-center"} />}
            <Suspense>
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/signin" element={<SignUpPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/book/:bookId" element={<BookPage />} />
                </Routes>
            </Suspense>
        </div>
    );
}
