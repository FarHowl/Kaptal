import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import LoadingComponent from "../Components/UI/LoadingComponent";
import { authToken_header, getUserData } from "../Utils/LocalStorageUtils";
import { getAllBooks_EP, getAllUsers_EP, getAvailableStaffForChat_EP, updateUserInformation_EP } from "../Utils/API";
import { useSessionState } from "../Utils/CustomHooks";
import { useNavigate } from "react-router-dom";
import BookTile from "../Components/Book/BookTile";
import axios from "axios";
import EditBookTab from "../Components/AdminPage/EditBookTab";
import AddBookTab from "../Components/AdminPage/AddBookTab";

export default function AdminPage() {
    /**
     * @param TabOption Sometimes there can be an array that includes current tab option and an object as component`s prop
     */
    const [tabOption, setTabOption] = useSessionState("AllBooks");
    const [isTabLoading, setIsTabLoading] = useState(false);

    useLayoutEffect(() => {
        setIsTabLoading(true);
        setTimeout(() => {
            setIsTabLoading(false);
        }, 300);
    }, [tabOption]);

    useEffect(() => {
        console.log(tabOption);
    }, [tabOption]);

    return (
        <div className="flex w-full">
            <div className="flex flex-col w-[254px] top-[90px] bg-[#fafafa] bottom-0 absolute border-r-2">
                <div className="flex flex-col w-full items-left mt-6 pl-6">
                    <span className="font-semibold">Книги</span>
                </div>
                <div className="relative w-full flex mt-4 h-10 pl-6">
                    {tabOption === "AllBooks" ? <div className="absolute left-0 border-r-[3px] h-full border-blue-600"></div> : <></>}
                    <button
                        onClick={() => {
                            setTabOption("AllBooks");
                        }}
                        className={"text-gray-500 animated-100 " + (tabOption === "AllBooks" ? "text-blue-600" : "hover:text-blue-600")}
                    >
                        Все книги
                    </button>
                </div>
                {getUserData().role === "admin" ? (
                    <div className="relative w-full flex mt-4 h-10 pl-6">
                        {tabOption === "AddBook" ? <div className="absolute left-0 border-r-[3px] h-full border-blue-600"></div> : <></>}
                        <button
                            onClick={() => {
                                setTabOption("AddBook");
                            }}
                            className={"text-gray-500 animated-100 " + (tabOption === "AddBook" ? "text-blue-600" : "hover:text-blue-600")}
                        >
                            Добавить книгу
                        </button>
                    </div>
                ) : (
                    <></>
                )}
                <div className="flex flex-col w-full items-left mt-6 pl-6">
                    <span className="font-semibold">Пользователи</span>
                </div>
                <div className="relative w-full flex mt-4 h-10 pl-6">
                    {tabOption === "AllUsers" ? <div className="absolute left-0 border-r-[3px] h-full border-blue-600"></div> : <></>}
                    <button
                        onClick={() => {
                            setTabOption("AllUsers");
                        }}
                        className={"text-gray-500 animated-100 " + (tabOption === "AllUsers" ? "text-blue-600" : "hover:text-blue-600")}
                    >
                        Все пользователи
                    </button>
                </div>
                <div className="flex flex-col w-full items-left mt-6 pl-6">
                    <span className="font-semibold">Тех. поддержка</span>
                </div>
                <div className="relative w-full flex mt-4 h-10 pl-6">
                    {tabOption === "OnlineChat" ? <div className="absolute left-0 border-r-[3px] h-full border-blue-600"></div> : <></>}
                    <button
                        onClick={() => {
                            setTabOption("OnlineChatTab");
                        }}
                        className={"text-gray-500 animated-100 " + (tabOption === "OnlineChat" ? "text-blue-600" : "hover:text-blue-600")}
                    >
                        Онлайн-чаты
                    </button>
                </div>
                <div className="relative w-full flex mt-4 h-10 pl-6">
                    {tabOption === "UserRequests" ? <div className="absolute left-0 border-r-[3px] h-full border-blue-600"></div> : <></>}
                    <button
                        onClick={() => {
                            // setTabOption("AllUsers");
                        }}
                        className={"text-gray-500 animated-100 " + (tabOption === "UserRequests" ? "text-blue-600" : "hover:text-blue-600")}
                    >
                        Обращения
                    </button>
                </div>
            </div>
            {isTabLoading ? <LoadingComponent customStyle={"absolute right-0 left-[254px] bottom-0 top-[90px] bg-white z-10 flex justify-center items-center"} /> : <></>}
            {tabOption === "AllBooks" ? (
                <AllBooksTab setTabOption={setTabOption} />
            ) : tabOption === "AddBook" ? (
                <AddBookTab setIsTabLoading={setIsTabLoading} />
            ) : tabOption.includes("EditBook") ? (
                <EditBookTab book={tabOption[1]} />
            ) : tabOption === "AllUsers" ? (
                <AllUsersTab setTabOption={setTabOption} />
            ) : tabOption.includes("UserTab") ? (
                <UserTab user={tabOption[1]} />
            ) : tabOption.includes("UserOrdersTab") ? (
                <UserOrdersTab user={tabOption[1]} />
            ) : tabOption === "OnlineChatTab" ? (
                <OnlineChatsTab setTabOption={setTabOption} />
            ) : tabOption === "ChatStarted" ? (
                <ChatWindowTab />
            ) : (
                <></>
            )}
        </div>
    );
}

