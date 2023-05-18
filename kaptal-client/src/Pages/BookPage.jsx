import { useEffect, React, useState } from "react";
import IconComponent from "../Components/Icons/IconComponent";
import WishesIcon from "../Components/Icons/WishesIcon";
import LoadingComponent from "../Components/UI/LoadingComponent";
import { getBookData_EP } from "../Utils/API";
import { authToken_header } from "../Utils/LocalStorageUtils";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function BookPage() {
    const params = useParams();
    const [isImgLoaded, setIsImgLoaded] = useState(false);
    const [bookData, setBookData] = useState({});
    const [reviewsView, setReviewsView] = useState();

    const book = {
        name: "Любовь по залету",
        author: "Лина Филимонова",
        genres: ["Fantasy", "Adventure"],
        isAvailable: false,
        coverType: "Мягкий переплет",
        publisher: "АСТ",
        series: "Звездная коллекция романов о любви",
        language: "Русский",
        size: "16.5x11.3x2.3",
        weight: 158,
        ISBN: "978-5-17-127247-0",
        pagesCount: 320,
        ageLimit: 18,
        year: 2023,
        circulation: 3000,
        annotation:
            "Аня хотела от него только одного - ребенка. Потому что часики тикают, нормальных парней все равно нет, а этот… просто настоящий мачо! Она уверена в том, что не любит Демида и вовсе не собирается за него замуж, ведь самое ценное в нем - его прекрасные гены, которые ей и нужны. Демид же вовсе не против развлечься, он и не думает о серьезных отношениях, в его жизни и так было немало беременных, мечтающих затащить его в загс и все пошли лесом. Так почему бы не провести время с удовольствием? Однако судьба приготовила свои сюрпризы для них обоих...",
        reviews: [],
        rating: 4,
        ratingCount: 33,
        discount: 10,
        price: 270,
        image: "https://cdn.img-gorod.ru/310x500/nomenclature/29/193/2919342.jpg",
        category: "61824b6c77a53d0015fe5279",
        collections: ["61824b6c77a53d0015fe527a", "61824b6c77a53d0015fe527b"],
    };

    async function getBookData() {
        try {
            const res = await axios.get(getBookData_EP, authToken_header());

            let r = [];
            for (const i of res.reviews) {
                r.push(<ReviewTile key={i._id} review={i} />);
            }

            setReviewsView(r);
        } catch (error) {
            if (error?.response) console.log(error.response.data.error);
            else console.log(error);
        }
    }

    function calculateDiscount(price, discount) {
        let summary = price - price * (discount / 100);
        return Math.round(summary);
    }

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
                                src={book.image}
                                alt=""
                            />
                        </div>
                        <div className="flex flex-col items-center w-[500px]">
                            <div className="w-full flex justify-between">
                                <span className="text-2xl font-semibold">Любовь по залету</span>
                            </div>
                            <div className="w-full flex justify-start mt-1">
                                <button className="text-sky-600 hover:text-sky-800 animated-100 font-medium">{book.author}</button>
                            </div>
                            <div className="flex w-full gap-x-2 items-center justify-start mt-2">
                                <span>{book.rating}</span>
                                <span className="text-gray-500">({book.ratingCount})</span>
                                <button className="text-sky-600 hover:text-sky-800 animated-100">Оценить</button>
                            </div>
                            <div className="w-full flex flex-col gap-y-4 mt-6">
                                <div className="flex w-full">
                                    <div className="w-[50%] flex flex-shrink-0">
                                        <span className="text-gray-500">Издательство</span>
                                    </div>
                                    <button className="text-sky-600 hover:text-sky-800 animated-100">{book.publisher}</button>
                                </div>
                                <div className="flex w-full">
                                    <div className="w-[50%] flex flex-shrink-0">
                                        <span className="text-gray-500">Серия</span>
                                    </div>
                                    <button className="text-sky-600 hover:text-sky-800 animated-100 text-left">{book.series}</button>
                                </div>
                                <div className="flex w-full">
                                    <div className="w-[50%] flex flex-shrink-0">
                                        <span className="text-gray-500">Год издания</span>
                                    </div>
                                    <span>{book.year}</span>
                                </div>
                                <div className="flex w-full">
                                    <div className="w-[50%] flex flex-shrink-0">
                                        <span className="text-gray-500">ISBN</span>
                                    </div>
                                    <span>{book.ISBN}</span>
                                </div>
                                <div className="flex w-full">
                                    <div className="w-[50%] flex flex-shrink-0">
                                        <span className="text-gray-500">Количество страниц</span>
                                    </div>
                                    <span>{book.pagesCount}</span>
                                </div>
                                <div className="flex w-full">
                                    <div className="w-[50%] flex flex-shrink-0">
                                        <span className="text-gray-500">Размер</span>
                                    </div>
                                    <span>{book.size}</span>
                                </div>
                                <div className="flex w-full">
                                    <div className="w-[50%] flex flex-shrink-0">
                                        <span className="text-gray-500">Тип обложки</span>
                                    </div>
                                    <span>{book.coverType}</span>
                                </div>
                                <div className="flex w-full">
                                    <div className="w-[50%] flex flex-shrink-0">
                                        <span className="text-gray-500">Вес</span>
                                    </div>
                                    <span>{book.weight}</span>
                                </div>
                                <div className="flex w-full">
                                    <div className="w-[50%] flex flex-shrink-0">
                                        <span className="text-gray-500">Возрастные ограничения</span>
                                    </div>
                                    <span>{book.ageLimit}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-14 leading-7 mb-6">{book.annotation}</div>
                </div>
                <div className="w-[270px] flex flex-col">
                    <div className="flex flex-col shadow-lg w-full px-4 py-4 gap-1">
                        <div className="w-full mb-1">
                            <span className={"font-light " + (book.isAvailable ? "text-teal-500" : "text-neutral-500")}>{book.isAvailable ? "В наличии" : "Нет в наличии"}</span>
                        </div>
                        {book.discount === 0 ? (
                            <div className="fle px-20w-full gap-10 items-center">
                                <span className="font-bold text-xl">{100 + "₽"}</span>
                            </div>
                        ) : (
                            <div className="flex w-full gap-10 items-center">
                                <span className="font-bold text-red-500 text-xl">{calculateDiscount(book.price, book.discount) + "₽"}</span>
                                <span className="font-extralight line-through text-slate-600">{book.price + "₽"}</span>
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
                <span className="text-3xl font-bold">Отзывы</span>
            </div>
            <div className="flex w-full justify-start">
                <div className="flex justify-center gap-6">
                    <div className="flex flex-col items-start gap-y-10">
                        {reviewsView}
                        <ReviewTile />
                        <ReviewTile />
                        <ReviewTile />
                        <ReviewTile />
                        <ReviewTile />
                        <ReviewTile />
                        <ReviewTile />
                        <ReviewTile />
                        <ReviewTile />
                        <ReviewTile />
                        <ReviewTile />
                    </div>
                    <div className="w-[100px] flex flex-col">
                        <div className="flex justify-start items-center gap-x-3 sticky top-[90px]">
                            <div className="border-l-2 border-sky-500 h-full"></div>
                            <div className="flex flex-col">
                                <span className="text-neutral-500">Всего</span>
                                <span className="text-3xl">33</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ReviewTile() {
    const review = {
        text: "Еще одна забавная история с чувством юмора. Как говорится: Не везет, да несчастье помогло. Встреча с Аней переворачивает все внутри Демида. Да, и мечты сбываются. В эпилоге -восхитительная гармония: Демид и Аня любят друг друга, гордятся своим ребенком, а великий змей торжествует. Серафимы забавляются собственными желаниями и монологами. И он достиг своей цели раньше, чем Жестянщик, со своими двумя живыми детьми. Большое спасибо",
        title: "Восхитительно! Незабываемая история любви по залету!",
        rating: 5,
        author: "Ксения",
        publicationDate: "21.08.2022",
        likes: 3,
        dislikes: 10,
    };

    return (
        <div className={"w-[700px] rounded-lg flex flex-col items-center px-6 py-6 gap-4 " + (review.rating >= 4 ? "bg-green-100/70" : review.rating === 3 ? "bg-neutral-100/70" : "bg-red-100/70")}>
            <div className="flex w-full justify-between">
                <span className="text-lg text-gray-600">{review.author}</span>
                <div className="flex gap-2">
                    <span className="text-gray-600 font-light">{review.publicationDate}</span>
                    <span>{review.rating}</span>
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
