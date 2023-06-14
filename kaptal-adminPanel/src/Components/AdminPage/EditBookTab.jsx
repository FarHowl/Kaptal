import axios from "axios";
import { useLayoutEffect, useState, useRef, useEffect } from "react";
import { getBookImage_EP, updateBook_EP } from "../../Utils/API";
import { authToken_header, getUserData } from "../../Utils/LocalStorageUtils";
import InputTile from "../UI/InputTile";

export default function EditBookTab({ book }) {
    const [bookInfo, setBookInfo] = useState(book);
    const [imagePreview, setImagePreview] = useState();

    async function getBookImage() {
        try {
            const imgServerAddress = getBookImage_EP + "?imgName=" + book.image;

            const res = await axios.get(imgServerAddress, authToken_header());
            setImagePreview(imgServerAddress);
        } catch (error) {
            if (error?.response) console.log(error.response.data.error);
            else console.log(error);
        }
    }

    async function updateBook() {
        try {
            let formData;
            if (typeof bookInfo.image !== "string") {
                formData = new FormData();
                formData.append("image", bookInfo.image);
            }

            const res = await axios.post(
                updateBook_EP,
                {
                    bookId: book._id,
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
                    weight: bookInfo.weight,
                    series: bookInfo.series,
                    language: bookInfo.language,
                    discount: bookInfo.discount,
                    ...(typeof bookInfo.image !== "string" ? { image: formData.get("image") } : {}),
                },
                { headers: { "Content-Type": "multipart/form-data", Authorization: "Bearer " + getUserData().authToken } }
            );
            console.log("Книга успешно обновлена");
        } catch (error) {
            if (error?.response) console.log(error.response.data.error);
            else console.log(error);
        }
    }

    useLayoutEffect(() => {
        getBookImage();
    }, []);

    return (
        <div className="absolute top-[90px] left-[254px] pb-6 pt-8 px-10 right-0 bottom-0 flex flex-col items-center overflow-y-auto">
            <div className="flex gap-6 justify-center items-center w-full flex-wrap">
                <div className="flex flex-col gap-2 max-w-[250px] w-full">
                    <InputTile
                        title={"Название"}
                        onChange={(e) => {
                            setBookInfo({ ...bookInfo, name: e.target.value });
                        }}
                        defaultValue={book.name}
                    />
                    <InputTile
                        title={"Автор"}
                        onChange={(e) => {
                            setBookInfo({ ...bookInfo, author: e.target.value });
                        }}
                        defaultValue={book.author}
                    />
                    <InputTile
                        title={"Издатель"}
                        onChange={(e) => {
                            setBookInfo({ ...bookInfo, publisher: e.target.value });
                        }}
                        defaultValue={book.publisher}
                    />
                    <InputTile
                        title={"Год"}
                        onChange={(e) => {
                            setBookInfo({ ...bookInfo, year: e.target.value });
                        }}
                        defaultValue={book.year}
                    />
                    <InputTile
                        title={"Количество страниц"}
                        onChange={(e) => {
                            setBookInfo({ ...bookInfo, pagesCount: e.target.value });
                        }}
                        defaultValue={book.pagesCount}
                    />
                </div>
                <div className="flex flex-col gap-2 max-w-[250px] w-full">
                    <InputTile
                        title={"ISBN"}
                        onChange={(e) => {
                            setBookInfo({ ...bookInfo, ISBN: e.target.value });
                        }}
                        defaultValue={book.ISBN}
                    />
                    <InputTile
                        title={"Размер"}
                        onChange={(e) => {
                            setBookInfo({ ...bookInfo, size: e.target.value });
                        }}
                        defaultValue={book.size}
                    />
                    <InputTile
                        title={"Вес"}
                        onChange={(e) => {
                            setBookInfo({ ...bookInfo, weight: e.target.value });
                        }}
                        defaultValue={book.weight}
                    />
                    <InputTile
                        title={"Цена"}
                        onChange={(e) => {
                            setBookInfo({ ...bookInfo, price: e.target.value });
                        }}
                        defaultValue={book.price}
                    />
                    <InputTile
                        title={"Тираж"}
                        onChange={(e) => {
                            setBookInfo({ ...bookInfo, circulation: e.target.value });
                        }}
                        defaultValue={book.circulation}
                    />
                </div>
                <div className="flex flex-col gap-2 max-w-[250px] w-full">
                    <InputTile
                        title={"Серия"}
                        onChange={(e) => {
                            setBookInfo({ ...bookInfo, series: e.target.value });
                        }}
                        defaultValue={book.series}
                    />
                    <InputTile
                        title={"Количество на складе"}
                        onChange={(e) => {
                            setBookInfo({ ...bookInfo, stock: e.target.value });
                        }}
                        defaultValue={book.stock}
                    />
                    <InputTile
                        title={"Язык"}
                        onChange={(e) => {
                            setBookInfo({ ...bookInfo, language: e.target.value });
                        }}
                        defaultValue={book.language}
                    />
                    <InputTile
                        title={"Возрастной рейтинг"}
                        onChange={(e) => {
                            setBookInfo({ ...bookInfo, ageLimit: e.target.value });
                        }}
                        defaultValue={book.ageLimit}
                    />
                    <InputTile
                        title={"Тип обложки"}
                        onChange={(e) => {
                            setBookInfo({ ...bookInfo, coverType: e.target.value });
                        }}
                        defaultValue={book.coverType}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-2 w-full mt-6">
                <div className="w-full flex justify-center items-center">
                    <CategoriesInputTile bookInfo={bookInfo} setBookInfo={setBookInfo} />
                </div>
                <div className="w-full flex justify-center items-center">
                    <CollectionsInputTile bookInfo={bookInfo} setBookInfo={setBookInfo} />
                </div>
            </div>
            <div className="relative flex flex-col max-w-[400px] w-full items-center mt-2">
                <span className="absolute text-sm text-gray-500 left-3 top-1">Аннотация</span>
                <textarea
                    onChange={(e) => {
                        setBookInfo({ ...bookInfo, annotation: e.target.value });
                    }}
                    className="w-full h-[200px] flex items-start text-left pt-5 pb-1 font-medium text-medium px-3 border-[1px] border-gray-100 bg-gray-100 border-opacity-80 rounded-lg focus:outline-none focus:ring-1 focus:border-indigo-500 focus:border-opacity-90 focus:border-[1px] focus:bg-white focus:ring-indigo-300"
                    type="text"
                    defaultValue={book.annotation}
                />
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

function CategoriesInputTile({ setBookInfo, bookInfo }) {
    const [isFocused, setIsFocused] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);
    const [categoriesView, setCategoriesView] = useState([]);
    const [categories, setCategories] = useState([]);

    const inputRef = useRef();

    async function getCategories() {
        try {
            const res = await axios.get(getAllCategories_EP);
            setCategories(res.data);
        } catch (error) {
            if (error?.response) {
                console.log(error.response.data.error);
            } else {
                console.log(error);
            }
        }
    }

    useEffect(() => {
        setIsEmpty(categoriesView.length === 0);
        setBookInfo({ ...bookInfo, categories: categoriesView });
    }, [categoriesView]);

    useEffect(() => {
        getCategories();
    }, []);

    const handleCategoryRemove = (category) => {
        if (category.name === categoriesView[categoriesView.length - 1].name) {
            setCategoriesView(categoriesView.filter((c) => c !== category));
            inputRef.current.focus();
        }
    };

    const handleCategorySelect = (category) => {
        if (!categoriesView.includes(category.name)) {
            inputRef.current.value = "";
            inputRef.current.focus();
            setIsEmpty(false);
            setCategoriesView((prevCategories) => [...prevCategories, { ...category }]);
        }
    };

    const handleInputChange = (e) => {
        if (e.target.value.length !== 0 || categoriesView.length !== 0) setIsEmpty(false);
        else setIsEmpty(true);
    };

    const handleInputKeyDown = (e) => {
        if (e.key === "Enter" && e.target.value.length !== 0 && !categoriesView.includes(e.target.value)) {
            e.preventDefault();
            setCategoriesView((prevCategories) => [...prevCategories, { name: e.target.value, children: [] }]);
            inputRef.current.value = "";
        }
    };

    return (
        <div
            onMouseEnter={() => {
                setIsFocused(true);
            }}
            onMouseLeave={() => {
                setIsFocused(false);
            }}
            className={
                "relative min-w-[250px] flex items-center pl-3 pr-3 rounded-lg border-[1px] " +
                (isFocused || !isEmpty ? "border-indigo-500 ring-indigo-300 bg-white ring-1 outline-none border-opacity-90" : "bg-gray-100 border-opacity-80")
            }
        >
            <div className="flex gap-2 flex-wrap mt-[12px]">
                {categoriesView.map((category) => (
                    <div key={category.name} className="flex items-center gap-2">
                        <div className="flex gap-2 justify-center items-center px-3 py-1 bg-stone-200/70 rounded-md">
                            <span className="">{category.name}</span>
                            <button onClick={() => handleCategoryRemove(category)} className={category.name === categoriesView[categoriesView.length - 1].name ? "text-red-500" : "text-gray-500"}>
                                x
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="relative">
                <input
                    ref={inputRef}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    className={"w-[224px] text-left pt-[26px] pb-3 font-medium text-medium outline-none bg-transparent " + (categoriesView.length !== 0 ? "pl-3" : "pl-0")}
                    type="text"
                />
                {isFocused && (
                    <div className={"absolute top-14 flex flex-col shadow-md items-left gap-y-2 py-2 z-10 px-2 bg-white rounded-sm w-[200px] " + (categoriesView.length !== 0 ? "left-3" : "left-0")}>
                        {(categoriesView.length === 0 ? categories : categoriesView[categoriesView.length - 1].children).map((category) => (
                            <button key={category.name} onClick={() => handleCategorySelect(category)} className="text-left">
                                {category.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <div className={"absolute left-3 pointer-events-none animated-100 " + (isFocused || !isEmpty ? "top-[1px]" : "top-[30%]")}>
                <span className={"text-gray-500 animated-100 origin-top-left " + (isFocused || !isEmpty ? "text-sm" : "text-lg")}>Категории</span>
            </div>
        </div>
    );
}

function CollectionsInputTile({ setBookInfo, bookInfo }) {
    const [isFocused, setIsFocused] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);
    const [collectionsView, setCollectionsView] = useState([]);
    const [collections, setCollections] = useState([]);

    const inputRef = useRef();

    async function getCollections() {
        try {
            const res = await axios.get(getAllCollections_EP, authToken_header());

            setCollections(res.data[0].collections);
        } catch (error) {
            if (error?.response) {
                console.log(error.response.data.error);
            } else {
                console.log(error);
            }
        }
    }

    useEffect(() => {
        setIsEmpty(collectionsView.length === 0);
        setBookInfo({ ...bookInfo, collections: collectionsView });
    }, [collectionsView]);

    useEffect(() => {
        getCollections();
    }, []);

    const handleCollectionRemove = (collection) => {
        setCollectionsView(collectionsView.filter((c) => c !== collection));
        inputRef.current.focus();
    };

    const handleCollectionSelect = (collection) => {
        inputRef.current.value = "";
        inputRef.current.focus();
        setIsEmpty(false);
        setCollectionsView((prevCollectionsView) => [...prevCollectionsView, collection]);
    };

    const handleInputChange = (e) => {
        if (e.target.value.length !== 0 || collectionsView.length !== 0) setIsEmpty(false);
        else setIsEmpty(true);
    };

    const handleInputKeyDown = (e) => {
        if (e.key === "Enter" && e.target.value.length !== 0 && !collectionsView.includes(e.target.value)) {
            e.preventDefault();
            console.log(e.target.value);
            setCollectionsView([...collectionsView, { name: e.target.value }]);
            inputRef.current.value = "";
        }
    };

    return (
        <div
            onMouseEnter={() => {
                setIsFocused(true);
            }}
            onMouseLeave={() => {
                setIsFocused(false);
            }}
            className={
                "relative min-w-[250px] flex items-center pl-3 pr-3 rounded-lg border-[1px] " +
                (isFocused || !isEmpty ? "border-indigo-500 ring-indigo-300 bg-white ring-1 outline-none border-opacity-90" : "bg-gray-100 border-opacity-80")
            }
        >
            <div className="flex gap-2 flex-wrap mt-[12px]">
                {collectionsView.map((collection) => (
                    <div key={collection.name} className="flex items-center gap-2">
                        <div className="flex gap-2 justify-center items-center px-3 py-1 bg-stone-200/70 rounded-md">
                            <span className="">{collection.name}</span>
                            <button onClick={() => handleCollectionRemove(collection)} className="text-gray-500 ">
                                x
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="relative">
                <input
                    ref={inputRef}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    className={"w-[224px] text-left pt-[26px] pb-3 font-medium text-medium outline-none bg-transparent " + (collectionsView.length !== 0 ? "pl-3" : "pl-0")}
                    type="text"
                />
                {isFocused && (
                    <div className={"absolute top-14 flex flex-col shadow-md items-left gap-y-2 py-2 z-10 px-2 bg-white rounded-sm w-[200px] " + (collectionsView.length !== 0 ? "left-3" : "left-0")}>
                        {collections
                            .filter((collection) => !collectionsView.includes(collection))
                            .map((collection) => (
                                <button key={collection.name} onClick={() => handleCollectionSelect(collection)} className="text-left px-2 py-2">
                                    {collection.name}
                                </button>
                            ))}
                    </div>
                )}
            </div>
            <div className={"absolute left-3 pointer-events-none animated-100 " + (isFocused || !isEmpty ? "top-[1px]" : "top-[30%]")}>
                <span className={"text-gray-500 animated-100 origin-top-left " + (isFocused || !isEmpty ? "text-sm" : "text-lg")}>Коллекции</span>
            </div>
        </div>
    );
}