function AllBooksTab({ setTabOption }) {
    const [booksView, setBooksView] = useState([]);

    async function getAllBooks() {
        try {
            const res = await axios.get(getAllBooks_EP, authToken_header());

            let b = [];
            for (const i of res.data) {
                b.push(<BookTile key={i._id} book={i} isBookInAdminMenu={true} setAdminMenuTab={setTabOption} />);
            }
            setBooksView(b);
        } catch (error) {
            if (error?.response) console.log(error.response.data.error);
            else console.log(error);
        }
    }

    useLayoutEffect(() => {
        getAllBooks();
    }, []);

    return (
        <div className="absolute top-[90px] left-[254px] pb-6 pt-8 px-10 right-0 bottom-0 flex flex-col items-center overflow-y-auto">
            <div className="w-full flex justify-center">{booksView}</div>
        </div>
    );
}

function AllUsersTab({ setTabOption }) {
    const [allUsersView, setAllUsersView] = useState();

    async function getAllUsers() {
        try {
            const res = await axios.get(getAllUsers_EP, authToken_header());

            let b = [];
            for (const i of res.data) {
                if (getUserData().userId !== i._id) b.push(<UserTile user={i} key={i._id} setTabOption={setTabOption} />);
            }
            setAllUsersView(b);
        } catch (error) {
            if (error?.response) console.log(error.response.data.error);
            else console.log(error);
        }
    }

    useEffect(() => {
        getAllUsers();
    }, []);

    return (
        <div className="absolute top-[90px] left-[254px] pb-6 pt-8 px-10 right-0 bottom-0 flex flex-col items-center overflow-y-auto">
            <div className="w-full flex flex-wrap gap-6 px-6 justify-center">{allUsersView}</div>
        </div>
    );
}

