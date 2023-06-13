export const apiAddress = "http://api.local.app.garden";

// User
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
 * @returns {array}
 */
export const getAllCategories_EP = apiAddress + "/api/books-service/user/getAllCategories";

/**
 * @returns {array}
 */
export const getAllCollections_EP = apiAddress + "/api/books-service/user/getAllCollections";

//

// Admin
/**
 * @returns {array}
 */
export const getAllBooks_EP = apiAddress + "/api/books-service/admin/getAllBooks";

/**
 * @param {string} name
 * @param {string} author
 * @param {string} publicationDate
 * @param {string} category
 * @param {string} description
 * @param {string} image
 * @param {number} price
 * @param {number} stock
 * @param {string} coverType
 * @param {string} publisher
 * @param {string} series
 * @param {string} language
 * @param {string} size
 * @param {number} weight
 * @param {string} ISBN
 * @param {string} pagesCount
 * @param {string} ageLimit
 * @param {number} circulation
 * @param {number} year
 * @param {string} categoryPath
 * @param {array} collections
 */
export const addNewBook_EP = apiAddress + "/api/books-service/admin/addNewBook";

/**
 * @returns {array}
 */
export const getAllUsers_EP = apiAddress + "/api/users-service/admin/getAllUsers";

/**
 * @param {string} bookId
 * @param {string} name
 * @param {string} author
 * @param {string} publicationDate
 * @param {string} category
 * @param {string} description
 * @param {string} image
 * @param {number} price
 * @param {number} stock
 * @param {string} coverType
 * @param {string} publisher
 * @param {string} series
 * @param {string} language
 * @param {string} size
 * @param {number} weight
 * @param {string} ISBN
 * @param {string} pagesCount
 * @param {string} ageLimit
 * @param {number} circulation
 * @param {number} year
 * @param {string} categoryPath
 * @param {array} collections
 */
export const updateBook_EP = apiAddress + "/api/books-service/admin/updateBook";

/**
 * @param {string} bookId
 */
export const deleteBook_EP = apiAddress + "/api/books-service/admin/deleteBook";

/**
 * @returns {array}
 */
export const getUncheckedReviews_EP = apiAddress + "/api/reviews-service/moderator/getUncheckedReviews";

/**
 * @returns {status}
 */
export const checkReview_EP = apiAddress + "/api/reviews-service/moderator/checkReview";

/**
 * @param {string} userId
 * @param {string} role
 */
export const updateUserInformation_EP = apiAddress + "/api/users-service/admin/updateUser";

//
