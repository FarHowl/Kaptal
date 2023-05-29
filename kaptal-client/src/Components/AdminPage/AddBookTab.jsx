import axios from "axios";
import { useEffect, useState, useRef, Children } from "react";
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

    useEffect(() => {
        console.log(bookInfo);
    }, [bookInfo]);

    return (
        <div className="absolute top-[90px] left-[254px] pb-6 pt-8 px-10 right-0 bottom-0 flex flex-col items-center overflow-y-auto">
            <div className="flex gap-6 justify-center items-center w-full flex-wrap">
                <div className="flex flex-col gap-2 max-w-[250px] w-full">
                    <InputTile title={"Название"} bookField={"name"} bookInfo={bookInfo} setBookInfo={setBookInfo} />
                    <InputTile title={"Автор"} bookField={"author"} bookInfo={bookInfo} setBookInfo={setBookInfo} />
                    <InputTile title={"Издатель"} bookField={"publisher"} bookInfo={bookInfo} setBookInfo={setBookInfo} />
                    <InputTile title={"Год"} bookField={"year"} bookInfo={bookInfo} setBookInfo={setBookInfo} />
                    <InputTile title={"Количество страниц"} bookField={"pagesCount"} bookInfo={bookInfo} setBookInfo={setBookInfo} />
                </div>
                <div className="flex flex-col gap-2 max-w-[250px] w-full">
                    <InputTile title={"ISBN"} bookField={"ISBN"} bookInfo={bookInfo} setBookInfo={setBookInfo} />
                    <InputTile title={"Размер"} bookField={"size"} bookInfo={bookInfo} setBookInfo={setBookInfo} />
                    <InputTile title={"Вес"} bookField={"weight"} bookInfo={bookInfo} setBookInfo={setBookInfo} />
                    <InputTile title={"Цена"} bookField={"price"} bookInfo={bookInfo} setBookInfo={setBookInfo} />
                    <InputTile title={"Тираж"} bookField={"circulation"} bookInfo={bookInfo} setBookInfo={setBookInfo} />
                </div>
                <div className="flex flex-col gap-2 max-w-[250px] w-full">
                    <InputTile title={"Серия"} bookField={"series"} bookInfo={bookInfo} setBookInfo={setBookInfo} />
                    <InputTile title={"Наличие на складе"} bookField={"amount"} bookInfo={bookInfo} setBookInfo={setBookInfo} />
                    <InputTile title={"Язык"} bookField={"language"} bookInfo={bookInfo} setBookInfo={setBookInfo} />
                    <InputTile title={"Возрастной рейтинг"} bookField={"ageLimit"} bookInfo={bookInfo} setBookInfo={setBookInfo} />
                </div>
            </div>
            <div className="flex gap-6 justify-center items-center w-full mt-6">
                <div className="flex flex-col gap-2 max-w-[250px] w-full">
                    <InputTile title={"Тип обложки"} bookField={"coverType"} bookInfo={bookInfo} setBookInfo={setBookInfo} />
                </div>
            </div>
            <div className="w-full flex justify-center items-center mt-6">
                <CategoryInputTile title={"Категория"} bookInfo={bookInfo} setBookInfo={setBookInfo} />
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

function InputTile({ setBookInfo, bookInfo, bookField, title }) {
    const [isFocused, setIsFocused] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);

    return (
        <div className="relative flex flex-col w-full items-center">
            <input
                onFocus={() => {
                    setIsFocused(true);
                }}
                onBlur={() => {
                    setIsFocused(false);
                }}
                onChange={(e) => {
                    setBookInfo({ ...bookInfo, [bookField]: e.target.value });
                    if (e.target.value.length === 0) setIsEmpty(true);
                    else setIsEmpty(false);
                }}
                className="w-full text-left pt-6 pb-1 font-medium text-medium px-3 border-[1px] border-gray-100 bg-gray-100 border-opacity-80 rounded-lg focus:outline-none focus:ring-1 focus:border-indigo-500 focus:border-opacity-90 focus:border-[1px] focus:bg-white focus:ring-indigo-300"
                type="text"
            />
            <div className={"absolute left-3 h-full pointer-events-none animated-100 " + (isFocused || !isEmpty ? "top-[1px]" : "top-[25%]")}>
                <span className={"text-gray-500 animated-100 origin-top-left " + (isFocused || !isEmpty ? "text-sm" : "text-lg")}>{title}</span>
            </div>
        </div>
    );
}

