function isObjectEmpty(object) {
    return Object.keys(object).length === 0;
}

function toTitleCase(str) {
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

function getTodaysDate(withTime = false) {
    const today = new Date();
    if (!withTime) {
        today.setHours(0, 0, 0, 0);
    }
    return today;
}

export {
    isObjectEmpty,
    toTitleCase,
    getTodaysDate
};
