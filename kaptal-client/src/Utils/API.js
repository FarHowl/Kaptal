export const apiAddress = "http://api.local.app.garden";

// User
/**
 * @param {string} email
 * @param {string} password
 */
export const signIn_EP = apiAddress + "/api/users-service/user/signIn";

export const getBookImage_EP = apiAddress + "/api/book/getBookImage";

export const getAvailableStaffForChat_EP = apiAddress + "/api/user/getAvailableStaff";

/**
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @returns {string}
 */
export const signUp_EP = apiAddress + "/api/users-service/user/signUp";

export const getBookData_EP = apiAddress + "/api/books-service/user/getBookData";

export const getBookReviews_EP = apiAddress + "/api/reviews-service/user/getBookReviews";

export const addReview_EP = apiAddress + "/api/reviews-service/user/addReview";

//

// Admin
export const getAllBooks_EP = apiAddress + "/api/admin/getAllBooks";

export const addNewBook_EP = apiAddress + "/api/admin/addNewBook";

export const getAllUsers_EP = apiAddress + "/api/users-service/admin/getAllUsers";

export const updateBook_EP = apiAddress + "/api/admin/updateBook";

export const deleteBook_EP = apiAddress + "/api/admin/deleteBook";

/**
 * @param {string} userId - Provide id of user whose information you want to update
 * @param {string} role - Change user role to
 */
export const updateUserInformation_EP = apiAddress + "/api/admin/updateUser";

//