function CategoryInputTile({ setBookInfo, bookInfo, bookField, title }) {
    const [isFocused, setIsFocused] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);

    const [categoriesView, setCategoriesView] = useState([]);

    const categories = [
        {
            _id: "1",
            name: "Фантастика",
            children: [
                {
                    _id: "14",
                    name: "Космическая фантастика",
                    children: [
                        {
                            _id: "13",
                            name: "Космоопера",
                            children: [],
                        },
                        {
                            _id: "12",
                            name: "Космическая опера",
                            children: [],
                        },
                    ],
                },
                {
                    _id: "11",
                    name: "Научная фантастика",
                    children: [],
                },
                {
                    _id: "10",
                    name: "Киберпанк",
                    children: [],
                },
            ],
        },
        {
            _id: "2",
            name: "Фэнтези",
            children: [
                {
                    _id: "9",
                    name: "Эпическое фэнтези",
                    children: [],
                },
                {
                    _id: "8",
                    name: "Героическое фэнтези",
                    children: [],
                },
                {
                    _id: "7",
                    name: "Ужасы",
                    children: [],
                },
            ],
        },
        {
            _id: "3",
            name: "Детектив",
            children: [
                {
                    _id: "4",
                    name: "Классический детектив",
                    children: [],
                },
                {
                    _id: "5",
                    name: "Психологический детектив",
                    children: [],
                },
                {
                    _id: "6",
                    name: "Триллер",
                    children: [],
                },
            ],
        },
    ];

    const inputRef = useRef();
    const categoriesContainerRef = useRef();
    const wrapperRef = useRef();

    useEffect(() => {
        if (categoriesView.length === 0) setIsEmpty(true);
        else setIsEmpty(false);
    }, [categoriesView]);

    // !event.target.classList.contains("delete-button")

    useEffect(() => {
        // Обработчик клика вне контейнера
        const handleClickOutside = (event) => {
          if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            console.log('Клик вне контейнера');
            // Здесь вы можете выполнить необходимые действия при клике вне контейнера
          }
        };
    
        // Добавление обработчика события при монтировании компонента
        document.addEventListener('click', handleClickOutside);
    
        // Удаление обработчика события при размонтировании компонента
        return () => {
          document.removeEventListener('click', handleClickOutside);
        };
      }, []);

    useEffect(() => {
        console.log(categoriesView);
    }, [categoriesView]);

    return (
        <div
            ref={wrapperRef}
            onFocus={() => {
                setIsFocused(true);
            }}
            className={
                "relative min-w-[250px] flex items-center pl-3 pr-3 rounded-lg border-[1px] " +
                (isFocused || !isEmpty ? "border-indigo-500 ring-indigo-300 bg-white ring-1 outline-none border-opacity-90" : "bg-gray-100 border-opacity-80")
            }
        >
            <div ref={categoriesContainerRef} className="flex gap-2 flex-wrap mt-[12px]">
                {categoriesView.map((category) => {
                    return (
                        <div className="flex items-center gap-2">
                            <div className="flex gap-2 justify-center items-center px-3 py-1 bg-stone-200/70 rounded-md">
                                <span className="">{category.name}</span>
                                <button
                                    onClick={() => {
                                        if (category.name === categoriesView[categoriesView.length - 1].name) {
                                            setCategoriesView(categoriesView.filter((c) => c !== category));
                                            // setCurrentCategory()
                                            inputRef.current.focus();
                                        }
                                    }}
                                    className="text-gray-500 delete-button"
                                >
                                    x
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="relative">
                <input
                    ref={inputRef}
                    onChange={(e) => {
                        if (e.target.value.length !== 0 || categoriesView.length !== 0) setIsEmpty(false);
                        else setIsEmpty(true);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && e.target.value.length !== 0 && !categoriesView.includes(e.target.value)) {
                            e.preventDefault();
                            // if (
                            //     categoriesView[categoriesView.length - 1]?.children.some((category) => {
                            //         category.name === e.target.value;
                            //     })
                            // )
                            //     setCategoriesView([...categoriesView, { name: e.target.value, children: [] }]);
                            inputRef.current.value = "";
                        }
                    }}
                    className={"w-[224px] text-left pt-[26px] pb-3 font-medium text-medium outline-none bg-transparent " + (categoriesView.length !== 0 ? "pl-3" : "pl-0")}
                    type="text"
                />
                {isFocused ? (
                    <div className={"absolute top-14 flex flex-col shadow-md items-left gap-y-2 py-2 z-10 px-2 bg-white rounded-sm w-[200px] " + (categoriesView.length !== 0 ? "left-3" : "left-0")}>
                        {(categoriesView.length === 0 ? categories : categoriesView[categoriesView.length - 1].children).map((category) => {
                            return (
                                <button
                                    key={category._id}
                                    onClick={() => {
                                        if (!categoriesView.includes(category.name)) {
                                            inputRef.current.value = "";
                                            inputRef.current.focus();
                                            setIsEmpty(false);
                                            setCategoriesView([...categoriesView, { ...category }]);
                                        }
                                    }}
                                    className="text-left"
                                >
                                    {category.name}
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <></>
                )}
            </div>
            <div className={"absolute left-3 pointer-events-none animated-100 " + (isFocused || !isEmpty ? "top-[1px]" : "top-[30%]")}>
                <span className={"text-gray-500 animated-100 origin-top-left " + (isFocused || !isEmpty ? "text-sm" : "text-lg")}>{title}</span>
            </div>
        </div>
    );
}
