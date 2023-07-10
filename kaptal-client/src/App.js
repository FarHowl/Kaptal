import React from "react";
import { Suspense } from "react";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import IconComponent from "./Components/Icons/IconComponent";
import jwt_decode from "jwt-decode";
import { authToken_header, getUserData, logOut } from "./Utils/LocalStorageUtils";
import LogInIcon from "./Components/Icons/LogInIcon";
import SearchIcon from "./Components/Icons/SearchIcon";
import ShoppingCart from "./Components/Icons/ShoppingCart";
import UserProfileIcon from "./Components/Icons/UserProfileIcon";
import WishesIcon from "./Components/Icons/WishesIcon";
import LoadingComponent from "./Components/UI/LoadingComponent";
import ProfilePopUp from "./Components/UI/ProfilePopUp";
import { useStoreState } from "pullstate";
import axios from "axios";
import "./index.css";
import { refreshToken_EP } from "./Utils/API";
import { ShoppingCartStore } from "./StoreState/ShoppingCartStore";
import { WishlistStore } from "./StoreState/WishlistStore";
import { NotificationStore, showErrorNotification, showSuccessNotification, showWarningNotification } from "./StoreState/NotificationStore";
import SignPopUp from "./Components/UI/SignPopUp";
import TelegramIcon from "./Components/Icons/TelegramIcon";

const MainPage = React.lazy(() => import("./Pages/MainPage"));
const BookPage = React.lazy(() => import("./Pages/BookPage"));
const ShoppingCartPage = React.lazy(() => import("./Pages/ShoppingCartPage"));
const WishlistPage = React.lazy(() => import("./Pages/WishlistPage"));
const OrdersPage = React.lazy(() => import("./Pages/OrdersPage"));

export default function App() {
    const [isRouteLoaded, setIsRouteLoaded] = useState(false);
    const [isProfileHovered, setIsProfileHovered] = useState(false);
    const [isSignOpened, setIsSignOpened] = useState(false);

    const shoppingCart = useStoreState(ShoppingCartStore).shoppingCart;
    const wishlist = useStoreState(WishlistStore).wishlist;
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

    function countShoppingCartItems() {
        let items = 0;

        if (!shoppingCart) return items;
        for (const item of shoppingCart) {
            items += item.amount;
        }
        return items;
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
            {isSignOpened ? <SignPopUp setIsSignOpened={setIsSignOpened} /> : <></>}
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
                    <Link to={"/wishlist"}>
                        <div className="relative">
                            <IconComponent Icon={WishesIcon} size={28} color={"#000"} hoveredColor={"#3BA5ED"} iconTitle={"Желаемое"} animation={"animated-100"} />
                            <span className={"absolute top-0 right-0 rounded-full text-white bg-blue-500 px-[9px] text-center font-semibold " + (wishlist?.length !== 0 ? "pt-[2px]" : "")}>
                                {wishlist?.length !== 0 ? wishlist?.length : ""}
                            </span>
                        </div>
                    </Link>
                    <Link to={"/shoppingCart"}>
                        <div className="relative">
                            <span className={"absolute top-0 right-0 rounded-full text-white bg-blue-500 px-[9px] text-center font-semibold " + (countShoppingCartItems() !== 0 ? "pt-[2px]" : "")}>
                                {countShoppingCartItems() !== 0 ? countShoppingCartItems() : ""}
                            </span>
                            <IconComponent Icon={ShoppingCart} size={28} color={"#000"} hoveredColor={"#3BA5ED"} iconTitle={"Корзина"} animation={"animated-100"} />
                        </div>
                    </Link>
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
            <div className="w-full flex flex-col justify-between" style={{ height: `calc(100vh - 80px)` }}>
                <Suspense>
                    <Routes>
                        <Route path="/" element={<MainPage />} />
                        <Route path="/book/:bookId" element={<BookPage />} />
                        <Route path="/shoppingCart" element={<ShoppingCartPage />} />
                        <Route path="/wishlist" element={<WishlistPage />} />
                        <Route path="/orders" element={<OrdersPage />} />
                    </Routes>
                </Suspense>
                <div className="w-full flex flex-col items-center py-10 bg-sky-100/80 gap-y-12 mt-16">
                    <div className="w-full flex flex-wrap justify-between px-16">
                        <div className="flex flex-col gap-y-[8px] max-w-[400px]">
                            <span className="text-xl text-gray-700 font-bold">О Каптале</span>
                            <span className="tracking-wide text-gray-600">Пет-проект, который делался с искренней любовью. Дух Каптала всегда останется в сердце его разработчика ❤</span>
                        </div>
                        <div className="flex flex-col gap-y-[8px]">
                            <span className="text-xl text-gray-700 font-bold">Контакты</span>
                            <div className="flex gap-x-2">
                                <span className="text-red-600 font-medium">E:</span>
                                <span className="font-bold tracking-wide text-gray-700">kartashov104@gmail.com</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-y-[8px] items-center">
                            <span className="text-xl text-gray-700 font-bold">Следите за нами в соц. сетях</span>
                            <IconComponent
                                Icon={TelegramIcon}
                                size={36}
                                color={"#FFF"}
                                hoveredColor={"#FFF"}
                                buttonStyle={"px-2 py-2 w-[50px]"}
                                onClick={() => {
                                    window.open("https://t.me/FarHowl");
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex gap-x-3 items-center">
                        <div className="flex gap-x-1">
                            <span className="text-2xl pt-[7px] title-font">©</span>
                            <span className="flex title-font text-4xl font-semibold">Каптал</span>
                        </div>
                        <span className="font-semibold title-font text-3xl pt-[4px]">2023</span>
                    </div>
                </div>
            </div>
            {isRouteLoaded ? <></> : <LoadingComponent customStyle={"absolute inset-0 top-[80px] bg-white z-10 flex justify-center items-center"} />}
        </div>
    );
}
