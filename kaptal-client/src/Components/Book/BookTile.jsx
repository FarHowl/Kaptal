import { React, useState, useEffect, useLayoutEffect } from "react";
import LoadingComponent from "../UI/LoadingComponent";
import { compactString } from "../../Utils/CalculationUtils";
import IconComponent from "../Icons/IconComponent";
import WishesIcon from "../Icons/WishesIcon";
import { addBookToShoppingCart_EP, addBookToWishlist_EP, getBookImage_EP, removeBookFromShoppingCart_EP, removeBookFromWishlist_EP } from "../../Utils/API";
import { authToken_header, getUserData } from "../../Utils/LocalStorageUtils";
import { useStoreState } from "pullstate";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import WishesFilledIcon from "../Icons/WishesFilledIcon";
import { WishlistStore, addToWishlistAction, removeFromWishlistAction } from "../../StoreState/WishlistStore";
import { ShoppingCartStore, addToCartAction, removeFromCartAction } from "../../StoreState/ShoppingCartStore";

export default function BookTile({ book }) {
    const [isImgLoaded, setIsImgLoaded] = useState(false);
    const [isTileHovered, setIsTileHovered] = useState(false);

    const shoppingCart = useStoreState(ShoppingCartStore).shoppingCart;
    const wishlist = useStoreState(WishlistStore).wishlist;

    const navigate = useNavigate();

    const calculateDiscount = (price, discount) => {
        const summary = price - price * (discount / 100);
        return Math.round(summary);
    };

    return (
        <div className="flex relative flex-col justify-center w-[250px] p-3 pt-[30px] pb-4 gap-[12px] rounded-md hover:shadow-lg animated-100">
            <div className="absolute top-[6px] text-base flex w-[224px] items-center">
                <span className={book.stock !== 0 ? "text-emerald-500" : "text-red-500"}>{book.stock !== 0 ? "В наличии" : "Нет в наличии"}</span>
            </div>

            <div
                onClick={() => navigate("/book/" + book._id)}
                onMouseOut={() => setIsTileHovered(false)}
                onMouseOver={() => setIsTileHovered(true)}
                className="flex flex-col animated-200 w-full pt-5 flex-shrink-0 justify-center gap-[14px] cursor-pointer"
            >
                <div className="flex w-full justify-center items-center">
                    <div className="h-[200px] max-w-[150px] relative mb-1">
                        {isImgLoaded ? <></> : <LoadingComponent customStyle={"absolute inset-0 flex justify-center items-center bg-white z-5"} />}
                        <div className={"perspective w-full h-full"}>
                            <img
                                onLoad={() => setIsImgLoaded(true)}
                                src={getBookImage_EP + "?imgName=" + book.image}
                                className={"book w-full h-full object-cover " + (isTileHovered ? "book-hover" : "")}
                                alt=""
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col text-lg">
                    <span className="font-semibold">{compactString(book.name, 22)}</span>
                    <span className="font-light text-slate-400 text-base">{book.author}</span>
                </div>
                {book.discount === 0 ? (
                    <div className="flex w-full gap-10 items-center">
                        <span className="font-bold text-xl">{book.price + "₽"}</span>
                    </div>
                ) : (
                    <div className="flex w-full gap-10 items-center">
                        <span className="font-bold text-red-500 text-xl">{calculateDiscount(book.price, book.discount) + "₽"}</span>
                        <span className="font-extralight line-through text-slate-600">{book.price + "₽"}</span>
                    </div>
                )}
            </div>
            <div className="w-full flex justify-between px-4">
                <button
                    onClick={() => {
                        if (!shoppingCart.some((item) => item.bookId === book._id)) {
                            if (book.stock) {
                                addToCartAction(book);
                            }
                        } else {
                            navigate("/shoppingCart");
                        }
                    }}
                    className={`py-2 w-[140px] rounded-md text-white animated-100 font-semibold ${book.stock ? "bg-sky-400 hover:bg-sky-500" : "bg-slate-400 pointer-events-none"}`}
                >
                    {shoppingCart.some((item) => item.bookId === book._id) ? "Оформить" : "Купить"}
                </button>
                <IconComponent
                    onClick={() => {
                        if (getUserData()) {
                            if (wishlist.some((item) => item.bookId === book._id)) {
                                removeFromWishlistAction(book);
                            } else {
                                addToWishlistAction(book);
                            }
                        }
                    }}
                    Icon={wishlist?.some((item) => item.bookId === book._id) ? WishesFilledIcon : WishesIcon}
                    size={20}
                    color={"#3BA5ED"}
                    hoveredColor={"#1b90e0"}
                    animation={"animated-100"}
                    buttonStyle={"w-[40px] h-[40px] flex justify-center items-center bg-slate-200 animated-100 rounded-md hover:bg-slate-300"}
                />
            </div>
        </div>
    );
}
