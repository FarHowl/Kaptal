import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import IconComponent from "../Icons/IconComponent";
import InputTile from "./InputTile";
import axios from "axios";
import { checkEmailCode_EP, sendEmailCode_EP, signUp_EP } from "../../Utils/API";
import { showErrorNotification } from "../../StoreState/NotificationStore";
import CrossIcon from "../Icons/CrossIcon";
import LoadingComponent from "./LoadingComponent";

export default function SignPopUp({ setIsSignOpened, isSignOpened }) {
    const [userInfo, setUserInfo] = useState({ email: "", firstName: "", code: "", lastName: "", phoneNumber: "" });
    const [isPending, setIsPending] = useState(false);
    const [signTab, setSignTab] = useState("SignIn");
    const [timer, setTimer] = useState(300);
    const [availableAttempts, setAvailableAttempts] = useState(5);

    const navigate = useNavigate();

    async function checkEmailCode() {
        try {
            const response = await axios.post(checkEmailCode_EP, { email: userInfo.email, code: userInfo.code });

            if (response.data.message === "User does not exist") {
                setSignTab("SignUp");
            } else {
                setIsSignOpened(false);
                localStorage.setItem("userData", JSON.stringify(response.data));
                window.location.reload();
            }
        } catch (error) {
            if (error?.response) showErrorNotification(error.response.data.error);
            else showErrorNotification(error);

            if (error?.response?.data?.error === "Code invalid") {
                console.log("first");
                setAvailableAttempts((prev) => prev - 1);
            }
        }
    }

    async function sendEmailCode() {
        try {
            setIsPending(true);
            const response = await axios.post(sendEmailCode_EP, { email: userInfo.email });
            setIsPending(false);
            setSignTab("Code");
        } catch (error) {
            if (error?.response) showErrorNotification(error.response.data.error);
            else showErrorNotification(error);

            setIsPending(false);
        }
    }

    async function signUp() {
        try {
            const { phoneNumber, firstName, lastName, email, code } = userInfo;
            const response = await axios.post(signUp_EP, { code, phoneNumber, lastName, firstName, email });

            setIsSignOpened(false);
            localStorage.setItem("userData", JSON.stringify(response.data));
            navigate("/");
        } catch (error) {
            if (error?.response) showErrorNotification(error.response.data.error);
            else showErrorNotification(error);
        }
    }

    useEffect(() => {
        if (signTab === "Code") {
            let seconds = 300;

            const timer = setInterval(() => {
                seconds--;
                setTimer(seconds);

                if (seconds === 0 || !isSignOpened || signTab !== "Code") clearInterval(timer);
            }, 1000);
        }
    }, [signTab]);

    useEffect(() => {
        if (availableAttempts === 0) {
            setIsSignOpened(false);
            showErrorNotification("You have exceeded the number of attempts");
        }
    }, [availableAttempts]);

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-40">
            {signTab === "SignIn" ? (
                <div className="bg-white flex flex-col rounded-md relative px-6 pt-6 pb-8 gap-y-5 w-[350px]">
                    {isPending ? <LoadingComponent customStyle={"absolute inset-0 flex justify-center items-center bg-white rounded-md z-10"} /> : <></>}
                    <div className=" w-full flex justify-between items-center">
                        <span className="text-xl font-semibold">Вход и регистрация</span>
                        <IconComponent
                            onClick={() => {
                                setIsSignOpened(false);
                            }}
                            Icon={CrossIcon}
                            size={20}
                            color={"#3BA5ED"}
                            hoveredColor={"#1b90e0"}
                            animation={"animated-100"}
                            buttonStyle={"w-[40px] h-[40px] flex justify-center items-center bg-slate-200 animated-100 rounded-md hover:bg-slate-300"}
                        />
                    </div>
                    <div>
                        <span className="text-gray-500">Для входа или регистрации, пожалуйста, введите свой email</span>
                    </div>
                    <InputTile
                        title={"Почта"}
                        defaultValue={""}
                        onChange={(e) => {
                            setUserInfo({ ...userInfo, email: e.target.value });
                        }}
                    />
                    <div className="w-full flex">
                        <button
                            onClick={() => {
                                sendEmailCode();
                            }}
                            className="py-2 w-full rounded-md text-white animated-100 font-semibold bg-sky-400 hover:bg-sky-500"
                        >
                            Получить код
                        </button>
                    </div>
                </div>
            ) : signTab === "Code" ? (
                <div className="bg-white flex flex-col rounded-md relative px-6 pt-6 pb-6 gap-y-5 w-[350px]">
                    <div className=" w-full flex justify-between items-center">
                        <span className="text-xl font-semibold">Вход и регистрация</span>
                        <IconComponent
                            onClick={() => {
                                setIsSignOpened ? setIsSignOpened(false) : setIsSignOpened(false);
                            }}
                            Icon={CrossIcon}
                            size={20}
                            color={"#3BA5ED"}
                            hoveredColor={"#1b90e0"}
                            animation={"animated-100"}
                            buttonStyle={"w-[40px] h-[40px] flex justify-center items-center bg-slate-200 animated-100 rounded-md hover:bg-slate-300"}
                        />
                    </div>
                    <div className="w-full">
                        <button
                            onClick={() => {
                                setSignTab("SignIn");
                            }}
                            className="text-gray-500"
                        >
                            <span className="font-semibold text-lg">{"<"}</span>Указать другой email
                        </button>
                    </div>
                    <div>
                        <span className="text-gray-800">
                            На почту <span className="text-black font-semibold">{userInfo.email}</span> было отправлено письмо с кодом для входа
                        </span>
                    </div>
                    {console.log("")}
                    <InputTile
                        title={"Код"}
                        defaultValue={""}
                        onChange={(e) => {
                            setUserInfo({ ...userInfo, code: e.target.value });
                        }}
                    />
                    <div className="w-full flex justify-center -mb-2 -mt-2">
                        <span className="font-semibold text-lg text-red-500">
                            {timer >= 60 ? Math.floor(timer / 60) + ":" + (timer % 60 >= 10 ? timer % 60 : "0" + (timer % 60)) : "0:" + (timer >= 10 ? timer : "0" + timer)}
                        </span>
                    </div>
                    <div className="flex flex-col items-center gap-y-3">
                        <div className="w-full flex">
                            <button
                                onClick={() => {
                                    checkEmailCode();
                                }}
                                className="py-2 w-full rounded-md text-white animated-100 font-semibold bg-sky-400 hover:bg-sky-500"
                            >
                                Продолжить
                            </button>
                        </div>
                        <div className="w-full flex justify-center">
                            <span className="font-light text-md text-gray-600">Осталось {availableAttempts} попыток</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white flex flex-col rounded-md relative px-6 pt-6 pb-8 gap-y-5 w-[350px]">
                    <div className=" w-full flex justify-between items-center">
                        <span className="text-xl font-semibold">Регистрация</span>
                        <IconComponent
                            onClick={() => {
                                setIsSignOpened ? setIsSignOpened(false) : setIsSignOpened(false);
                            }}
                            Icon={CrossIcon}
                            size={20}
                            color={"#3BA5ED"}
                            hoveredColor={"#1b90e0"}
                            animation={"animated-100"}
                            buttonStyle={"w-[40px] h-[40px] flex justify-center items-center bg-slate-200 animated-100 rounded-md hover:bg-slate-300"}
                        />
                    </div>
                    <div className="w-full">
                        <button
                            onClick={() => {
                                setSignTab("SignIn");
                            }}
                            className="text-gray-500"
                        >
                            <span className="font-semibold text-lg">{"< "}</span>Указать другой email
                        </button>
                    </div>
                    {console.log("")}
                    <InputTile
                        defaultValue={""}
                        title={"Имя"}
                        onChange={(e) => {
                            setUserInfo({ ...userInfo, firstName: e.target.value });
                        }}
                    />
                    {console.log("")}
                    <InputTile
                        defaultValue={""}
                        title={"Фамилия"}
                        onChange={(e) => {
                            setUserInfo({ ...userInfo, lastName: e.target.value });
                        }}
                    />
                    <InputTile
                        defaultValue={""}
                        title={"Телефон"}
                        onChange={(e) => {
                            setUserInfo({ ...userInfo, phoneNumber: e.target.value });
                        }}
                    />
                    <div className="w-full flex">
                        <button
                            onClick={() => {
                                signUp();
                            }}
                            className="py-2 w-full rounded-md text-white animated-100 font-semibold bg-sky-400 hover:bg-sky-500"
                        >
                            Зарегистрироваться
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
