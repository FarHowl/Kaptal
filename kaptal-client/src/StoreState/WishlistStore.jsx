import { Store } from "pullstate";
import axios from "axios";
import { addBookToWishlist_EP, getWishlist_EP, removeBookFromWishlist_EP } from "../Utils/API";
import { authToken_header, getUserData } from "../Utils/LocalStorageUtils";
import { showErrorNotification } from "./NotificationStore";

async function getWishlist() {
    try {
        const res = await axios.get(getWishlist_EP, authToken_header());

        return res.data;
    } catch (error) {
        if (error?.response) showErrorNotification(error.response.data.error);
        else showErrorNotification(error);
    }
}

export const WishlistStore = getUserData() ? new Store({ wishlist: await getWishlist() }) : new Store({ wishlist: [] });

export const addToWishlistAction = async (item) => {
    await axios.post(
        addBookToWishlist_EP,
        {
            bookId: item._id,
        },
        authToken_header()
    );

    WishlistStore.update((s) => {
        let itemToSave = { bookId: item._id };
        s.wishlist.push(itemToSave);
    });
};

export const removeFromWishlistAction = async (item) => {
    await axios.post(removeBookFromWishlist_EP, { bookId: item._id }, authToken_header());

    WishlistStore.update((s) => {
        s.wishlist = s.wishlist.filter((i) => i.bookId !== item._id);
    });
};
