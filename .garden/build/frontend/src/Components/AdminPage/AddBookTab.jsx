import axios from "axios";
import { useState } from "react";
import { addNewBook_EP } from "../../Utils/API";
import { getUserData } from "../../Utils/LocalStorageUtils";


export default function AddBookTab({ setIsTabLoading }) {
    const [bookInfo, setBookInfo] = useState({});
    const [imagePreview, setImagePreview] = useState();

    async function addNewBook() {
        try {
            const formData = new FormData();
            formData.append("image", bookInfo.image);

            const res = await axios.post(
                addNewBook_EP,
                {
                    name: bookInfo.name,
                    author: bookInfo.author,
                    genres: bookInfo.genres,
                    isAvailable: bookInfo.isAvailable,
                    coverType: bookInfo.coverType,
                    publisher: bookInfo.publisher,
                    size: bookInfo.size,
                    ISBN: bookInfo.ISBN,
                    pagesCount: bookInfo.pagesCount,
                    ageLimit: bookInfo.ageLimit,
                    year: bookInfo.year,
                    circulation: bookInfo.circulation,
                    annotation: bookInfo.annotation,
                    price: bookInfo.price,
                    image: formData.get("image"),
                    weight: bookInfo.weight,
                    series: bookInfo.series,
                    language: bookInfo.language,
                    discount: bookInfo.discount,
                },
                { headers: { "Content-Type": "multipart/form-data", Authorization: "Bearer " + getUserData().authToken } }
            );
            console.log("Книга успешно добавлена!");
        } catch (error) {
            if (error?.response) {
                console.log(error.response.data.error);
            } else {
                console.log(error);
            }
        }
    }

    return (
        <div className="absolute top-[90px] left-[254px] pb-6 pt-8 px-10 right-0 bottom-0 flex flex-col items-center overflow-y-auto">
            <div className="flex gap-6 justify-center items-center w-full flex-wrap">
                <div className="flex flex-col gap-2 max-w-[250px] w-full">
                    <div className="relative flex flex-col w-full items-center">
                        <input
                            onChange={(e) => {
                                setBookInfo({ ...bookInfo, name: e.target.value });
                            }}
                            className="w-full text-left pt-5 pb-1 font-medium text-medium px-3 border-[1px] border-gray-100 bg-gray-100 border-opacity-80 rounded-lg focus:outline-none focus:ring-1 focus:border-indigo-500 focus:border-opacity-90 focus:border-[1px] focus:bg-white focus:ring-indigo-300"
                            type="text"
                        />
                        <span className="absolute text-sm text-gray-500 left-3 top-1">Название</span>
                    </div>
                    <div className="relative flex flex-col w-full items-center">
                        <input
                            onChange={(e) => {
                                setBookInfo({ ...bookInfo, author: e.target.value });
                            }}
                            className="w-full text-left pt-5 pb-1 font-medium text-medium px-3 border-[1px] border-gray-100 bg-gray-100 border-opacity-80 rounded-lg focus:outline-none focus:ring-1 focus:border-indigo-500 focus:border-opacity-90 focus:border-[1px] focus:bg-white focus:ring-indigo-300"
                            type="text"
                        />
                        <span className="absolute text-sm text-gray-500 left-3 top-1">Автор</span>
                    </div>
                    <div className="relative flex flex-col w-full items-center">
                        <input
                            onChange={(e) => {
                                setBookInfo({ ...bookInfo, publisher: e.target.value });
                            }}
                            className="w-full text-left pt-5 pb-1 font-medium text-medium px-3 border-[1px] border-gray-100 bg-gray-100 border-opacity-80 rounded-lg focus:outline-none focus:ring-1 focus:border-indigo-500 focus:border-opacity-90 focus:border-[1px] focus:bg-white focus:ring-indigo-300"
                            type="text"
                        />
                        <span className="absolute text-sm text-gray-500 left-3 top-1">Издатель</span>
                    </div>
                    <div className="relative flex flex-col w-full items-center">
                        <input
                            onChange={(e) => {
                                setBookInfo({ ...bookInfo, year: e.target.value });
                            }}
                            className="w-full text-left pt-5 pb-1 font-medium text-medium px-3 border-[1px] border-gray-100 bg-gray-100 border-opacity-80 rounded-lg focus:outline-none focus:ring-1 focus:border-indigo-500 focus:border-opacity-90 focus:border-[1px] focus:bg-white focus:ring-indigo-300"
                            type="text"
                        />
                        <span className="absolute text-sm text-gray-500 left-3 top-1">Год</span>
                    </div>
                    <div className="relative flex flex-col w-full items-center">
                        <input
                            onChange={(e) => {
                                setBookInfo({ ...bookInfo, pagesCount: e.target.value });
                            }}
                            className="w-full text-left pt-5 pb-1 font-medium text-medium px-3 border-[1px] border-gray-100 bg-gray-100 border-opacity-80 rounded-lg focus:outline-none focus:ring-1 focus:border-indigo-500 focus:border-opacity-90 focus:border-[1px] focus:bg-white focus:ring-indigo-300"
                            type="text"
                        />
                        <span className="absolute text-sm text-gray-500 left-3 top-1">Количество страниц</span>
                    </div>
                </div>
                <div className="flex flex-col gap-2 max-w-[250px] w-full">
                    <div className="relative flex flex-col w-full items-center">
                        <input
                            onChange={(e) => {
                                setBookInfo({ ...bookInfo, ISBN: e.target.value });
                            }}
                            className="w-full text-left pt-5 pb-1 font-medium text-medium px-3 border-[1px] border-gray-100 bg-gray-100 border-opacity-80 rounded-lg focus:outline-none focus:ring-1 focus:border-indigo-500 focus:border-opacity-90 focus:border-[1px] focus:bg-white focus:ring-indigo-300"
                            type="text"
                        />
                        <span className="absolute text-sm text-gray-500 left-3 top-1">ISBN</span>
                    </div>
                    <div className="relative flex flex-col w-full items-center">
                        <input
                            onChange={(e) => {
                                setBookInfo({ ...bookInfo, size: e.target.value });
                            }}
                            className="w-full text-left pt-5 pb-1 font-medium text-medium px-3 border-[1px] border-gray-100 bg-gray-100 border-opacity-80 rounded-lg focus:outline-none focus:ring-1 focus:border-indigo-500 focus:border-opacity-90 focus:border-[1px] focus:bg-white focus:ring-indigo-300"
                            type="text"
                        />
                        <span className="absolute text-sm text-gray-500 left-3 top-1">Размер</span>
                    </div>
                    <div className="relative flex flex-col w-full items-center">
                        <input
                            onChange={(e) => {
                                setBookInfo({ ...bookInfo, weight: e.target.value });
                            }}
                            className="w-full text-left pt-5 pb-1 font-medium text-medium px-3 border-[1px] border-gray-100 bg-gray-100 border-opacity-80 rounded-lg focus:outline-none focus:ring-1 focus:border-indigo-500 focus:border-opacity-90 focus:border-[1px] focus:bg-white focus:ring-indigo-300"
                            type="text"
                        />
                        <span className="absolute text-sm text-gray-500 left-3 top-1">Вес</span>
                    </div>
                    <div className="relative flex flex-col w-full items-center">
                        <input
                            onChange={(e) => {
                                setBookInfo({ ...bookInfo, price: e.target.value });
                            }}
                            className="w-full text-left pt-5 pb-1 font-medium text-medium px-3 border-[1px] border-gray-100 bg-gray-100 border-opacity-80 rounded-lg focus:outline-none focus:ring-1 focus:border-indigo-500 focus:border-opacity-90 focus:border-[1px] focus:bg-white focus:ring-indigo-300"
                            type="text"
                        />
                        <span className="absolute text-sm text-gray-500 left-3 top-1">Цена</span>
                    </div>
                    <div className="relative flex flex-col w-full items-center">
                        <input
                            onChange={(e) => {
                                setBookInfo({ ...bookInfo, circulation: e.target.value });
                            }}
                            className="w-full text-left pt-5 pb-1 font-medium text-medium px-3 border-[1px] border-gray-100 bg-gray-100 border-opacity-80 rounded-lg focus:outline-none focus:ring-1 focus:border-indigo-500 focus:border-opacity-90 focus:border-[1px] focus:bg-white focus:ring-indigo-300"
                            type="text"
                        />
                        <span className="absolute text-sm text-gray-500 left-3 top-1">Тираж</span>
                    </div>
                </div>
                <div className="flex flex-col gap-2 max-w-[250px] w-full">
                    <div className="relative flex flex-col w-full items-center">
                        <input
                            onChange={(e) => {
                                setBookInfo({ ...bookInfo, series: e.target.value });
                            }}
                            className="w-full text-left pt-5 pb-1 font-medium text-medium px-3 border-[1px] border-gray-100 bg-gray-100 border-opacity-80 rounded-lg focus:outline-none focus:ring-1 focus:border-indigo-500 focus:border-opacity-90 focus:border-[1px] focus:bg-white focus:ring-indigo-300"
                            type="text"
                        />
                        <span className="absolute text-sm text-gray-500 left-3 top-1">Серия</span>
                    </div>
                    <div className="relative flex flex-col w-full items-center">
                        <input
                            onChange={(e) => {
                                setBookInfo({ ...bookInfo, isAvailable: e.target.value === "Нет в наличии" ? false : e.target.value === "Есть в наличии" ? true : "" });
                            }}
                            className="w-full text-left pt-5 pb-1 font-medium text-medium px-3 border-[1px] border-gray-100 bg-gray-100 border-opacity-80 rounded-lg focus:outline-none focus:ring-1 focus:border-indigo-500 focus:border-opacity-90 focus:border-[1px] focus:bg-white focus:ring-indigo-300"
                            type="text"
                        />
                        <span className="absolute text-sm text-gray-500 left-3 top-1">Наличие</span>
                    </div>
                    <div className="relative flex flex-col w-full items-center">
                        <input
                            onChange={(e) => {
                                setBookInfo({ ...bookInfo, language: e.target.value });
                            }}
                            className="w-full text-left pt-5 pb-1 font-medium text-medium px-3 border-[1px] border-gray-100 bg-gray-100 border-opacity-80 rounded-lg focus:outline-none focus:ring-1 focus:border-indigo-500 focus:border-opacity-90 focus:border-[1px] focus:bg-white focus:ring-indigo-300"
                            type="text"
                        />
                        <span className="absolute text-sm text-gray-500 left-3 top-1">Язык</span>
                    </div>
                    <div className="relative flex flex-col w-full items-center">
                        <input
                            onChange={(e) => {
                                setBookInfo({ ...bookInfo, ageLimit: e.target.value });
                            }}
                            className="w-full text-left pt-5 pb-1 font-medium text-medium px-3 border-[1px] border-gray-100 bg-gray-100 border-opacity-80 rounded-lg focus:outline-none focus:ring-1 focus:border-indigo-500 focus:border-opacity-90 focus:border-[1px] focus:bg-white focus:ring-indigo-300"
                            type="text"
                        />
                        <span className="absolute text-sm text-gray-500 left-3 top-1">Возрастной рейтинг</span>
                    </div>
                    <div className="relative flex flex-col w-full items-center">
                        <input
                            onChange={(e) => {
                                setBookInfo({ ...bookInfo, genres: e.target.value });
                            }}
                            className="w-full text-left pt-5 pb-1 font-medium text-medium px-3 border-[1px] border-gray-100 bg-gray-100 border-opacity-80 rounded-lg focus:outline-none focus:ring-1 focus:border-indigo-500 focus:border-opacity-90 focus:border-[1px] focus:bg-white focus:ring-indigo-300"
                            type="text"
                        />
                        <span className="absolute text-sm text-gray-500 left-3 top-1">Жанры</span>
                    </div>
                </div>
            </div>
            <div className="flex gap-6 justify-center items-center w-full mt-6">
                <div className="flex flex-col gap-2 max-w-[250px] w-full">
                    <div className="relative flex flex-col w-full items-center">
                        <input
                            onChange={(e) => {
                                setBookInfo({ ...bookInfo, discount: e.target.value });
                            }}
                            className="w-full text-left pt-5 pb-1 font-medium text-medium px-3 border-[1px] border-gray-100 bg-gray-100 border-opacity-80 rounded-lg focus:outline-none focus:ring-1 focus:border-indigo-500 focus:border-opacity-90 focus:border-[1px] focus:bg-white focus:ring-indigo-300"
                            type="text"
                        />
                        <span className="absolute text-sm text-gray-500 left-3 top-1">Скидка</span>
                    </div>
                    <div className="relative flex flex-col w-full items-center">
                        <input
                            onChange={(e) => {
                                setBookInfo({ ...bookInfo, coverType: e.target.value });
                            }}
                            className="w-full text-left pt-5 pb-1 font-medium text-medium px-3 border-[1px] border-gray-100 bg-gray-100 border-opacity-80 rounded-lg focus:outline-none focus:ring-1 focus:border-indigo-500 focus:border-opacity-90 focus:border-[1px] focus:bg-white focus:ring-indigo-300"
                            type="text"
                        />
                        <span className="absolute text-sm text-gray-500 left-3 top-1">Тип обложки</span>
                    </div>
                </div>
            </div>
            <div className="relative flex flex-col max-w-[400px] w-full items-center mt-2">
                <textarea
                    onChange={(e) => {
                        setBookInfo({ ...bookInfo, annotation: e.target.value });
                    }}
                    className="w-full h-[200px] flex items-start text-left pt-5 pb-1 font-medium text-medium px-3 border-[1px] border-gray-100 bg-gray-100 border-opacity-80 rounded-lg focus:outline-none focus:ring-1 focus:border-indigo-500 focus:border-opacity-90 focus:border-[1px] focus:bg-white focus:ring-indigo-300"
                    type="text"
                />
                <span className="absolute text-sm text-gray-500 left-3 top-1">Аннотация</span>
            </div>
            <div className="flex w-full justify-center items-center font-light mt-6">
                <input
                    id="file"
                    onChange={(e) => {
                        setBookInfo({ ...bookInfo, image: e.target.files[0] });
                        const imageURL = URL.createObjectURL(e.target.files[0]);
                        setImagePreview(imageURL);
                        URL.revokeObjectURL(e.target.files[0]);
                    }}
                    type="file"
                    className="cursor-pointer file:cursor-pointer file:rounded-full file:px-4 file:py-2 file:border-0 file:bg-indigo-100 file:text-indigo-600 file:font-semibold file:hover:bg-indigo-200"
                />
                <div className="w-20">
                    <img src={imagePreview ?? ""} alt="" />
                </div>
            </div>
            <button
                onClick={() => {
                    setIsTabLoading(true);
                    addNewBook();
                    setTimeout(() => {
                        setIsTabLoading(false);
                    }, 300);
                }}
                className="py-2 px-2 mt-6 bg-blue-400 rounded-lg text-medium text-white hover:bg-blue-500 animated-100 font-semibold"
            >
                Добавить книгу
            </button>
        </div>
    );
}