class Storage {
    #storageKey;

    constructor(storageKey) {
        this.#storageKey = storageKey;
    }

    get storageKey() {
        return this.#storageKey;
    }

    loadData() {
        const data = localStorage.getItem(this.#storageKey);
        if (!data) {
            return null;
        }
        return JSON.parse(data);
    }

    saveData(data) {
        localStorage.setItem(this.#storageKey, JSON.stringify(data));
    }
}

export default Storage;
