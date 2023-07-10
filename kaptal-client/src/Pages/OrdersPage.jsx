import { React, useEffect, useState } from "react";
import { showErrorNotification } from "../StoreState/NotificationStore";
import { getOrders_EP, getOrderBooksData_EP, getBookImage_EP, getSeveralParticularBooksData_EP } from "../Utils/API";
import { authToken_header } from "../Utils/LocalStorageUtils";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function OrdersPage() {
    const [ordersView, setOrdersView] = useState([]);

    async function getOrders() {
        try {
            const response = await axios.get(getOrders_EP, authToken_header());

            let a = [];
            for (const i of response.data) {
                a.push(<OrderTile order={i} key={i._id} />);
            }

            setOrdersView(a);
        } catch (error) {
            if (error?.response) showErrorNotification(error.response.data.error);
            else showErrorNotification(error);
        }
    }

    useEffect(() => {
        getOrders();
    }, []);

    return (
        <div className="w-full flex flex-col justify-center items-center px-6">
            <div className="max-w-[1240px] w-full flex flex-col justify-center items-center mt-8 flex-wrap gap-y-6 mb-16">
                <div className="w-full justify-start">
                    <span className="text-3xl font-bold">Заказы</span>
                </div>
                <div className="flex flex-col w-full items-center gap-y-5">{ordersView}</div>
            </div>
        </div>
    );
}

function OrderTile({ order }) {
    const [orderBooksTiles, setOrderBooksTiles] = useState([]);
    const navigate = useNavigate();

    async function getOrderBooksTiles() {
        try {
            let bookIds = [];
            for (const i of order.books) {
                bookIds.push(i.bookId);
            }

            const response = await axios.post(getSeveralParticularBooksData_EP, { bookIds: [...bookIds], requiredFields: { _id: 1, image: 1 } }, authToken_header());

            let a = [];
            for (const i of response.data) {
                const image = (
                    <div key={i._id}
                        onClick={() => {
                            navigate("/book/" + i._id);
                        }}
                        className="border-gray-100 border-2 flex-shrink-0 rounded-md w-[100px] h-[120px] flex justify-center items-center cursor-pointer"
                    >
                        <div className="w-[60px] h-[90px]">
                            <img src={getBookImage_EP + "?imgName=" + i.image} alt="" className="w-full h-full object-contain" />
                        </div>
                    </div>
                );
                a.push(image);
            }

            setOrderBooksTiles(a);
        } catch (error) {
            if (error?.response) showErrorNotification(error.response.data.error);
            else showErrorNotification(error);
        }
    }

    useEffect(() => {
        getOrderBooksTiles();
    }, []);

    return (
        <div className="w-[900px] flex flex-col border-gray-200/60 border-2 rounded-md px-6 py-4 gap-y-6">
            <div className="justify-between w-full flex">
                <span className="text-lg font-medium cursor-pointer animated-100 hover:text-sky-500">Заказ от {order.date}</span>
                <span className="bg-gray-100 px-3 py-1 rounded-md">{order.status === "created" ? "Создан" : order.status === "pending" ? "В обработке" : ""}</span>
            </div>
            <div className="justify-between w-full flex items-center">
                <div className="flex flex-col">
                    <span className="font-light">{order.paymentMethod === "offline" ? "Оплата при получении" : "Оплата картой онлайн"}</span>
                    <div className="flex gap-x-2">
                        <span className="font-medium">{order.deliveryAddress}</span>
                        <span className="font-medium">{order.deliveryMethod === "self" ? "Самовывоз" : "Курьерская доставка"}</span>
                    </div>
                </div>
                <span className="font-medium text-xl">{order.totalPrice} ₽</span>
            </div>
            <div className="flex gap-x-3 overflow-x-auto">{orderBooksTiles}</div>
        </div>
    );
}
