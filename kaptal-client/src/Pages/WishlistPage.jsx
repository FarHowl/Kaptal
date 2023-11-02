import { React, useEffect, useState } from "react";
import { getSeveralParticularBooksData_EP, getWishlistBooks_EP } from "../Utils/API";
import { authToken_header, getUserData } from "../Utils/LocalStorageUtils";
import { useStoreState } from "pullstate";
import axios from "axios";
import BookTile from "../Components/Book/BookTile";
import { ShoppingCartStore } from "../StoreState/ShoppingCartStore";
import { WishlistStore } from "../StoreState/WishlistStore";
import { showErrorNotification } from "../StoreState/NotificationStore";

export default function WishlistPage() {
    const shoppingCart = useStoreState(ShoppingCartStore).shoppingCart;
    const wishlist = useStoreState(WishlistStore).wishlist;
    const [wishlistBooks, setWishlistBooks] = useState([]);

    async function getWishlistBooks() {
        try {
            const bookIds = wishlist.map((item) => item.bookId);

            const response = await axios.post(getSeveralParticularBooksData_EP, { bookIds, requiredFields: { _id: 1, name: 1, author: 1, price: 1, discount: 1, stock: 1, image: 1 } });

            let a = [];
            for (const i of response.data) {
                a.push(<BookTile book={i} key={i._id} />);
            }

            setWishlistBooks(a);
        } catch (error) {
            if (error?.response) showErrorNotification(error.response.data.error);
            else showErrorNotification(error);
        }
    }

    useEffect(() => {
        if (getUserData()) {
            getWishlistBooks();
        }

        console.log(wishlist?.length === 0);
    }, [wishlist]);

    return (
        <div className="w-full flex flex-col justify-center items-center px-6">
            <div className="max-w-[1240px] w-full flex flex-col justify-center items-center mt-8 flex-wrap gap-y-8">
                <div className="flex flex-col gap-y-3 w-full">
                    <span className="text-3xl font-bold">Желаемое</span>
                    {wishlist?.length != 0 ? (
                        <div className="flex w-full items-center gap-3">{wishlistBooks}</div>
                    ) : (
                        <div className="w-full flex justify-center">
                            <span className="text-2xl font-medium">Ваш список желаемого пока пуст :(</span>
                        </div>
                    )}
                </div>
                {!getUserData() ? (
                    <div className="w-full flex justify-center">
                        <span className="text-2xl font-medium">Для просмотра списка желаемого нужно войти на сайт :(</span>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
