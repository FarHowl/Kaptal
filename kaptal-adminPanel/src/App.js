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
import "./index.css";

const SignUpPage = React.lazy(() => import("./Pages/SignUpPage"));
const AdminPage = React.lazy(() => import("./Pages/AdminPage"));

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
                <span className="px-4 py-3 rounded-xl text-white text-xl font-semibold bg-indigo-600 bg-opacity-90">Панель администратора</span>
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
                        <Link to={"/signIn"}>
                            <IconComponent Icon={LogInIcon} size={28} color={"#000"} hoveredColor={"#3BA5ED"} iconTitle={"Войти"} animation={"animated-100"} />
                        </Link>
                    )}
                </div>
            </div>
            <div className="w-full h-[80px]"></div>
            {isRouteLoaded ? <></> : <LoadingComponent customStyle={"absolute inset-0 top-[80px] bg-white z-10 flex justify-center items-center"} />}
            <Suspense>
                <Routes>
                    <Route path="/" element={<AdminPage />} />
                    <Route path="/signIn" element={<SignUpPage />} />
                </Routes>
            </Suspense>
        </div>
    );
}
