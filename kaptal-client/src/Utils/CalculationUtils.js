export function getRandomString(length) {
    let result = "";
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function removeItemFromArray(arr, value) {
    let index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

export function compactString(string, length) {
    let sliced;
    if (string.length < length) {
        sliced = string.slice(0, length);
    } else {
        if (string.slice(-1) === " ") sliced = string.slice(-1, length) + "...";
        else sliced = string.slice(0, length - 1) + "...";
    }
    return sliced;
}