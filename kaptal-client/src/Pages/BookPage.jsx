import { useEffect, React } from "react";
import IconComponent from "../Components/Icons/IconComponent";
import WishesIcon from "../Components/Icons/WishesIcon";
import { useParams } from "react-router-dom";

export default function BookPage() {
    const params = useParams();

    const book = {
        name: "Любовь по залету",
        author: "Лина Филимонова",
        genres: ["Fantasy", "Adventure"],
        isAvailable: true,
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

            let b = [];
            for (const i of res.data) {
                b.push(<BookTile key={i._id} book={i} />);
            }
            setBooksList(b);
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
        <div className="flex flex-col w-full mt-10">
            <div className="flex justify-center w-full gap-20 px-20">
                <div className="flex flex-col w-[900px]">
                    <div className="flex justify-center gap-14">
                        <div className="w-[300px] h-[450px]">
                            <img className="object-cover w-full h-full" src="https://cdn.img-gorod.ru/310x500/nomenclature/29/193/2919342.jpg" alt="" />
                        </div>
                        <div className="flex flex-col items-center w-[500px]">
                            <div className="w-full flex justify-start">
                                <span className="text-2xl font-semibold">Любовь по залету</span>
                            </div>
                            <div className="w-full flex justify-start">
                                <span>{book.author}</span>
                            </div>
                            <div className="w-full flex flex-col gap-y-4 mt-8">
                                <div className="flex w-full">
                                    <div className="w-[50%] flex flex-shrink-0">
                                        <span className="text-gray-500">Издательство</span>
                                    </div>
                                    <span>{book.publisher}</span>
                                </div>
                                <div className="flex w-full">
                                    <div className="w-[50%] flex flex-shrink-0">
                                        <span className="text-gray-500">Серия</span>
                                    </div>
                                    <span>Звездная коллекция романов о любви</span>
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
                                    <span>16.5x11.3x2.3</span>
                                </div>
                                <div className="flex w-full">
                                    <div className="w-[50%] flex flex-shrink-0">
                                        <span className="text-gray-500">Тип обложки</span>
                                    </div>
                                    <span>Мягкий переплет</span>
                                </div>
                                <div className="flex w-full">
                                    <div className="w-[50%] flex flex-shrink-0">
                                        <span className="text-gray-500">Вес</span>
                                    </div>
                                    <span>158</span>
                                </div>
                                <div className="flex w-full">
                                    <div className="w-[50%] flex flex-shrink-0">
                                        <span className="text-gray-500">Возрастные ограничения</span>
                                    </div>
                                    <span>18+</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-10 leading-7">
                        Аня хотела от него только одного - ребенка. Потому что часики тикают, нормальных парней все равно нет, а этот… просто настоящий мачо! Она уверена в том, что не любит Демида и
                        вовсе не собирается за него замуж, ведь самое ценное в нем - его прекрасные гены, которые ей и нужны. Демид же вовсе не против развлечься, он и не думает о серьезных
                        отношениях, в его жизни и так было немало "беременных”, мечтающих затащить его в загс и все пошли лесом. Так почему бы не провести время с удовольствием? Однако судьба
                        приготовила свои сюрпризы для них обоих...
                    </div>
                </div>
                <div className="w-[300px]">
                    <div className="flex flex-col shadow-lg w-full px-4 py-4">
                        {10 === 0 ? (
                            <div className="flex w-full gap-10 items-center">
                                <span className="font-bold text-xl">{100 + "₽"}</span>
                            </div>
                        ) : (
                            <div className="flex w-full gap-10 items-center">
                                <span className="font-bold text-red-500 text-xl">{calculateDiscount(100, 10) + "₽"}</span>
                                <span className="font-extralight line-through text-slate-600">{100 + "₽"}</span>
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
        </div>
    );
}
