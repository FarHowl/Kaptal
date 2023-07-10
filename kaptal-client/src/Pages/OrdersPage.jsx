import { React, useEffect, useState } from "react";
import { showErrorNotification } from "../StoreState/NotificationStore";
import { getOrders_EP, getSeveralBooksData_EP } from "../Utils/API";
import { authToken_header } from "../Utils/LocalStorageUtils";
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
                <div>{ordersView}</div>
            </div>
        </div>
    );
}

function OrderTile({ order }) {
    const [orderBooks, setOrderBooks] = useState([]);

    async function getOrderBooksData() {
        try {
            let bookIds = [];
            for (const i of order.books) {
                bookIds.push(i.bookId);
            }

            const response = await axios.post(getSeveralBooksData_EP, { bookIds: [...bookIds] }, authToken_header());

            let a = [];
            for (const i of response.data) {
                for (const book of order.books) {
                    if (i._id === book.bookId) {
                        i.amount = book.amount;
                        a.push(i);
                    }
                }
            }

            setOrderBooks(a);
        } catch (error) {
            if (error?.response) showErrorNotification(error.response.data.error);
            else showErrorNotification(error);
        }
    }

    useEffect(() => {
        getOrderBooksData();
    }, []);

    return <div className=""></div>;
}
