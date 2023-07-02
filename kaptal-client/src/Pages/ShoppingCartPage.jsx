import { React, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { authToken_header, getUserData } from "../Utils/LocalStorageUtils";
import { getBookImage_EP, getShoppingCartBooks_EP } from "../Utils/API";
import { useStoreState } from "pullstate";
import LoadingComponent from "../Components/UI/LoadingComponent";
import IconComponent from "../Components/Icons/IconComponent";
import WishesFilledIcon from "../Components/Icons/WishesFilledIcon";
import WishesIcon from "../Components/Icons/WishesIcon";
import CrossIcon from "../Components/Icons/CrossIcon";
import { ShoppingCartStore, addToCartAction, removeFromCartAction, rmSameBooksFromCartAction } from "../StoreState/ShoppingCartStore";
import { WishlistStore, addToWishlistAction, removeFromWishlistAction } from "../StoreState/WishlistStore";

export default function ShoppingCartPage() {
    const shoppingCart = useStoreState(ShoppingCartStore).shoppingCart;
    const wishlist = useStoreState(WishlistStore).wishlist;
    const [shoppingCartBooks, setShoppingCartBooks] = useState([]);
    const [isImgLoaded, setIsImgLoaded] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);

    const navigate = useNavigate();

    const renderCounter = useRef(0);

    const calculateDiscount = (price, discount) => {
        const summary = price - price * (discount / 100);
        return Math.round(summary);
    };

    const getShoppingCartBooks = async () => {
        try {
            const bookIds = shoppingCart.map((item) => item.bookId);
            const response = await axios.post(getShoppingCartBooks_EP, { bookIds }, authToken_header());
            const shoppingCartBooks = response.data.map((book) => {
                const { _id } = book;
                const { amount } = shoppingCart.find((item) => item.bookId === _id);
                setTotalPrice((prev) => prev + book.price * amount);
                return { ...book, amount };
            });

            setShoppingCartBooks(shoppingCartBooks);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        console.log(renderCounter.current);
        if (renderCounter.current === 0) {
            getShoppingCartBooks();
            renderCounter.current = 1;
        }
    }, [shoppingCart]);

    useEffect(()=>{
        console.log(shoppingCart)
    }, [shoppingCart])

    return (
        <div className="w-full flex flex-col justify-center items-center px-6">
            <div className="max-w-[1400px] w-full flex flex-col justify-center items-center mt-8 flex-wrap gap-y-6">
                <div className="w-full justify-start">
                    <span className="text-3xl font-bold">Корзина</span>
                </div>
                <div className="flex gap-10 w-full justify-between">
                    <div className="flex flex-col items-start w-[1000px]">
                        {shoppingCartBooks.map((book) => (
                            <div key={book._id} className="max-w-[1000px] w-full flex py-4 border-b-2 border-gray-100 justify-between">
                                <div className="flex">
                                    <div
                                        onClick={() => {
                                            navigate(`/book/${book._id}`);
                                        }}
                                        className="w-[100px] h-[150px] cursor-pointer"
                                    >
                                        {isImgLoaded ? null : <LoadingComponent customStyle={"absolute inset-0 flex justify-center items-center bg-white z-5"} />}
                                        <img
                                            onLoad={() => {
                                                setIsImgLoaded(true);
                                            }}
                                            className="object-cover w-full h-full"
                                            src={`${getBookImage_EP}?imgName=${book.image}`}
                                            alt=""
                                        />
                                    </div>
                                    <div className="flex flex-col items-start ml-6">
                                        <span
                                            onClick={() => {
                                                navigate(`/book/${book._id}`);
                                            }}
                                            className="font-semibold text-lg cursor-pointer animated-100 hover:text-sky-500"
                                        >
                                            {book.name}
                                        </span>
                                        <span className="text-gray-500">{book.author}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-between">
                                    <div className="flex gap-x-3">
                                        <div className="flex border-gray-100 border-2">
                                            <button
                                                onClick={() => {
                                                    if (book.amount > 1) {
                                                        removeFromCartAction(book);
                                                        book.amount--;
                                                        setTotalPrice((prev) => prev - book.price);
                                                    }
                                                }}
                                                className={"px-2 py-[2px] " + (book.amount === 1 ? "opacity-50" : "")}
                                            >
                                                -
                                            </button>
                                            <span className="min-w-[30px] text-center pt-[2px]">{book.amount}</span>
                                            <button
                                                onClick={() => {
                                                    addToCartAction(book);
                                                    book.amount++;
                                                    setTotalPrice((prev) => prev + book.price);
                                                }}
                                                className="px-2 py-[2px]"
                                            >
                                                +
                                            </button>
                                        </div>
                                        {book.discount === 0 ? (
                                            <div className="flex w-full gap-10 items-center justify-end">
                                                <span className="font-bold text-xl">{book.price * book.amount + "₽"}</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col w-full gap-10 items-center justify-end">
                                                <span className="font-bold text-red-500 text-xl">{calculateDiscount(book.price, book.discount) + "₽"}</span>
                                                <span className="font-extralight line-through text-slate-600">{book.price + "₽"}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-x-3 w-full justify-end">
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
                                            Icon={wishlist.some((item) => item.bookId === book._id) ? WishesFilledIcon : WishesIcon}
                                            size={20}
                                            color={"#3BA5ED"}
                                            hoveredColor={"#1b90e0"}
                                            animation={"animated-100"}
                                            buttonStyle={"w-[40px] h-[40px] flex justify-center items-center bg-slate-200 animated-100 rounded-md hover:bg-slate-300"}
                                        />
                                        <IconComponent
                                            onClick={() => {
                                                rmSameBooksFromCartAction(book);
                                                setTotalPrice((prev) => prev - book.price * book.amount);
                                                shoppingCartBooks.splice(shoppingCartBooks.indexOf(book), 1);
                                            }}
                                            Icon={CrossIcon}
                                            size={20}
                                            color={"#3BA5ED"}
                                            hoveredColor={"#1b90e0"}
                                            animation={"animated-100"}
                                            buttonStyle={"w-[40px] h-[40px] flex justify-center items-center bg-slate-200 animated-100 rounded-md hover:bg-slate-300"}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="w-[300px] flex flex-col gap-y-4">
                        <div className="rounded-md border-2 border-gray-100 flex flex-col px-6 py-4">
                            <div className="flex justify-between">
                                <span className="text-lg font-semibold">Итого</span>
                                <span className="text-lg font-semibold">{totalPrice}</span>
                            </div>
                        </div>
                        <button className="py-2 w-full rounded-md text-white animated-100 font-semibold bg-sky-400 hover:bg-sky-500 px-4">Оформить заказ</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