function UserTile({ user, setTabOption }) {
    const navigate = useNavigate();

    return (
        <div className="flex border-[1px] rounded-md shadow-sm items-center p-4 w-full max-w-[500px]">
            <div className="flex flex-col w-full">
                <div>
                    <span className="text-sky-500 font-medium text-base">
                        Логин: <span className="ml-1 text-medium font-semibold text-black">{user.username}</span>
                    </span>
                </div>
                <div>
                    <span className="text-red-500 font-medium text-base">
                        Email: <span className="ml-1 text-black text-medium">{user.email}</span>
                    </span>
                </div>
                <div className="w-full flex justify-between">
                    <span className="text-violet-500 font-medium text-base">
                        Роль:
                        <span className="ml-1 text-black text-medium">{user.role === "admin" ? "Администратор" : user.role === "moderator" ? "Модератор" : "Пользователь"}</span>
                    </span>
                    <div className="flex justify-center items-start relative gap-2">
                        <button
                            name="changeRoles"
                            onClick={() => {
                                setTabOption(["UserTab", user]);
                            }}
                            className={"py-1 px-3 rounded-md text-white bg-blue-400 hover:bg-blue-500 animated-100"}
                        >
                            Данные
                        </button>
                        <button
                            name="changeRoles"
                            onClick={() => {
                                setTabOption(["UserOrdersTab", user]);
                            }}
                            className={"py-1 px-3 rounded-md text-white bg-violet-400 hover:bg-violet-500 animated-100"}
                        >
                            Заказы
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function UserTab({ user }) {
    const [userRole, setUserRole] = useState(user.role);

    async function updateUser() {
        try {
            if (userRole !== "Пользователь" && userRole !== "Модератор" && userRole !== "Администратор") throw new Error();

            const role = userRole === "Пользователь" ? "user" : userRole === "Администратор" ? "admin" : userRole === "Модератор" ? "moderator" : "";

            const res = await axios.post(
                updateUserInformation_EP,
                {
                    userId: user._id,
                    role,
                },
                authToken_header()
            );
        } catch (error) {
            if (error?.response) console.log(error.response.data.error);
            else console.log(error);
        }
    }

    useEffect(() => {
        console.log(user);
    }, []);

    return (
        <div className="absolute top-[90px] left-[254px] pb-6 pt-6 px-10 right-0 bottom-0 flex flex-col items-center overflow-y-auto">
            <div className="w-full flex px-2 pointer-events-none">
                <span className="text-gray-500 text-base">
                    Все пользователи {">"} {user.username}
                </span>
            </div>
            <div className="w-full flex flex-col gap-2 items-center mt-6">
                <div className="relative flex flex-col w-[300px] items-start font-medium text-medium px-3 border-[1px] border-gray-100 bg-gray-100 border-opacity-80 rounded-lg">
                    <span className="px-2 pt-6 pb-2 text-lg ">{user.username}</span>
                    <span className="absolute text-sm text-gray-500 left-3 top-1">Логин</span>
                </div>
                <div className="relative flex flex-col w-[300px] items-start font-medium text-medium px-3 border-[1px] border-gray-100 bg-gray-100 border-opacity-80 rounded-lg">
                    <span className="px-2 pt-6 pb-2 text-lg ">{user.email}</span>
                    <span className="absolute text-sm text-gray-500 left-3 top-1">Почта</span>
                </div>
                <div className="relative flex flex-col w-[300px] items-start mt-6">
                    <input
                        onChange={(e) => {
                            // setBookInfo({ ...bookInfo, coverType: e.target.value });
                            setUserRole(e.target.value);
                        }}
                        className="w-full text-left pt-6 pb-2 font-medium text-lg px-5 border-[1px] border-gray-200 border-opacity-80 rounded-lg focus:outline-none focus:ring-1 focus:border-indigo-500 focus:border-opacity-90 focus:border-[1px] focus:bg-white focus:ring-indigo-300"
                        type="text"
                        defaultValue={userRole === "user" ? "Пользователь" : userRole === "admin" ? "Администратор" : "Модератор"}
                    />
                    <span className="absolute text-sm text-gray-500 left-3 top-1">Роль</span>
                </div>
                <button
                    onClick={() => {
                        updateUser();
                    }}
                    className="py-2 px-2 mt-6 bg-blue-400 rounded-lg text-medium text-white hover:bg-blue-500 animated-100 font-semibold"
                >
                    Обновить пользователя
                </button>
            </div>
        </div>
    );
}

function UserOrdersTab({ user }) {
    return (
        <div className="absolute top-[90px] left-[254px] pb-6 pt-6 px-10 right-0 bottom-0 flex flex-col items-center overflow-y-auto">
            <div className="w-full flex px-2 pointer-events-none">
                <span className="text-gray-500 text-base">
                    Все пользователи {">"} {user.username} {">"} Заказы
                </span>
            </div>
            <div className="max-w-[80%] w-full flex flex-col items-center">
                <div className="rounded-md bg-gray-100 h-[120px] w-full flex justify-between">
                    <div className=""></div>
                </div>
            </div>
        </div>
    );
}

function OnlineChatsTab({ setTabOption }) {
    async function getAvailableStuff() {
        try {
            const res = await axios.get(getAvailableStaffForChat_EP, authToken_header());
            return res.stuffId;
        } catch (error) {}
    }

    useEffect(() => {}, []);

    return (
        <div className="absolute top-[90px] left-[254px] pb-6 pt-6 px-10 right-0 bottom-0 flex flex-col items-center overflow-y-auto">
            <div className="w-full flex flex-col gap-4 items-center">
                <div className="flex border-[1px] rounded-md shadow-sm items-center justify-between p-4 w-full max-w-[500px]">
                    <span className="">Помогите разобраться..</span>
                    <button
                        onClick={() => {
                            setTabOption("ChatStarted");
                        }}
                        className="text-white rounded-lg bg-blue-500 px-2 py-2"
                    >
                        Начать чат
                    </button>
                </div>
                <div className="flex border-[1px] rounded-md shadow-sm items-center justify-between p-4 w-full max-w-[500px]">
                    <span className="">Помогите!</span>
                    <button
                        onClick={() => {
                            setTabOption("ChatStarted");
                        }}
                        className="text-white rounded-lg bg-blue-500 px-2 py-2"
                    >
                        Начать чат
                    </button>
                </div>
            </div>
        </div>
    );
}

function ChatWindowTab() {
    return (
        <div className="absolute top-[90px] left-[254px] pb-6 pt-6 px-10 right-0 bottom-0 flex flex-col items-center overflow-y-auto">
            <div className="w-full flex flex-col items-center shadow-lg rounded-lg py-4 border-[1px]">
                <div className="w-full flex justify-center h-[300px] overflow-y-auto py-2 px-2"></div>
                <div className="w-full px-3 flex justify-center gap-3">
                    <input
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                console.log("Enter");
                            }
                        }}
                        className="w-full rounded-lg bg-gray-100 py-1 px-2"
                        type="text"
                    />
                    <button className="bg-blue-500 text-white rounded-md px-3 py-1">Отправить</button>
                </div>
            </div>
        </div>
    );
}
