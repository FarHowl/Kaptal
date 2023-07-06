import { useEffect, React, useState, useLayoutEffect } from "react";
import IconComponent from "../Components/Icons/IconComponent";
import WishesIcon from "../Components/Icons/WishesIcon";
import LoadingComponent from "../Components/UI/LoadingComponent";
import { addRating_EP, addReview_EP, getBookData_EP, getBookImage_EP, getBookRating_EP, getBookReviews_EP, rateReview_EP } from "../Utils/API";
import { authToken_header } from "../Utils/LocalStorageUtils";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import InputTile from "../Components/UI/InputTile";
import CrossIcon from "../Components/Icons/CrossIcon";
import RatingStarIcon from "../Components/Icons/RatingStarIcon";
import { showErrorNotification } from "../StoreState/NotificationStore";
import { addToCartAction } from "../StoreState/ShoppingCartStore";

export default function BookPage() {
    const params = useParams();
    const [isImgLoaded, setIsImgLoaded] = useState(false);
    const [bookData, setBookData] = useState({});
    const [reviewsView, setReviewsView] = useState([]);
    const [isAddReviewOpened, setIsAddReviewOpened] = useState(false);
    const [isAddRatingOpened, setIsAddRatingOpened] = useState(false);

    async function getBookData() {
        try {
            const query = `?bookId=${params.bookId}`;

            const res1 = axios.get(getBookData_EP + query);
            const res2 = axios.get(getBookReviews_EP + query);
            const res3 = axios.get(getBookRating_EP + query);
            const res = await axios.all([res1, res2, res3]);

            let ratingSum = 0;
            let ratingCount = 0;
            let a = [];
            for (const review of res[1].data) {
                a.push(<ReviewTile key={review._id} review={review} />);
                ratingSum += review.bookRating;
            }
            ratingCount += res[1].data.length;

            for (const rating of res[2].data) {
                ratingSum += rating.bookRating;
                ratingCount++;
            }

            setBookData({ ...res[0].data, bookRating: ratingSum / ratingCount, ratingCount });
            setReviewsView(a);
        } catch (error) {
            if (error?.response) showErrorNotification(error.response.data.error);
            else showErrorNotification(error);
        }
    }

    function calculateDiscount(price, discount) {
        let summary = price - price * (discount / 100);
        return Math.round(summary);
    }

    useLayoutEffect(() => {
        getBookData();
    }, []);

    return (
        <div className="w-full flex flex-col justify-center items-center px-6">
            <div className="max-w-[1240px] w-full flex justify-between mt-8 flex-wrap gap-y-16">
                <div className="flex flex-col w-[800px]">
                    <div className="flex justify-center gap-14">
                        <div className="w-[300px] h-[450px] relative">
                            {isImgLoaded ? <></> : <LoadingComponent customStyle={"absolute inset-0 flex justify-center items-center bg-white z-5"} />}
                            {bookData?.image ? (
                                <img
                                    onLoad={() => {
                                        setIsImgLoaded(true);
                                    }}
                                    className="object-cover w-full h-full"
                                    src={getBookImage_EP + `?imgName=${bookData.image}`}
                                    alt=""
                                />
                            ) : (
                                <></>
                            )}
                        </div>
                        <div className="flex flex-col items-center w-[500px]">
                            <div className="w-full flex justify-between">
                                <span className="text-2xl font-semibold">{bookData.name}</span>
                            </div>
                            <div className="w-full flex justify-start mt-1">
                                <button className="text-sky-600 hover:text-sky-800 animated-100 font-medium">{bookData.author}</button>
                            </div>
                            <div className="flex w-full gap-x-2 items-center justify-start mt-2">
                                <div className="flex ">
                                    <IconComponent
                                        Icon={RatingStarIcon}
                                        size={18}
                                        color={"#C0C0C0"}
                                        hoveredUntil={bookData.bookRating >= 1}
                                        hoveredColor={"#ffc117"}
                                        buttonStyle={"flex justify-center items-center pointer-events-none"}
                                    />
                                    <IconComponent
                                        Icon={RatingStarIcon}
                                        size={18}
                                        color={"#C0C0C0"}
                                        hoveredUntil={bookData.bookRating >= 2}
                                        hoveredColor={"#ffc117"}
                                        buttonStyle={"flex justify-center items-center pointer-events-none"}
                                    />
                                    <IconComponent
                                        Icon={RatingStarIcon}
                                        size={18}
                                        color={"#C0C0C0"}
                                        hoveredUntil={bookData.bookRating >= 3}
                                        hoveredColor={"#ffc117"}
                                        buttonStyle={"flex justify-center items-center pointer-events-none"}
                                    />
                                    <IconComponent
                                        Icon={RatingStarIcon}
                                        size={18}
                                        color={"#C0C0C0"}
                                        hoveredUntil={bookData.bookRating >= 4}
                                        hoveredColor={"#ffc117"}
                                        buttonStyle={"flex justify-center items-center pointer-events-none"}
                                    />
                                    <IconComponent
                                        Icon={RatingStarIcon}
                                        size={18}
                                        color={"#C0C0C0"}
                                        hoveredUntil={bookData.bookRating >= 5}
                                        hoveredColor={"#ffc117"}
                                        buttonStyle={"flex justify-center items-center pointer-events-none"}
                                    />
                                </div>
                                <span className="text-gray-500">({bookData.ratingCount})</span>
                                <button
                                    onClick={() => {
                                        setIsAddRatingOpened(true);
                                    }}
                                    className="text-sky-600 hover:text-sky-800 animated-100"
                                >
                                    Оценить
                                </button>
                            </div>
                            <div className="w-full flex flex-col gap-y-3 mt-6">
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
                                    <span>{bookData.weight + " г."}</span>
                                </div>
                                <div className="flex w-full">
                                    <div className="w-[50%] flex flex-shrink-0">
                                        <span className="text-gray-500">Возрастные ограничения</span>
                                    </div>
                                    <span>{bookData.ageLimit + "+"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-14 leading-7 mb-6">{bookData.annotation}</div>
                </div>
                <div className="w-[270px] flex flex-col">
                    <div className="flex flex-col shadow-lg w-full px-4 py-4 gap-1">
                        <div className="w-full mb-1">
                            <span className={"font-light " + (bookData.stock ? "text-teal-500" : "text-neutral-500")}>{bookData.stock ? "В наличии" : "Нет в наличии"}</span>
                        </div>
                        {bookData.discount === 0 ? (
                            <div className="fle px-20w-full gap-10 items-center">
                                <span className="font-bold text-xl">{bookData.price + "₽"}</span>
                            </div>
                        ) : (
                            <div className="flex w-full gap-10 items-center">
                                <span className="font-bold text-red-500 text-xl">{calculateDiscount(bookData.price, bookData.discount) + "₽"}</span>
                                <span className="font-extralight line-through text-slate-600">{bookData.price + "₽"}</span>
                            </div>
                        )}
                        <div className="mt-2">
                            <div className="w-full flex justify-between px-4">
                                <button
                                    onClick={() => {
                                        addToCartAction(bookData);
                                    }}
                                    className={"py-2 px-10  rounded-md text-white animated-100 font-semibold " + (true ? "bg-sky-400 hover:bg-sky-500" : "bg-slate-400 pointer-events-none")}
                                >
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
            <div className="flex w-full justify-start gap-x-16 max-w-[1240px] mt-4">
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
                {reviewsView.length === 0 ? (
                    <div className="w-[100px] flex flex-col">
                        <div className="flex justify-start items-center gap-x-3 sticky top-[90px]">
                            <div className="border-l-2 border-sky-500 h-full"></div>
                            <div className="flex flex-col">
                                <span className="text-neutral-500">Всего</span>
                                <span className="text-3xl">{reviewsView.length}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <></>
                )}
            </div>
            <div className="flex w-full justify-start max-w-[1240px] mt-8">
                <div className="flex justify-center gap-6">
                    <div className="flex flex-col items-start gap-y-10">{reviewsView}</div>
                    {reviewsView.length !== 0 ? (
                        <div className="w-[100px] flex flex-col">
                            <div className="flex justify-start items-center gap-x-3 sticky top-[90px]">
                                <div className="border-l-2 border-sky-500 h-full"></div>
                                <div className="flex flex-col">
                                    <span className="text-neutral-500">Всего</span>
                                    <span className="text-3xl">{reviewsView.length}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
            {isAddReviewOpened ? <AddFeedbackPopUp setIsAddReviewOpened={setIsAddReviewOpened} /> : isAddRatingOpened ? <AddFeedbackPopUp setIsAddRatingOpened={setIsAddRatingOpened} /> : <></>}
        </div>
    );
}

function AddFeedbackPopUp({ setIsAddReviewOpened, setIsAddRatingOpened }) {
    const [feedbackInfo, setFeedbackInfo] = useState({});
    const params = useParams();
    const navigate = useNavigate();

    async function addRating() {
        try {
            const res = await axios.post(
                addRating_EP,
                {
                    bookId: params.bookId,
                    bookRating: feedbackInfo.bookRating,
                },
                authToken_header()
            );

            setIsAddRatingOpened(false);
            window.location.reload();
        } catch (error) {
            if (error?.response) showErrorNotification(error.response.data.error);
            else showErrorNotification(error);
        }
    }

    async function addReview() {
        try {
            const res = await axios.post(
                addReview_EP,
                {
                    bookId: params.bookId,
                    title: feedbackInfo.title,
                    text: feedbackInfo?.text,
                    pros: feedbackInfo?.pros,
                    cons: feedbackInfo?.cons,
                    author: feedbackInfo.author,
                    bookRating: feedbackInfo.bookRating,
                },
                authToken_header()
            );

            setIsAddReviewOpened(false);
            window.location.reload();
        } catch (error) {
            if (error?.response) showErrorNotification(error.response.data.error);
            else showErrorNotification(error);
        }
    }

    return (
        <div className="fixed z-20 inset-0 bg-black/50 flex justify-center items-center overflow-y-auto">
            <div className="bg-white rounded-md flex flex-col w-[400px] pb-10 pt-4 px-8">
                <div className="w-full flex justify-between items-center">
                    <span className="text-xl font-medium">{setIsAddRatingOpened ? "Ваша оценка" : "Оставить отзыв"}</span>
                    <IconComponent
                        onClick={() => {
                            setIsAddRatingOpened ? setIsAddRatingOpened(false) : setIsAddReviewOpened(false);
                        }}
                        Icon={CrossIcon}
                        size={20}
                        color={"#3BA5ED"}
                        hoveredColor={"#1b90e0"}
                        animation={"animated-100"}
                        buttonStyle={"w-[40px] h-[40px] flex justify-center items-center bg-slate-200 animated-100 rounded-md hover:bg-slate-300"}
                    />
                </div>
                <div className="flex -ml-[6px]">
                    <IconComponent
                        onClick={() => {
                            setFeedbackInfo({ ...feedbackInfo, bookRating: 1 });
                        }}
                        Icon={RatingStarIcon}
                        size={24}
                        color={"#C0C0C0"}
                        hoveredUntil={feedbackInfo.bookRating >= 1}
                        hoveredColor={"#ffc117"}
                        animation={"animated-100"}
                        buttonStyle={"w-[35px] h-[30px] flex justify-center items-center"}
                    />
                    <IconComponent
                        onClick={() => {
                            setFeedbackInfo({ ...feedbackInfo, bookRating: 2 });
                        }}
                        Icon={RatingStarIcon}
                        size={24}
                        color={"#C0C0C0"}
                        hoveredUntil={feedbackInfo.bookRating >= 2}
                        hoveredColor={"#ffc117"}
                        animation={"animated-100"}
                        buttonStyle={"w-[35px] h-[30px] flex justify-center items-center"}
                    />
                    <IconComponent
                        onClick={() => {
                            setFeedbackInfo({ ...feedbackInfo, bookRating: 3 });
                        }}
                        Icon={RatingStarIcon}
                        size={24}
                        color={"#C0C0C0"}
                        hoveredUntil={feedbackInfo.bookRating >= 3}
                        hoveredColor={"#ffc117"}
                        animation={"animated-100"}
                        buttonStyle={"w-[35px] h-[30px] flex justify-center items-center"}
                    />
                    <IconComponent
                        onClick={() => {
                            setFeedbackInfo({ ...feedbackInfo, bookRating: 4 });
                        }}
                        Icon={RatingStarIcon}
                        size={24}
                        color={"#C0C0C0"}
                        hoveredUntil={feedbackInfo.bookRating >= 4}
                        hoveredColor={"#ffc117"}
                        animation={"animated-100"}
                        buttonStyle={"w-[35px] h-[30px] flex justify-center items-center"}
                    />
                    <IconComponent
                        onClick={() => {
                            setFeedbackInfo({ ...feedbackInfo, bookRating: 5 });
                        }}
                        Icon={RatingStarIcon}
                        size={24}
                        color={"#C0C0C0"}
                        hoveredUntil={feedbackInfo.bookRating >= 5}
                        hoveredColor={"#ffc117"}
                        animation={"animated-100"}
                        buttonStyle={"w-[35px] h-[30px] flex justify-center items-center"}
                    />
                </div>
                {setIsAddReviewOpened ? (
                    <div className="flex flex-col gap-y-4 mt-4">
                        <InputTile
                            title={"Заголовок"}
                            onChange={(e) => {
                                setFeedbackInfo({ ...feedbackInfo, title: e.target.value });
                            }}
                        />
                        <InputTile
                            title={"Комментарий"}
                            onChange={(e) => {
                                setFeedbackInfo({ ...feedbackInfo, text: e.target.value });
                            }}
                        />
                        <InputTile
                            title={"Плюсы"}
                            onChange={(e) => {
                                setFeedbackInfo({ ...feedbackInfo, pros: e.target.value });
                            }}
                        />
                        <InputTile
                            title={"Минусы"}
                            onChange={(e) => {
                                setFeedbackInfo({ ...feedbackInfo, cons: e.target.value });
                            }}
                        />
                        <InputTile
                            title={"Имя пользователя"}
                            onChange={(e) => {
                                setFeedbackInfo({ ...feedbackInfo, author: e.target.value });
                            }}
                        />
                    </div>
                ) : (
                    <></>
                )}
                <button
                    onClick={() => {
                        setIsAddRatingOpened ? addRating() : addReview();
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
    const [reviewRating, setReviewRating] = useState({ likes: 0, dislikes: 0 });

    async function rateReview(isReviewUseful) {
        try {
            const res = await axios.post(rateReview_EP, { reviewId: review._id, isReviewUseful }, authToken_header());
            console.log(res);
        } catch (error) {
            if (error?.response) showErrorNotification(error.response.data.error);
            else showErrorNotification(error);
        }
    }

    useEffect(() => {
        if (review.reviewRating) {
            for (const rating of review.reviewRating) {
                if (rating.isReviewUseful === true) {
                    setReviewRating((prevReviewRating) => ({
                        ...prevReviewRating,
                        likes: prevReviewRating.likes + 1,
                    }));
                } else {
                    setReviewRating((prevReviewRating) => ({
                        ...prevReviewRating,
                        dislikes: prevReviewRating.dislikes + 1,
                    }));
                }
            }
        }
    }, []);

    return (
        <div
            className={
                "w-[700px] rounded-lg flex flex-col items-center px-6 py-6 gap-4 " + (review.bookRating >= 4 ? "bg-green-100/70" : review.bookRating === 3 ? "bg-neutral-100/70" : "bg-red-100/70")
            }
        >
            <div className="flex w-full justify-between">
                <span className="text-lg text-gray-600">{review.author}</span>
                <div className="flex gap-2 items-center">
                    <div className="flex">
                        <IconComponent Icon={RatingStarIcon} size={18} color={"#C0C0C0"} hoveredUntil={review.bookRating >= 1} hoveredColor={"#ffc117"} buttonStyle={"pointer-events-none"} />
                        <IconComponent Icon={RatingStarIcon} size={18} color={"#C0C0C0"} hoveredUntil={review.bookRating >= 2} hoveredColor={"#ffc117"} buttonStyle={"pointer-events-none"} />
                        <IconComponent Icon={RatingStarIcon} size={18} color={"#C0C0C0"} hoveredUntil={review.bookRating >= 3} hoveredColor={"#ffc117"} buttonStyle={"pointer-events-none"} />
                        <IconComponent Icon={RatingStarIcon} size={18} color={"#C0C0C0"} hoveredUntil={review.bookRating >= 4} hoveredColor={"#ffc117"} buttonStyle={"pointer-events-none"} />
                        <IconComponent Icon={RatingStarIcon} size={18} color={"#C0C0C0"} hoveredUntil={review.bookRating >= 5} hoveredColor={"#ffc117"} buttonStyle={"pointer-events-none"} />
                    </div>
                    <span className="text-gray-600 font-light pt-1">{review.publicationDate}</span>
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
                    <button
                        onClick={() => {
                            rateReview(true);
                        }}
                        className="flex justify-center gap-2 rounded-full bg-gray-300/20 font-medium px-4 py-2 hover:scale-105 hover:bg-gray-400/20 animated-100"
                    >
                        <span>Полезно</span>
                        <span className="text-neutral-500">{reviewRating.likes}</span>
                    </button>
                    <button
                        onClick={() => {
                            rateReview(false);
                        }}
                        className="flex justify-center gap-2 rounded-full bg-gray-300/20 font-medium px-4 py-2 hover:scale-105 hover:bg-gray-400/20 animated-100"
                    >
                        <span>Нет</span>
                        <span className="text-neutral-500">{reviewRating.dislikes}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
