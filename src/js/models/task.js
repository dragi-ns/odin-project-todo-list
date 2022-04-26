import { v4 as uuidv4 } from 'uuid';

class Task {
    #id;
    #dueDate;

    static Priority = Object.freeze({
        NORMAL: 'normal',
        LOW: 'low',
        MEDIUM: 'medium',
        HIGH: 'high'
    }); 

    constructor(title, description, dueDate, priority, completed = false) {
        this.#id = uuidv4();
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = completed;
        this.project = null;
    }

    get id() {
        return this.#id;
    }

    get dueDate() {
        return this.#dueDate;
    }

    set dueDate(newDate) {
        this.#dueDate = newDate;
        this.#dueDate.setHours(0, 0, 0, 0);
    }

    toggleCompleted() {
        this.completed = !this.completed;
    }
}

export default Task;
