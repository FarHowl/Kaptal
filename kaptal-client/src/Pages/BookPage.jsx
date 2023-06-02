import { useEffect, React, useState, useLayoutEffect } from "react";
import IconComponent from "../Components/Icons/IconComponent";
import WishesIcon from "../Components/Icons/WishesIcon";
import LoadingComponent from "../Components/UI/LoadingComponent";
import { addReview_EP, getBookData_EP, getBookReviews_EP } from "../Utils/API";
import { authToken_header } from "../Utils/LocalStorageUtils";
import { useParams } from "react-router-dom";
import axios from "axios";
import InputTile from "../Components/UI/InputTile";
import CrossIcon from "../Components/Icons/CrossIcon";

export default function BookPage() {
    const params = useParams();
    const [isImgLoaded, setIsImgLoaded] = useState(false);
    const [bookData, setBookData] = useState({});
    const [reviewsView, setReviewsView] = useState([]);
    const [isAddReviewOpened, setIsAddReviewOpened] = useState(false);

    async function getBookData() {
        try {
            const query = `?bookId=${params.bookId}`;
            const res = await axios.get(getBookData_EP + query);

            setBookData(res.data);
        } catch (error) {
            if (error?.response) console.log(error.response.data.error);
            else console.log(error);
        }
    }

    async function getBookReviews() {
        try {
            const query = `?bookId=${params.bookId}`;
            const res = await axios.get(getBookReviews_EP + query);

            let a = [];
            for (const review of res.data) {
                a.push(<ReviewTile key={review._id} review={review} />);
            }
            setReviewsView(a);
        } catch (error) {
            if (error?.response) console.log(error.response.data.error);
            else console.log(error);
        }
    }

    function calculateDiscount(price, discount) {
        let summary = price - price * (discount / 100);
        return Math.round(summary);
    }

    useLayoutEffect(() => {
        getBookData();
        getBookReviews();
    }, []);

    return (
        <div className="flex flex-col items-center w-full gap-y-10 pt-10 py-10 max-w-[1200px]">
            <div className="flex justify-between w-full gap-20">
                <div className="flex flex-col w-[800px]">
                    <div className="flex justify-center gap-14">
                        <div className="w-[300px] h-[450px] relative">
                            {isImgLoaded ? <></> : <LoadingComponent customStyle={"absolute inset-0 flex justify-center items-center bg-white z-5"} />}
                            <img
                                onLoad={() => {
                                    setIsImgLoaded(true);
                                }}
                                className="object-cover w-full h-full"
                                src={bookData.image}
                                alt=""
                            />
                        </div>
                        <div className="flex flex-col items-center w-[500px]">
                            <div className="w-full flex justify-between">
                                <span className="text-2xl font-semibold">{bookData.name}</span>
                            </div>
                            <div className="w-full flex justify-start mt-1">
                                <button className="text-sky-600 hover:text-sky-800 animated-100 font-medium">{bookData.author}</button>
                            </div>
                            <div className="flex w-full gap-x-2 items-center justify-start mt-2">
                                <span>{bookData.rating}</span>
                                <span className="text-gray-500">({bookData.ratingCount})</span>
                                <button className="text-sky-600 hover:text-sky-800 animated-100">Оценить</button>
                            </div>
                            <div className="w-full flex flex-col gap-y-4 mt-6">
                                <div className="flex w-full">
                                    <div className="w-[50%] flex flex-shrink-0">
                                        <span className="text-gray-500">Издательство</span>
                                    </div>
                                    <button className="text-sky-600 hover:text-sky-800 animated-100">{bookData.publisher}</button>
                                </div>
                                <div className="flex w-full">
                                    <div className="w-[50%] flex flex-shrink-0">
                                        <span className="text-gray-500">Серия</span>
                                    </div>
                                    <button className="text-sky-600 hover:text-sky-800 animated-100 text-left">{bookData.series}</button>
                                </div>
                                <div className="flex w-full">
                                    <div className="w-[50%] flex flex-shrink-0">
                                        <span className="text-gray-500">Год издания</span>
                                    </div>
                                    <span>{bookData.year}</span>
                                </div>
                                <div className="flex w-full">
                                    <div className="w-[50%] flex flex-shrink-0">
                                        <span className="text-gray-500">ISBN</span>
                                    </div>
                                    <span>{bookData.ISBN}</span>
                                </div>
                                <div className="flex w-full">
                                    <div className="w-[50%] flex flex-shrink-0">
                                        <span className="text-gray-500">Количество страниц</span>
                                    </div>
                                    <span>{bookData.pagesCount}</span>
                                </div>
                                <div className="flex w-full">
                                    <div className="w-[50%] flex flex-shrink-0">
                                        <span className="text-gray-500">Размер</span>
                                    </div>
                                    <span>{bookData.size}</span>
                                </div>
                                <div className="flex w-full">
                                    <div className="w-[50%] flex flex-shrink-0">
                                        <span className="text-gray-500">Тип обложки</span>
                                    </div>
                                    <span>{bookData.coverType}</span>
                                </div>
                                <div className="flex w-full">
                                    <div className="w-[50%] flex flex-shrink-0">
                                        <span className="text-gray-500">Вес</span>
                                    </div>
                                    <span>{bookData.weight}</span>
                                </div>
                                <div className="flex w-full">
                                    <div className="w-[50%] flex flex-shrink-0">
                                        <span className="text-gray-500">Возрастные ограничения</span>
                                    </div>
                                    <span>{bookData.ageLimit}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-14 leading-7 mb-6">{bookData.annotation}</div>
                </div>
                <div className="w-[270px] flex flex-col">
                    <div className="flex flex-col shadow-lg w-full px-4 py-4 gap-1">
                        <div className="w-full mb-1">
                            <span className={"font-light " + (bookData.amount ? "text-teal-500" : "text-neutral-500")}>{bookData.amount ? "В наличии" : "Нет в наличии"}</span>
                        </div>
                        {bookData.discount === 0 ? (
                            <div className="fle px-20w-full gap-10 items-center">
                                <span className="font-bold text-xl">{100 + "₽"}</span>
                            </div>
                        ) : (
                            <div className="flex w-full gap-10 items-center">
                                <span className="font-bold text-red-500 text-xl">{calculateDiscount(bookData.price, bookData.discount) + "₽"}</span>
                                <span className="font-extralight line-through text-slate-600">{bookData.price + "₽"}</span>
                            </div>
                        )}
                        <div className="mt-2">
                            <div className="w-full flex justify-between px-4">
                                <button className={"py-2 px-10  rounded-md text-white animated-100 font-semibold " + (true ? "bg-sky-400 hover:bg-sky-500" : "bg-slate-400 pointer-events-none")}>
                                    Купить
                                </button>
                                <IconComponent
                                    Icon={WishesIcon}
                                    size={20}
                                    color={"#3BA5ED"}
                                    hoveredColor={"#1b90e0"}
                                    animation={"animated-100"}
                                    buttonStyle={"w-[40px] h-[40px] flex justify-center items-center bg-slate-200 animated-100 rounded-md hover:bg-slate-300"}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex w-full justify-start">
                <div className="flex flex-col gap-2">
                    <span className="text-3xl font-bold">Отзывы</span>
                    <button
                        onClick={() => {
                            setIsAddReviewOpened(true);
                        }}
                        className={"py-2 px-10  rounded-md text-white animated-100 font-semibold " + (true ? "bg-sky-400 hover:bg-sky-500" : "bg-slate-400 pointer-events-none")}
                    >
                        Написать отзыв
                    </button>
                </div>
            </div>
            <div className="flex w-full justify-start">
                <div className="flex justify-center gap-6">
                    <div className="flex flex-col items-start gap-y-10">{reviewsView}</div>
                    <div className="w-[100px] flex flex-col">
                        <div className="flex justify-start items-center gap-x-3 sticky top-[90px]">
                            <div className="border-l-2 border-sky-500 h-full"></div>
                            <div className="flex flex-col">
                                <span className="text-neutral-500">Всего</span>
                                <span className="text-3xl">{reviewsView.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isAddReviewOpened ? <AddReviewPopUp setIsAddReviewOpened={setIsAddReviewOpened} /> : <></>}
        </div>
    );
}

