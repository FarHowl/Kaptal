import { React, useEffect, useState, useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { authToken_header, getUserData } from "../Utils/LocalStorageUtils";
import { getBookImage_EP, getSeveralParticularBooksData_EP, getShoppingCartBooks_EP, getUserData_EP, makeOrder_EP } from "../Utils/API";
import { useStoreState } from "pullstate";
import LoadingComponent from "../Components/UI/LoadingComponent";
import IconComponent from "../Components/Icons/IconComponent";
import WishesFilledIcon from "../Components/Icons/WishesFilledIcon";
import WishesIcon from "../Components/Icons/WishesIcon";
import CrossIcon from "../Components/Icons/CrossIcon";
import { ShoppingCartStore, addToCartAction, removeFromCartAction, rmSameBooksFromCartAction } from "../StoreState/ShoppingCartStore";
import { WishlistStore, addToWishlistAction, removeFromWishlistAction } from "../StoreState/WishlistStore";
import InputTile from "../Components/UI/InputTile";
import { showErrorNotification, showSuccessNotification } from "../StoreState/NotificationStore";

export default function ShoppingCartPage() {
    const shoppingCart = useStoreState(ShoppingCartStore).shoppingCart;
    const wishlist = useStoreState(WishlistStore).wishlist;

    const [bookCartView, setBookCartView] = useState([]);
    const [isImgLoaded, setIsImgLoaded] = useState(false);
    const [orderInfo, setOrderInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        paymentMethod: "",
        deliveryMethod: "",
        deliveryAddress: "",
        totalPrice: 0,
        books: [],
    });

    const navigate = useNavigate();

    const renderCounter = useRef(0);

    const calculateDiscount = (price, discount) => {
        const summary = price - price * (discount / 100);
        return Math.round(summary);
    };

    async function getShoppingCartBooks() {
        try {
            const bookIds = shoppingCart.map((item) => item.bookId);
            const response = await axios.post(getSeveralParticularBooksData_EP, { bookIds, requiredFields: { _id: 1, name: 1, image: 1, author: 1, price: 1, discount: 1, stock: 1 } });
            const shoppingCartBooks = response.data.map((book) => {
                const { _id } = book;
                const { amount } = shoppingCart.find((item) => item.bookId === _id);
                if (book.stock > 0) {
                    setOrderInfo((prev) => ({ ...prev, totalPrice: prev.totalPrice + book.price * amount, books: [...prev.books, { bookId: _id, amount }] }));
                }
                return { ...book, amount };
            });

            setBookCartView(shoppingCartBooks);
        } catch (error) {
            if (error?.response) showErrorNotification(error.response.data.error);
            else showErrorNotification(error);
        }
    }

    async function makeOrder() {
        try {
            const response = await axios.post(makeOrder_EP, { ...orderInfo }, authToken_header());

            showSuccessNotification("Заказ был успешно создан!");
            ShoppingCartStore.update((s) => {
                s.shoppingCart = [];
            });
            navigate("/");
        } catch (error) {
            if (error?.response) showErrorNotification(error.response.data.error);
            else showErrorNotification(error);
        }
    }

    async function getUser() {
        try {
            const response = await axios.get(getUserData_EP, authToken_header());

            setOrderInfo({ ...orderInfo, firstName: response.data.firstName, lastName: response.data.lastName, email: response.data.email, phoneNumber: response.data.phoneNumber });
        } catch (error) {
            if (error?.response) showErrorNotification(error.response.data.error);
            else showErrorNotification(error);
        }
    }

    useEffect(() => {
        if (getUserData()) {
            getUser();
        }
    }, []);

    useEffect(() => {
        if (getUserData())
            if (renderCounter.current === 0) {
                getShoppingCartBooks();
                renderCounter.current = 1;
            }
    }, [shoppingCart]);

    useEffect(() => {
        console.log(orderInfo);
    }, [orderInfo]);

    return (
        <div className="w-full flex flex-col justify-center items-center px-6">
            <div className="max-w-[1240px] w-full flex flex-col justify-center items-center mt-8 flex-wrap gap-y-8 mb-16">
                <div className="w-full justify-start">
                    <span className="text-3xl font-bold">Корзина</span>
                </div>
                {shoppingCart.length !== 0 ? (
                    <div className="flex flex-col w-full gap-y-6">
                        <div className="flex gap-10 w-full justify-start mb-20">
                            <div className="flex flex-col items-start w-full max-h-[600px] overflow-y-auto pr-4">
                                {bookCartView
                                    .sort((bookA, bookB) => bookB.stock - bookA.stock)
                                    .map((book) => (
                                        <div key={book._id} className="w-full flex py-4 border-b-2 border-gray-100 justify-between">
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
                                                                    if (book.stock > 0) setOrderInfo({ ...orderInfo, totalPrice: orderInfo.totalPrice - book.price });
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
                                                                if (book.stock > 0) setOrderInfo({ ...orderInfo, totalPrice: orderInfo.totalPrice + book.price });
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
                                                <div className="flex justify-end">
                                                    <span className={"font-medium " + (book.stock > 0 ? "text-emerald-500" : "text-gray-500")}>{book.stock > 0 ? "В наличии" : "Нет в наличии"}</span>
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
                                                            setOrderInfo({ ...orderInfo, totalPrice: orderInfo.totalPrice - book.price * book.amount });
                                                            bookCartView.splice(bookCartView.indexOf(book), 1);
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
                        </div>
                        <div className="flex flex-col w-full gap-y-12">
                            <div className="w-full justify-start">
                                <span className="text-3xl font-bold">Оформление заказа</span>
                            </div>
                            <div className="w-full justify-between flex">
                                <div className="w-full flex flex-col items-start px-4 gap-y-4">
                                    <div className="relative">
                                        <div className="absolute -left-3 border-r-[3px] h-full border-sky-500"></div>
                                        <span className="text-xl font-medium">Способ получения</span>
                                    </div>
                                    <div className="flex gap-x-3">
                                        <button
                                            onClick={() => {
                                                setOrderInfo({ ...orderInfo, deliveryMethod: "self" });
                                            }}
                                            className={
                                                "w-[200px] rounded-md animated-100 py-[6px] " +
                                                (orderInfo.deliveryMethod === "self" ? "bg-sky-400 text-white" : "bg-sky-300/40 hover:bg-sky-400 hover:text-white")
                                            }
                                        >
                                            Самовывоз
                                        </button>
                                        <button
                                            onClick={() => {
                                                setOrderInfo({ ...orderInfo, deliveryMethod: "courier" });
                                            }}
                                            className={
                                                "w-[200px] rounded-md animated-100 py-[6px] " +
                                                (orderInfo.deliveryMethod === "courier" ? "bg-sky-400 text-white" : "bg-sky-300/40 hover:bg-sky-400 hover:text-white")
                                            }
                                        >
                                            Курьером
                                        </button>
                                    </div>
                                    <div className="w-[500px]">
                                        <InputTile
                                            title={"Адрес доставки"}
                                            onChange={(e) => {
                                                setOrderInfo({ ...orderInfo, deliveryAddress: e.target.value });
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="w-[350px] flex flex-col gap-y-4">
                                    <div className="rounded-md border-2 border-gray-100 flex flex-col px-6 py-4">
                                        <div className="flex justify-between">
                                            <span className="text-lg font-semibold">Итого</span>
                                            <span className="text-lg font-semibold">{orderInfo.totalPrice + "₽"}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            makeOrder();
                                        }}
                                        className="py-2 w-full rounded-md text-white animated-100 font-semibold bg-sky-400 hover:bg-sky-500 px-4"
                                    >
                                        Оформить заказ
                                    </button>
                                </div>
                            </div>
                            <div className="w-full flex flex-col items-start px-4 gap-y-4">
                                <div className="relative">
                                    <div className="absolute -left-3 border-r-[3px] h-full border-sky-500"></div>
                                    <span className="text-xl font-medium">Способ оплаты</span>
                                </div>
                                <div className="flex gap-x-4">
                                    <div
                                        onClick={() => {
                                            setOrderInfo({ ...orderInfo, paymentMethod: "online" });
                                        }}
                                        className={
                                            "flex flex-col items-center gap-y-1 justify-center w-[240px] border-2 py-4 rounded-md cursor-pointer animated-100 px-5 " +
                                            (orderInfo.paymentMethod === "online" ? "border-sky-500" : "border-gray-200 hover:border-sky-300")
                                        }
                                    >
                                        <span className="font-medium">Картой онлайн</span>
                                        <span className="text-sm text-gray-500 text-center">Оплатить картой сейчас</span>
                                    </div>
                                    <div
                                        onClick={() => {
                                            setOrderInfo({ ...orderInfo, paymentMethod: "offline" });
                                        }}
                                        className={
                                            "flex flex-col items-center gap-y-1 justify-center w-[240px] border-2 py-4 rounded-md cursor-pointer animated-100 px-5 " +
                                            (orderInfo.paymentMethod === "offline" ? "border-sky-500" : "border-gray-200 hover:border-sky-300")
                                        }
                                    >
                                        <span className="font-medium">При получении</span>
                                        <span className="text-sm text-gray-500 text-center">Оплатить картой или наличными при получении</span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full flex flex-col items-start px-4 gap-y-4">
                                <div className="relative">
                                    <div className="absolute -left-3 border-r-[3px] h-full border-sky-500"></div>
                                    <span className="text-xl font-medium">Получатель</span>
                                </div>
                                <div className="flex flex-col w-[300px] gap-y-4">
                                    <InputTile
                                        effectProp={(value, setValue) => {
                                            const formattedValue = value.replace(/[^а-яА-ЯёЁ]/g, ""); // Удаляем все символы, кроме букв
                                            setValue(formattedValue);
                                        }}
                                        defaultValue={orderInfo.lastName}
                                        title={"Фамилия"}
                                        onChange={(e) => {
                                            setOrderInfo({ ...orderInfo, lastName: e.target.value });
                                        }}
                                    />
                                    <InputTile
                                        effectProp={(value, setValue) => {
                                            const formattedValue = value.replace(/[^а-яА-ЯёЁ]/g, ""); // Удаляем все символы, кроме букв
                                            setValue(formattedValue);
                                        }}
                                        defaultValue={orderInfo.firstName}
                                        title={"Имя"}
                                        onChange={(e) => {
                                            setOrderInfo({ ...orderInfo, firstName: e.target.value });
                                        }}
                                    />
                                    <InputTile
                                        title={"Электронная почта"}
                                        defaultValue={orderInfo.email}
                                        onChange={(e) => {
                                            setOrderInfo({ ...orderInfo, email: e.target.value });
                                        }}
                                        type={"email"}
                                    />
                                    <InputTile
                                        defaultValue={orderInfo.phoneNumber}
                                        title={"Телефон"}
                                        onChange={(e) => {
                                            setOrderInfo({ ...orderInfo, phoneNumber: e.target.value });
                                        }}
                                        // type={"tel"}
                                        // effectProp={(value, setValue) => {
                                        //     const formattedValue = value.replace(/[^\d+]/g, ""); // Удаляем все символы, кроме цифр и "+"
                                        //     if (formattedValue.length > 2 && formattedValue.length <= 15) {
                                        //         const countryCode = "+7";
                                        //         let formattedNumber = formattedValue.slice(2); // Удаляем первые два символа
                                        //         // Добавляем пробелы и дефисы в нужные позиции
                                        //         formattedNumber = formattedNumber.replace(/^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/, (_, group1, group2, group3, group4) => {
                                        //             let result = "";
                                        //             if (group1) result += `${group1} `;
                                        //             if (group2) result += `${group2} `;
                                        //             if (group3) result += `${group3}-`;
                                        //             if (group4) result += `${group4}-`;
                                        //             return result;
                                        //         });
                                        //         // Удаляем лишние пробелы, дефисы и добавляем "+7"
                                        //         formattedNumber = formattedNumber.replace(/[\s-]+$/, "");
                                        //         setValue(`${countryCode} ${formattedNumber}`);
                                        //     }
                                        // }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="w-full flex justify-center">
                        <span className="text-2xl font-medium">В корзине пусто :(</span>
                    </div>
                )}
            </div>
        </div>
    );
}
