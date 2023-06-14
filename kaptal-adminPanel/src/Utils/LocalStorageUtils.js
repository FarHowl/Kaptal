export function authToken_header() {
    let token;
    if (getUserData()) {
        token = getUserData().authToken;
    }
    return { headers: { authorization: "Bearer " + token } };
}

export function getUserData() {
    return JSON.parse(localStorage.getItem("userData"));
}

export function logOut() {
    localStorage.setItem("userData", null);
}
