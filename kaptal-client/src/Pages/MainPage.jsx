import React, { useEffect, useState } from "react";
import { authToken_header } from "../Utils/LocalStorageUtils";
import { getBooksBarByCollection_EP } from "../Utils/API";
import BookTile from "../Components/Book/BookTile";
import axios from "axios";
import { showErrorNotification } from "../StoreState/NotificationStore";

export default function MainPage() {
    return (
        <div className="w-full flex flex-col justify-center items-center px-6">
            <div className="max-w-[1240px] w-full flex flex-col justify-center items-center mt-8 flex-wrap gap-y-16">
                <div className="flex flex-col gap-y-3 w-full">
                    <span className="text-3xl font-bold">Новинки</span>
                    <BooksBar collection={"Новинки"} />
                </div>
                <div className="flex flex-col gap-y-3 w-full">
                    <span className="text-3xl font-bold">Бестселлеры</span>
                    <BooksBar collection={"Бестселлеры"} />
                </div>
            </div>
        </div>
    );
}

function BooksBar({ collection }) {
    const [booksList, setBooksList] = useState([]);

    async function getBooksByCollectionBar(collection) {
        const query = `?collection=${collection}`;

        try {
            const res = await axios.get(getBooksBarByCollection_EP + query, authToken_header());

            let a = [];
            for (const book of res.data) {
                a.push(<BookTile key={book._id} book={book} />);
            }
            setBooksList(a);
        } catch (error) {
            if (error?.response) showErrorNotification(error.response.data.error);
            else showErrorNotification(error);
        }
    }

    useEffect(() => {
        getBooksByCollectionBar(collection);
    }, []);

    return (
        <div className="w-full flex flex-col justify-center items-center px-6">
            <div className="max-w-[1400px] w-full flex justify-start items-center flex-wrap gap-4">{booksList}</div>
        </div>
    );
}
