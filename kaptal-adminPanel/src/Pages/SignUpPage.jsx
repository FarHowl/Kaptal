import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { signUp_EP, signIn_EP, getAllUsers_EP } from "../Utils/API";
import NavigationButton from "../Components/Icons/NavigationButton.jsx";
import IconComponent from "../Components/Icons/IconComponent.jsx";

export default function SignUpPage() {
    const navigate = useNavigate();
    const [signTab, setSignTab] = useState("signIn");

    async function signUp() {
        try {
            let username = document.getElementById("login").value;
            let password = document.getElementById("password").value;
            let email = document.getElementById("email").value;
            if (!username || !password || !email) {
                throw new Error("Enter all fields");
            }

            const res = await axios.post(signUp_EP, {
                username,
                password,
                email,
            });

            setSignTab("signIn");
            username = "";
            password = "";
            email = "";
        } catch (error) {
            if (error?.response) {
                console.log(error.response.data.error);
            } else {
                console.log(error);
            }
        }
    }

    async function signIn() {
        try {
            let email = document.getElementById("login").value;
            let password = document.getElementById("password").value;

            if (!email || !password) throw new Error();

            const res = await axios.post(signIn_EP, {
                email: email,
                password: password,
            });

            const user = JSON.stringify(res.data);
            localStorage.setItem("userData", user);
            navigate("/");
        } catch (error) {
            if (error?.response) {
                console.log(error.response.data.error);
            } else {
                console.log(error);
            }
        }
    }

    return (
        <>
            <div className="absolute flex justify-center items-center inset-0 w-full top-[90px]">
                <div className="flex w-[300px] flex-col border-[1.5px] gap-4 p-4 rounded-md">
                    <div className="w-full flex flex-start">
                        <span className="text-xl font-semibold">{signTab === "signIn" ? "Вход" : "Регистрация"}</span>
                    </div>
                    <div className="flex flex-col gap-2 px-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-sm after:content-['*'] ml-1 after:text-red-500">{signTab === "signIn" ? "Почта" : "Логин"}</span>
                            <input
                                id="login"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        if (signTab === "signIn") signIn();
                                        else signUp();
                                    }
                                }}
                                className="focus:outline-slate-400 border-[1px] rounded-sm px-2 py-1 text-sm"
                                placeholder="Введите логин"
                                type="text"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-sm after:content-['*'] ml-1 after:text-red-500">Пароль</span>
                            <input
                                id="password"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        if (signTab === "signIn") signIn();
                                        else signUp();
                                    }
                                }}
                                className="focus:outline-slate-400 border-[1px] rounded-sm px-2 py-1 text-sm"
                                placeholder="Введите пароль"
                                type="password"
                            />
                        </div>
                        {signTab === "signUp" ? (
                            <div className="flex flex-col gap-1">
                                <span className="text-sm after:content-['*'] ml-1 after:text-red-500">Email</span>
                                <input
                                    id="email"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            if (signTab === "signIn") signIn();
                                            else signUp();
                                        }
                                    }}
                                    className="invalid:border-pink-500 invalid:text-pink-600 focus:outline-slate-400 focus:invalid:outline-pink-500 focus:invalid:ring-pink-500 border-[1px] rounded-sm px-2 py-1 text-sm"
                                    placeholder="Введите почту"
                                    type="email"
                                />
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                    <div className="flex justify-center items-center gap-8 px-4">
                        <button
                            onClick={() => {
                                signTab === "signIn" ? signIn() : signUp();
                            }}
                            className="p-2 bg-indigo-400 hover:bg-indigo-500 animated-100 w-full rounded-sm text-white"
                        >
                            {signTab === "signIn" ? "Войти" : "Зарегистрироваться"}
                        </button>
                    </div>
                    <div className="flex justify-between w-full px-4">
                        <button
                            className="text-blue-400 hover:text-blue-600 animated-100 font-extralight underline underline-offset-2"
                            onClick={() => {
                                setSignTab("signUp");
                            }}
                        >
                            Создать аккаунт
                        </button>
                        <button
                            className="text-blue-400 hover:text-blue-600 animated-100 font-extralight underline underline-offset-2"
                            onClick={() => {
                                setSignTab("signIn");
                            }}
                        >
                            Вход
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
