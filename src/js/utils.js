function isObjectEmpty(object) {
    return Object.keys(object).length === 0;
}

function toTitleCase(str) {
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

export {
    isObjectEmpty,
    toTitleCase
};
