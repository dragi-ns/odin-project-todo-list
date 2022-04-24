import { v4 as uuidv4 } from 'uuid';

class Task {
    #id;

    static Priority = Object.freeze({
        NORMAL: 'normal',
        LOW: 'low',
        MEDIUM: 'medium',
        HIGH: 'high'
    }); 

    constructor(title, description, priority, dueDate, completed = false) {
        this.#id = uuidv4();
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.dueDate = dueDate;
        this.completed = completed;
        this.project = null;
    }

    get id() {
        return this.#id;
    }

    toggleCompleted() {
        this.completed = !this.completed;
    }
}

export default Task;