function AddReviewPopUp({ setIsAddReviewOpened }) {
    const [reviewInfo, setReviewInfo] = useState({});
    const params = useParams();

    async function addReview() {
        try {
            const res = await axios.post(
                addReview_EP,
                {
                    bookId: params.bookId,
                    title: reviewInfo.title,
                    text: reviewInfo?.text,
                    pros: reviewInfo?.pros,
                    cons: reviewInfo?.cons,
                    author: reviewInfo.author,
                    rating: reviewInfo.rating,
                },
                authToken_header()
            );
        } catch (error) {
            if (error?.response) console.log(error.response.data.error);
            else console.log(error);
        }
    }

    return (
        <div className="fixed z-20 inset-0 bg-black/50 flex justify-center items-center overflow-y-auto">
            <div className="bg-white rounded-md flex flex-col w-[400px] pb-10 pt-4 px-8">
                <div className="w-full flex justify-between items-center mb-5">
                    <span className="text-xl font-medium">Оcтавить отзыв</span>
                    <IconComponent
                        onClick={() => {
                            setIsAddReviewOpened(false);
                        }}
                        Icon={CrossIcon}
                        size={20}
                        color={"#3BA5ED"}
                        hoveredColor={"#1b90e0"}
                        animation={"animated-100"}
                        buttonStyle={"w-[40px] h-[40px] flex justify-center items-center bg-slate-200 animated-100 rounded-md hover:bg-slate-300"}
                    />
                </div>
                <div className="flex flex-col gap-y-4">
                    <InputTile
                        title={"Заголовок"}
                        onChange={(e) => {
                            setReviewInfo({ ...reviewInfo, title: e.target.value });
                        }}
                    />
                    <InputTile
                        title={"Комментарий"}
                        onChange={(e) => {
                            setReviewInfo({ ...reviewInfo, text: e.target.value });
                        }}
                    />
                    <InputTile
                        title={"Плюсы"}
                        onChange={(e) => {
                            setReviewInfo({ ...reviewInfo, pros: e.target.value });
                        }}
                    />
                    <InputTile
                        title={"Минусы"}
                        onChange={(e) => {
                            setReviewInfo({ ...reviewInfo, cons: e.target.value });
                        }}
                    />
                    <InputTile
                        title={"Имя пользователя"}
                        onChange={(e) => {
                            setReviewInfo({ ...reviewInfo, author: e.target.value });
                        }}
                    />
                </div>
                <button
                    onClick={() => {
                        addReview();
                    }}
                    className={"py-3 px-10 mt-6 rounded-md text-white animated-100 font-semibold " + (true ? "bg-sky-400 hover:bg-sky-500" : "bg-slate-400 pointer-events-none")}
                >
                    Опубликовать
                </button>
            </div>
        </div>
    );
}

