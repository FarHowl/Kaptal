export const clientServerAddress = "http://localhost:3020";
export const adminServerAddress = "http://localhost:3030";

// User
/**
 * @param {string} email
 * @param {string} password
 */
export const signIn_EP = clientServerAddress + "/api/user/signIn";

export const getBookImage_EP = clientServerAddress + "/api/book/getBookImage";

export const getAvailableStaffForChat_EP = clientServerAddress + "/api/user/getAvailableStaff";

/**
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @returns {string}
 */
export const signUp_EP = clientServerAddress + "/api/user/signUp";

//

// Admin
export const getAllBooks_EP = adminServerAddress + "/api/admin/getAllBooks";

export const addNewBook_EP = adminServerAddress + "/api/admin/addNewBook";

export const getAllUsers_EP = adminServerAddress + "/api/admin/getAllUsers";

export const updateBook_EP = adminServerAddress + "/api/admin/updateBook";

export const deleteBook_EP = adminServerAddress + "/api/admin/deleteBook";

/**
 * @param {string} userId - Provide id of user whose information you want to update
 * @param {string} role - Change user role to
 */
export const updateUserInformation_EP = clientServerAddress + "/api/admin/updateUser";

//
