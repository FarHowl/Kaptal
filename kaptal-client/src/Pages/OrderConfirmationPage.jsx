import { React, useState, useEffect } from "react";
import InputTile from "../Components/UI/InputTile";

export default function OrderConfirmationPage() {
    const [orderInfo, setOrderInfo] = useState({ customer: {}, paymentMethod: "", deliveryMethod: "", deliveryAddress: "" });

    return (
        <div className="w-full flex flex-col justify-center items-center px-6">
            <div className="max-w-[1400px] w-full flex flex-col justify-center items-center mt-8 flex-wrap gap-y-6">
                <div className="w-full justify-start">
                    <span className="text-3xl font-bold">Оформление заказа</span>
                </div>
                <div className="flex flex-col w-full gap-y-12">
                    <div className="w-full flex flex-col items-start px-4 gap-y-4">
                        <div className="relative">
                            <div className="absolute -left-3 border-r-[3px] h-full border-sky-500"></div>
                            <span className="text-xl font-medium">Способ получения</span>
                        </div>
                        <div className="flex gap-x-3">
                            <button>Самовывоз</button>
                            <button>Курьером</button>
                        </div>
                    </div>
                    <div className="w-full flex flex-col items-start px-4 gap-y-4">
                        <div className="relative">
                            <div className="absolute -left-3 border-r-[3px] h-full border-sky-500"></div>
                            <span className="text-xl font-medium">Способ оплаты</span>
                        </div>
                        <div className="flex gap-x-4">
                            <div
                                onClick={() => {
                                    setOrderInfo({ ...orderInfo, paymentMethod: "card" });
                                }}
                                className={
                                    "flex flex-col items-center gap-y-1 justify-center w-[240px] border-2 py-4 rounded-md cursor-pointer animated-100 px-5 " +
                                    (orderInfo.paymentMethod === "card" ? "border-sky-500" : "border-gray-200 hover:border-sky-300")
                                }
                            >
                                <span className="font-medium">Картой онлайн</span>
                                <span className="text-sm text-gray-500 text-center">Оплатить картой сейчас</span>
                            </div>
                            <div
                                onClick={() => {
                                    setOrderInfo({ ...orderInfo, paymentMethod: "cash" });
                                }}
                                className={
                                    "flex flex-col items-center gap-y-1 justify-center w-[240px] border-2 py-4 rounded-md cursor-pointer animated-100 px-5 " +
                                    (orderInfo.paymentMethod === "cash" ? "border-sky-500" : "border-gray-200 hover:border-sky-300")
                                }
                            >
                                <span className="font-medium">При получении</span>
                                <span className="text-sm text-gray-500 text-center">Оплатить картой или наличными при получении</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex flex-col items-start px-4 gap-y-4">
                        <div className="relative">
                            <div className="absolute -left-3 border-r-[3px] h-full border-sky-500"></div>
                            <span className="text-xl font-medium">Получатель</span>
                        </div>
                        <div className="flex flex-col w-[300px] gap-y-4">
                            <InputTile
                                title={"ФИО"}
                                onChange={(e) => {
                                    setOrderInfo({ ...orderInfo, customer: { fullName: e.target.value } });
                                }}
                            />
                            <InputTile
                                title={"Электронная почта"}
                                onChange={(e) => {
                                    setOrderInfo({ ...orderInfo, customer: { email: e.target.value } });
                                }}
                                type={"email"}
                            />
                            <InputTile
                                title={"Телефон"}
                                onChange={(e) => {
                                    setOrderInfo({ ...orderInfo, customer: { phoneNumber: e.target.value } });
                                }}
                                type={"tel"}
                                useEffectProp={(value, setValue) => {
                                    const formattedValue = value.replace(/[^\d+]/g, ""); // Удаляем все символы, кроме цифр и "+"
                                    if (formattedValue.length > 2 && formattedValue.length <= 15) {
                                        const countryCode = "+7";
                                        let formattedNumber = formattedValue.slice(2); // Удаляем первые два символа
                                        // Добавляем пробелы и дефисы в нужные позиции
                                        formattedNumber = formattedNumber.replace(/^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/, (_, group1, group2, group3, group4) => {
                                            let result = "";
                                            if (group1) result += `${group1} `;
                                            if (group2) result += `${group2} `;
                                            if (group3) result += `${group3}-`;
                                            if (group4) result += `${group4}-`;
                                            return result;
                                        });
                                        // Удаляем лишние пробелы, дефисы и добавляем "+7"
                                        formattedNumber = formattedNumber.replace(/[\s-]+$/, "");
                                        setValue(`${countryCode} ${formattedNumber}`);
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
