export const apiAddress = "http://api.local.app.garden";

/**
 * @param {string} email
 * @param {string} password
 */
export const signIn_EP = apiAddress + "/api/users-service/user/signIn";

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

//

