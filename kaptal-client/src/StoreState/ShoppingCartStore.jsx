import { Store } from "pullstate";
import axios from "axios";
import { addBookToShoppingCart_EP, getShoppingCart_EP, removeBookFromShoppingCart_EP } from "../Utils/API";
import { authToken_header, getUserData } from "../Utils/LocalStorageUtils";

//
// ShoppingCartStore

async function getShoppingCart() {
    try {
        const res = await axios.get(getShoppingCart_EP, authToken_header());

        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export const ShoppingCartStore = getUserData() ? new Store({ shoppingCart: await getShoppingCart() }) : new Store({ shoppingCart: [] });

export const addToCartAction = async (item) => {
    if (getUserData()) {
        await axios.post(
            addBookToShoppingCart_EP,
            {
                bookId: item._id,
            },
            authToken_header()
        );
    }

    ShoppingCartStore.update((s) => {
        let book = s.shoppingCart.find((i) => i.bookId === item._id);
        if (book) {
            book.amount += 1;
        } else {
            let itemToSave = { amount: 1, bookId: item._id };
            s.shoppingCart.push(itemToSave);
        }
    });
};

export const removeFromCartAction = async (item) => {
    await axios.post(removeBookFromShoppingCart_EP, { bookId: item._id, amount: 1 }, authToken_header());

    ShoppingCartStore.update((s) => {
        s.shoppingCart = s.shoppingCart.map((i) => {
            if (i.bookId === item._id) {
                return { ...i, amount: i.amount - 1 };
            } else {
                return i;
            }
        });
    });
};

export const rmSameBooksFromCartAction = async (item) => {
    await axios.post(removeBookFromShoppingCart_EP, { bookId: item._id, amount: "all" }, authToken_header());

    ShoppingCartStore.update((s) => {
        s.shoppingCart = s.shoppingCart.filter((i) => i.bookId !== item._id);
    }); 
};