import { v4 as uuidv4 } from 'uuid';

class Task {
    #id;

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
        this.dueDate.setHours(0, 0, 0, 0);
        this.priority = priority;
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
