import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import IconComponent from "../Icons/IconComponent";
import InputTile from "./InputTile";
import axios from "axios";
import { checkEmailCode_EP, sendEmailCode_EP, signUp_EP } from "../../Utils/API";
import { showErrorNotification } from "../../StoreState/NotificationStore";
import CrossIcon from "../Icons/CrossIcon";
import LoadingComponent from "./LoadingComponent";

export default function SignPopUp({ setIsSignOpened }) {
    const [userInfo, setUserInfo] = useState({ email: "", firstName: "", code: "", lastName: "", phoneNumber: "" });
    const [isPending, setIsPending] = useState(false);
    const [signTab, setSignTab] = useState("SignIn");

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

            if (error?.response?.data?.error === "Вы превысили допустимое количество попыток") {
                setIsSignOpened(false);
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

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            {signTab === "SignIn" ? (
                <div className="bg-white flex flex-col rounded-md relative px-6 pt-6 pb-8 gap-y-5 w-[350px]">
                    {isPending ? <LoadingComponent customStyle={"absolute inset-0 flex justify-center items-center bg-white rounded-md z-10"} /> : <></>}
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
                <div className="bg-white flex flex-col rounded-md relative px-6 pt-6 pb-8 gap-y-5 w-[350px]">
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
