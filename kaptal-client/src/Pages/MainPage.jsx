import React, { useEffect, useState, useLayoutEffect } from "react";
import { authToken_header, getUserData } from "../Utils/LocalStorageUtils";
import { getAllBooks_EP } from "../Utils/API";
import BookTile from "../Components/Book/BookTile";
import axios from "axios";
import { socket } from "../Utils/socketIO";

export default function MainPage() {
    const [booksList, setBooksList] = useState([]);

    async function getBooks() {
        try {
            const res = await axios.get(getAllBooks_EP, authToken_header());

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

    useEffect(() => {
        getBooks();
    }, []);

    // useLayoutEffect(() => {
    //     socket.on("connect", () => {
    //         console.log(socket.id);
    //     });
    // }, []);

    async function getResponse() {
        const response = await axios.post("http://api.local.app.garden/user/signIn", {
            email: "kartashov104@gmail.com",
            password: "3498569",
        });
        return response.data;
    }

    useEffect(() => {
        console.log(getResponse());
    }, []);

    return (
        <>
            <div className="w-full flex flex-col justify-center items-center">
                {/* <div className="max-w-[1400px] w-full flex justify-center items-center mt-8 flex-wrap gap-4">{booksList}</div> */}
                <div className="absolute top-[90px] left-[254px] pb-6 pt-6 px-10 right-0 bottom-0 flex flex-col items-center overflow-y-auto">
                    <div className="w-full flex flex-col items-center shadow-lg rounded-lg py-4 border-[1px]">
                        <div className="w-full flex flex-col justify-start items-center h-[300px] overflow-y-auto py-2 px-2">
                            <div className="w-full flex justify-start">
                                <div className="bg-gray-100 py-4 px-6 rounded-xl">
                                    <span>Привет!</span>
                                </div>
                            </div>
                            <div className="w-full flex justify-end">
                                <div className="bg-indigo-600/90 text-white py-4 px-6 rounded-xl">
                                    <span>Привет!</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full px-3 flex justify-center gap-3">
                            <input
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        console.log("Enter");
                                    }
                                }}
                                className="w-full border-[1px] border-gray-100 bg-gray-100 border-opacity-80 rounded-full focus:outline-none focus:ring-1 focus:border-indigo-500 focus:border-opacity-90 focus:border-[1px] focus:bg-white focus:ring-indigo-300 py-3 px-4"
                                type="text"
                                placeholder="Напишите сообщение"
                            />
                            <button className="bg-blue-500 text-white rounded-full px-3 py-1">Отправить</button>
                        </div>
                    </div>
                </div>
                {getUserData()?.role === "user" ? (
                    <div className="w-[400px] flex flex-col items-center shadow-lg rounded-lg py-4">
                        <div className="w-full flex justify-center h-[300px] overflow-y-auto py-2 px-2"></div>
                        <div className="w-full px-3 flex justify-center gap-3">
                            <input className="w-full rounded-lg bg-gray-100" type="text" />
                            <button className="bg-blue-300 text-white rounded-md px-3 py-1">Send</button>
                        </div>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </>
    );
}
