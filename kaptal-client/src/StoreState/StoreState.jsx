import { Store } from "pullstate";

//
// ShoppingCartStore
export const ShoppingCartStore = new Store({ shoppingCart: [] });

export const addToCartAction = (item) => {
    ShoppingCartStore.update((s) => {
        let book = s.shoppingCart.find((i) => i.bookId === item.bookId);
        if (book) {
            book.amount += 1;
        } else {
            item.amount = 1;
            s.shoppingCart.push(item);
        }
    });
};

export const initCartAction = (items) => {
    ShoppingCartStore.update((s) => {
        for (const item of items) {
            s.shoppingCart.push(item);
        }
    });
};

export const removeFromCartAction = (item) => {
    ShoppingCartStore.update((s) => {
        s.shoppingCart = s.shoppingCart.map((i) => {
            if (i.bookId === item.bookId) {
                return { ...i, amount: i.amount - 1 };
            } else {
                return i;
            }
        });
    });
};

export const rmSameBooksFromCartAction = (item) => {
    ShoppingCartStore.update((s) => {
        s.shoppingCart = s.shoppingCart.filter((i) => i.bookId !== item.bookId);
    });
};

//
// WishlistStore
export const WishlistStore = new Store({ wishlist: [] });

export const initWishlistAction = (items) => {
    WishlistStore.update((s) => {
        for (const item of items) {
            s.wishlist.push(item);
        }
    });
};

export const addToWishlistAction = (item) => {
    WishlistStore.update((s) => {
        s.wishlist.push(item);
    });
};

export const removeFromWishlistAction = (item) => {
    console.log(item);
    console.log(WishlistStore.getRawState());
    WishlistStore.update((s) => {
        s.wishlist = s.wishlist.filter((i) => i.bookId !== item._id);
    });
};