function ReviewTile({ review }) {
    return (
        <div className={"w-[700px] rounded-lg flex flex-col items-center px-6 py-6 gap-4 " + (review.rating >= 4 ? "bg-green-100/70" : review.rating === 3 ? "bg-neutral-100/70" : "bg-red-100/70")}>
            <div className="flex w-full justify-between">
                <span className="text-lg text-gray-600">{review.author}</span>
                <div className="flex gap-2">
                    <span className="text-gray-600 font-light">{review.publicationDate}</span>
                    <span>{review.bookRating}</span>
                </div>
            </div>
            <div className="w-full flex justify-start">
                <span className="text-xl font-semibold">{review.title}</span>
            </div>
            <div className="w-full">
                <span className="font-light tracking-wide">{review.text}</span>
            </div>
            <div className="w-full flex justify-end">
                <div className="flex justify-center gap-x-2">
                    <button className="flex justify-center gap-2 rounded-full bg-gray-300/20 font-medium px-4 py-2 hover:scale-105 hover:bg-gray-400/20 animated-100">
                        <span>Полезно</span>
                        <span className="text-neutral-500">{review.likes}</span>
                    </button>
                    <button className="flex justify-center gap-2 rounded-full bg-gray-300/20 font-medium px-4 py-2 hover:scale-105 hover:bg-gray-400/20 animated-100">
                        <span>Нет</span>
                        <span className="text-neutral-500">{review.dislikes}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
