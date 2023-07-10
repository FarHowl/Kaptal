export const apiAddress = "http://api.local.app.garden";

/**
 * @param {string} email
 * @param {string} password
 */

export const refreshToken_EP = apiAddress + "/api/users-service/user/refreshToken";

/**
 * @param {string} bookId
 */
export const getBookImage_EP = apiAddress + "/api/books-service/user/getBookImage";

// export const getAvailableStaffForChat_EP = apiAddress + "/api/user/getAvailableStaff";

/**
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @returns {string}
 */
export const signUp_EP = apiAddress + "/api/users-service/user/signUp";

/**
 * @param {string} bookId
 * @returns {object}
 */
export const getBookData_EP = apiAddress + "/api/books-service/user/getBookData";

export const getSeveralBooksData_EP = apiAddress + "/api/books-service/user/getSeveralBooksData";

/**
 * @param {string} bookId
 * @returns {array}
 */
export const getBookReviews_EP = apiAddress + "/api/reviews-service/user/getBookReviews";

/**
 * @param {string} bookId
 */
export const getBookRating_EP = apiAddress + "/api/reviews-service/user/getBookRating";

/**
 * @param {string} bookId
 * @param {string} userId
 * @param {number} bookRating
 * @param {string} pros
 * @param {string} cons
 * @param {string} text
 * @param {string} title
 * @param {string} author
 */
export const addReview_EP = apiAddress + "/api/reviews-service/user/addReview";

/**
 * @param {string} bookId
 * @param {string} userId
 * @param {number} bookRating
 */
export const addRating_EP = apiAddress + "/api/reviews-service/user/addRating";

/**
 * @param {string} reviewId
 */
export const rateReview_EP = apiAddress + "/api/reviews-service/user/rateReview";

/**
 * @returns {array}
 */
export const getAllCategories_EP = apiAddress + "/api/books-service/user/getAllCategories";

/**
 * @returns {array}
 */
export const getAllCollections_EP = apiAddress + "/api/books-service/user/getAllCollections";

/**
 * @param {string} collection
 */
export const getBooksByCollection_EP = apiAddress + "/api/books-service/user/getBooksByCollection";

/**
 * @param {string} collection
 */
export const getBooksBarByCollection_EP = apiAddress + "/api/books-service/user/getBooksBarByCollection";

export const addBookToWishlist_EP = apiAddress + "/api/users-service/user/addBookToWishlist";

export const removeBookFromWishlist_EP = apiAddress + "/api/users-service/user/removeBookFromWishlist";

export const addBookToShoppingCart_EP = apiAddress + "/api/users-service/user/addBookToShoppingCart";

export const removeBookFromShoppingCart_EP = apiAddress + "/api/users-service/user/removeBookFromShoppingCart";

export const getShoppingCart_EP = apiAddress + "/api/users-service/user/getShoppingCart";

export const getWishlist_EP = apiAddress + "/api/users-service/user/getWishlist";

export const getShoppingCartBooks_EP = apiAddress + "/api/books-service/user/getShoppingCartBooks";

export const getWishlistBooks_EP = apiAddress + "/api/books-service/user/getWishlistBooks";

export const sendEmailCode_EP = apiAddress + "/api/users-service/user/sendEmailCode";

export const checkEmailCode_EP = apiAddress + "/api/users-service/user/checkEmailCode";

export const makeOrder_EP = apiAddress + "/api/orders-service/user/makeOrder";

export const getOrders_EP = apiAddress + "/api/orders-service/user/getOrders";

export const getUserData_EP = apiAddress + "/api/users-service/user/getUserData";

//
